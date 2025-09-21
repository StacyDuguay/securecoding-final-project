import { Employee } from "../models/employeeModel";
import { employees } from "../../../data/employees"
import { Branch } from "../models/branchModel";
import { branches } from "src/data/branches";

// In-memory storage
const employeeStorage: Employee[] = [...employees];

/**
 * Get all employees
 * @returns - Array of all employees
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
    return structuredClone(employeeStorage);
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
    const employee: Employee | undefined = employeeStorage.find(e => e.id === id);

    if (!employee) {
        throw new Error(`Employee with ID ${id} not found`);
    }

    return structuredClone(employee);
};

/**
 * Create a new employee
 * @param employeeData - The data for the new employee
 * @returns - The created employee with generated ID
 */
export const createEmployee = async (
    employeeData: Omit<Employee, "id">
): Promise<Employee> => {
    const newEmployee: Employee = {
    id: Date.now(), 
    ...employeeData,
  };

  employeeStorage.push(newEmployee);
  
  return structuredClone(newEmployee);
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
    const index: number = employeeStorage.findIndex(e => e.id === id);

    if (index === -1) {
        throw new Error(`Employee with ID ${id} not found`)
    };

    employeeStorage[index] = { 
        ...employeeStorage[index],
        ...employeeData 
    };

    return structuredClone(employeeStorage[index]);
};

/**
 * Delete an employee
 * @param id - Employee ID
 * @throws - Error if employee not found
 */
export const deleteEmployee = async (
    id: number
): Promise<void> => {
    const index: number = employeeStorage.findIndex(e => e.id === id);

    if (index === -1) {
        throw new Error(`Employee with ID ${id} not found`)
    }

    employeeStorage.splice(index, 1);
};

/**
 * Get all employees from a specific branch
 * @param branchId - Branch ID
 * @throws -Error if Branch ID not found
 */
export const getEmployeesByBranch = async (
    branchId: number
): Promise<Employee[]> => {
    if (!branchId) throw new Error("Branch ID is required");

    return structuredClone(employeeStorage.filter(e => e.branchId === branchId));
};

/**
 * Get all employees from a specific department
 * @param department - department where employee is from
 * @throws - Error if department not found
 */
export const getEmployeesByDepartment = async (
    department: string
): Promise<Employee[]> => {
    if (!department) throw new Error("Department is required");

    return structuredClone(employeeStorage.filter(e => e.department === department));
};
