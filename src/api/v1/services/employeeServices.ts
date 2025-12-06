import { Employee } from "../models/employeeModel";
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    getDocumentsByFieldValues,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION = "employees";

/**
 * Get all employees
 * @returns - Array of all employees
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
    try {
        const snapshot: QuerySnapshot<DocumentData> = await getDocuments(COLLECTION);

        const employees: Employee[] = snapshot.docs.map((doc) => {
            const data = doc.data() as Partial<Employee>;

            return {
                id: doc.id, 
                name: data.name ?? "",
                position: data.position ?? "",
                department: data.department ?? "",
                email: data.email ?? "",
                phone: data.phone ?? "",
                branchId: data.branchId ?? "",
            };
        });

        return structuredClone(employees);
    } catch (error) {
        throw error;
    }
};

/**
 * Get an employee by ID
 * @param id - Firestore-generated Employee ID
 * @returns - Employee object
 * @throws - Error if employee not found
 */
export const getEmployeeById = async (id: string): Promise<Employee> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

        if (!doc || !doc.exists) {
            throw new Error(`Employee with ID ${id} not found`);
        }

        const data = doc.data() as Partial<Employee>;

        const employee: Employee = {
            id: doc.id,
            name: data.name ?? "",
            position: data.position ?? "",
            department: data.department ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            branchId: data.branchId ?? "",
        };

        return structuredClone(employee);
    } catch (error) {
        throw error;
    }
};

/**
 * Create a new employee
 * @param employeeData - The data for the new employee
 * @returns - The created employee with generated Firestore ID
 */
export const createEmployee = async (
    employeeData: Omit<Employee, "id">
): Promise<Employee> => {
    try {
        const docId = await createDocument<Employee>(COLLECTION, employeeData);

        const newEmployee: Employee = {
            id: docId, 
            ...employeeData,
        };

        return structuredClone(newEmployee);
    } catch (error) {
        throw error;
    }
};

/**
 * Update an existing employee
 * @param id - Firestore document ID
 * @param employeeData - Fields to update
 * @returns - Updated employee
 * @throws - Error if employee not found
 */
export const updateEmployee = async (
    id: string,
    employeeData: Partial<Omit<Employee, "id">>
): Promise<Employee> => {
    try {
        const existingEmployee = await getEmployeeById(id);

        const updatedEmployee: Employee = {
            ...existingEmployee,
            ...employeeData,
        };

        await updateDocument<Employee>(COLLECTION, id, updatedEmployee);

        return structuredClone(updatedEmployee);
    } catch (error) {
        throw error;
    }
};

/**
 * Delete an employee
 * @param id - Firestore document ID
 * @throws - Error if employee not found
 */
export const deleteEmployee = async (id: string): Promise<void> => {
    try {
        await getEmployeeById(id);
        await deleteDocument(COLLECTION, id);
    } catch (error) {
        throw error;
    }
};

/**
 * Get all employees from a specific branch
 * @param branchId - Branch ID (string or number)
 * @throws - Error if Branch ID not found or no employees found
 */
export const getEmployeesByBranch = async (
    branchId: string | number
): Promise<Employee[]> => {
    try {
        if (!branchId) {
            throw new Error("Branch ID is required");
        }

        const snapshot = await getDocumentsByFieldValues(COLLECTION, [
            { fieldName: "branchId", fieldValue: branchId },
        ]);

        if (snapshot.empty) {
            throw new Error(`No employees found for branch ID ${branchId}`);
        }

        const employees: Employee[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Partial<Employee>;
            return {
                    id: doc.id,
                    name: data.name ?? "",
                    position: data.position ?? "",
                    department: data.department ?? "",
                    email: data.email ?? "",
                    phone: data.phone ?? "",
                    branchId: String(data.branchId ?? branchId ?? ""),
    };
});


        return structuredClone(employees);
    } catch (error) {
        throw error;
    }
};

/**
 * Get all employees from a specific department
 * @param department - Department name
 * @throws - Error if department not found
 */
export const getEmployeesByDepartment = async (
    department: string
): Promise<Employee[]> => {
    try {
        if (!department) {
            throw new Error("Department is required");
        }

        const snapshot = await getDocumentsByFieldValues(COLLECTION, [
            { fieldName: "department", fieldValue: department },
        ]);

        if (snapshot.empty) {
            throw new Error(`No employees found in department: ${department}`);
        }

        const employees: Employee[] = snapshot.docs.map((doc) => {
            const data = doc.data() as Partial<Employee>;
            return {
                id: doc.id,
                name: data.name ?? "",
                position: data.position ?? "",
                department: data.department ?? department,
                email: data.email ?? "",
                phone: data.phone ?? "",
                branchId: data.branchId ?? "",
            };
        });

        return structuredClone(employees);
    } catch (error) {
        throw error;
    }
};

