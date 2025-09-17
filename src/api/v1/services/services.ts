import { Employee, employees } from "../data/employees";

// In-memory storage
const employeeStorage: Employee[] = [...employees];

/**
 * Get all employees
 * @returns Array of all employees
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
    return structuredClone(employeeStorage);
};

/**
 * Create a new employee
 * @param employeeData The data for the new employee
 * @returns The created employee with generated ID
 */
export const createEmployee = async (employeeData: Omit<Employee, "id">): Promise<Employee> => {
    const newEmployee: Employee = {
        id: employeeStorage.length > 0 ? Math.max(...employeeStorage.map(e => e.id)) + 1 : 1,
        ...employeeData,
    };

    employeeStorage.push(newEmployee);
    return structuredClone(newEmployee);
};

/**
 * Update an existing employee
 * @param id Employee ID
 * @param employeeData Fields to update
 * @returns Updated employee
 * @throws Error if employee not found
 */
export const updateEmployee = async (
    id: number,
    employeeData: Partial<Omit<Employee, "id">>
): Promise<Employee> => {
    const index = employeeStorage.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Employee with ID ${id} not found`);

    employeeStorage[index] = { ...employeeStorage[index], ...employeeData };
    return structuredClone(employeeStorage[index]);
};

/**
 * Delete an employee
 * @param id Employee ID
 * @throws Error if employee not found
 */
export const deleteEmployee = async (id: number): Promise<void> => {
    const index = employeeStorage.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Employee with ID ${id} not found`);

    employeeStorage.splice(index, 1);
};