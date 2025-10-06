import * as employeeService from "../src/api/v1/services/employeeServices";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Employee } from "../src/api/v1/models/employeeModel";

jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Employee Service", () => {
    const mockEmployee: Employee = {
        id: 1,
        name: "Alice",
        position: "Developer",
        department: "IT",
        email: "alice@example.com",
        phone: "555-1234",
        branchId: 101,
    };

    beforeEach(() => jest.clearAllMocks());

    it("should return all employees", async () => {
        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
            empty: false,
            docs: [{ data: () => mockEmployee }],
        });

        const result = await employeeService.getAllEmployees();

        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("employees");
        expect(result).toEqual([mockEmployee]);
    });

    it("should return an employee by ID", async () => {
        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
            exists: true,
            data: () => mockEmployee,
        });

        const result = await employeeService.getEmployeeById(1);

        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("employees", "1");
        expect(result).toEqual(mockEmployee);
    });

    it("should create a new employee", async () => {
        const newEmployeeData = {
            name: "Bob",
            position: "Manager",
            department: "HR",
            email: "bob@example.com",
            phone: "555-6789",
            branchId: 102,
        };

        const newId = 12345;
        jest.spyOn(Date, "now").mockReturnValue(newId);
        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(newId.toString());

        const result = await employeeService.createEmployee(newEmployeeData);

        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "employees",
            { id: newId, ...newEmployeeData },
            newId.toString()
        );
        expect(result).toEqual({ id: newId, ...newEmployeeData });
    });

    it("should update an existing employee", async () => {
        const updatedData = { position: "Lead Developer" };
        jest.spyOn(employeeService, "getEmployeeById").mockResolvedValue(mockEmployee);
        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);

        const result = await employeeService.updateEmployee(1, updatedData);

        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "employees",
            "1",
            { ...mockEmployee, ...updatedData }
        );
        expect(result.position).toBe("Lead Developer");
    });

    it("should delete an employee successfully", async () => {
        jest.spyOn(employeeService, "getEmployeeById").mockResolvedValue(mockEmployee);
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

        await employeeService.deleteEmployee(1);

        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("employees", "1");
    });

    it("should return employees by branch ID", async () => {
        (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue({
            empty: false,
            docs: [{ data: () => mockEmployee }],
        });

        const result = await employeeService.getEmployeesByBranch(101);

        expect(result).toEqual([mockEmployee]);
    });

    it("should return employees by department", async () => {
        (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue({
            empty: false,
            docs: [{ data: () => mockEmployee }],
        });

        const result = await employeeService.getEmployeesByDepartment("IT");

        expect(result).toEqual([mockEmployee]);
    });
});
