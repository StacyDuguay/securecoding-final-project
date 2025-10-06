import * as employeeService from "../src/api/v1/services/employeeServices";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";

jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Employee Service", () => {
    const mockEmployee = {
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
        // Arrange
        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
            empty: false,
            docs: [{ data: () => mockEmployee }],
        });

        // Act
        const result = await employeeService.getAllEmployees();

        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("employees");
        expect(result).toEqual([mockEmployee]);
    });

    it("should return an employee by ID", async () => {
        // Arrange
        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
            exists: true,
            data: () => mockEmployee,
        });

        // Act
        const result = await employeeService.getEmployeeById(1);

        // Assert
        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("employees", "1");
        expect(result).toEqual(mockEmployee);
    });

    it("should create a new employee", async () => {
        // Arrange
        const newEmployeeData = { name: "Bob", position: "Manager", department: "HR", email: "bob@example.com", phone: "555-6789", branchId: 102 };
        const newId = 12345;
        jest.spyOn(Date, "now").mockReturnValue(newId);
        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(newId.toString());

        // Act
        const result = await employeeService.createEmployee(newEmployeeData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "employees",
            { id: newId, ...newEmployeeData },
            newId.toString()
        );
        expect(result).toEqual({ id: newId, ...newEmployeeData });
    });

    it("should update an existing employee", async () => {
        // Arrange
        const updatedData = { position: "Lead Developer" };
        jest.spyOn(employeeService, "getEmployeeById").mockResolvedValue(mockEmployee);
        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);

        // Act
        const result = await employeeService.updateEmployee(1, updatedData);

        // Assert
        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "employees",
            "1",
            { ...mockEmployee, ...updatedData }
        );
        expect(result.position).toBe("Lead Developer");
    });

    it("should delete an employee successfully", async () => {
        // Arrange
        jest.spyOn(employeeService, "getEmployeeById").mockResolvedValue(mockEmployee);
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

        // Act
        await employeeService.deleteEmployee(1);

        // Assert
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("employees", "1");
    });

    it("should return employees by branch ID", async () => {
        // Arrange
        (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue({
            empty: false,
            docs: [{ data: () => mockEmployee }],
        });

        // Act
        const result = await employeeService.getEmployeesByBranch(101);

        // Assert
        expect(result).toEqual([mockEmployee]);
    });

    it("should return employees by department", async () => {
        // Arrange
        (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue({
            empty: false,
            docs: [{ data: () => mockEmployee }],
        });

        // Act
        const result = await employeeService.getEmployeesByDepartment("IT");

        // Assert
        expect(result).toEqual([mockEmployee]);
    });
});
