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
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);

        const employees: Employee[] = snapshot.docs.map((doc) => {
            const data = doc.data() as Partial<Employee>;

            return {
                id: Number(data.id) || 0,
                name: data.name ?? "",
                position: data.position ?? "",
                department: data.department ?? "",
                email: data.email ?? "",
                phone: data.phone ?? "",
                branchId: Number(data.branchId) || 0,
            };
        });

        return structuredClone(employees);
    } catch (error) {
        throw error;
    }
};

/**
 * Get an employee by ID
 * @param id - Employee ID
 * @returns - Employee object
 * @throws - Error if employee not found
 */
export const getEmployeeById = async (
    id: number
): Promise<Employee> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id.toString());

        if (!doc || !doc.exists) {
            throw new Error(`Employee with ID ${id} not found`);
        }

        const data = doc.data() as Partial<Employee>;

        const employee: Employee = {
            id: Number(data.id) || id,
            name: data.name ?? "",
            position: data.position ?? "",
            department: data.department ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            branchId: Number(data.branchId) || 0,
        };

        return structuredClone(employee);
    } catch (error) {
        throw error;
    }
};

/**
 * Create a new employee
 * @param employeeData - The data for the new employee
 * @returns - The created employee with generated ID
 */
export const createEmployee = async (
    employeeData: Omit<Employee, "id">
): Promise<Employee> => {
    try {
        const newId = Date.now();
        const newEmployee: Employee = {
            id: newId,
            ...employeeData,
        };

        await createDocument<Employee>(COLLECTION, newEmployee, newId.toString());

        return structuredClone(newEmployee);
    } catch (error) {
        throw error;
    }
};

/**
 * Update an existing employee
 * @param id - Employee ID
 * @param employeeData - Fields to update
 * @returns - Updated employee
 * @throws - Error if employee not found
 */
export const updateEmployee = async (
    id: number,
    employeeData: Partial<Omit<Employee, "id">>
): Promise<Employee> => {
    try {
        const existingEmployee = await getEmployeeById(id);

        const updatedEmployee: Employee = {
            ...existingEmployee,
            ...employeeData,
        };

        await updateDocument<Employee>(COLLECTION, id.toString(), updatedEmployee);

        return structuredClone(updatedEmployee);
    } catch (error) {
        throw error;
    }
};

/**
 * Delete an employee
 * @param id - Employee ID
 * @throws - Error if employee not found
 */
export const deleteEmployee = async (
    id: number
): Promise<void> => {
    try {
        await getEmployeeById(id);
        await deleteDocument(COLLECTION, id.toString());
    } catch (error) {
        throw error;
    }
};

/**
 * Get all employees from a specific branch
 * @param branchId - Branch ID
 * @throws -Error if Branch ID not found
 * @throws - Error if no employees are found within branch
 */
export const getEmployeesByBranch = async (
    branchId: number
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
                id: Number(data.id) || 0,
                name: data.name ?? "",
                position: data.position ?? "",
                department: data.department ?? "",
                email: data.email ?? "",
                phone: data.phone ?? "",
                branchId: Number(data.branchId) || branchId,
            };
        });

        return structuredClone(employees);
    } catch (error) {
        throw error;
    }
};

/**
 * Get all employees from a specific department
 * @param department - department where employee is from
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
                id: Number(data.id) || 0,
                name: data.name ?? "",
                position: data.position ?? "",
                department: data.department ?? department,
                email: data.email ?? "",
                phone: data.phone ?? "",
                branchId: Number(data.branchId) || 0,
            };
        });

        return structuredClone(employees);
    } catch (error) {
        throw error;
    }
};
