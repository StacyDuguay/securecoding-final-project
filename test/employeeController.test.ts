import { Request, Response, NextFunction } from "express";
import * as employeeController from "../src/api/v1/controllers/employeeController";
import * as employeeService from "../src/api/v1/services/employeeServices";
import { Employee } from "../src/api/v1/models/employeeModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/employeeServices");

describe("Employee Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockNext = jest.fn();
    });

    /**
     * getAllEmployees
     */
    describe("getAllEmployees", () => {
        it("should return all employees successfully", async () => {
            // Arrange
            const mockEmployees: Employee[] = [
                { 
                    id: 1, 
                    name: "Alice", 
                    position: "Dev", 
                    department: "IT", 
                    email: "alice@test.com", 
                    phone: "555-1234", 
                    branchId: 1 
                },
            ];
            (employeeService.getAllEmployees as jest.Mock).mockResolvedValue(mockEmployees);

            // Act
            await employeeController.getAllEmployees(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employees retrieved successfully",
                data: mockEmployees,
            });
        });

        it("should call next with error on failure", async () => {
            // Arrange
            const error = new Error("Service error");
            (employeeService.getAllEmployees as jest.Mock).mockRejectedValue(error);

            // Act
            await employeeController.getAllEmployees(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    /**
     * getEmployeeById
     */

    describe("getEmployeeById", () => {
        it("should return employee when ID is valid", async () => {
            // Arrange
            const mockEmployee: Employee = { 
                id: 1, 
                name: "Alice", 
                position: "Dev", 
                department: "IT", 
                email: "alice@test.com", 
                phone: "555-1234", 
                branchId: 1 
            };
            mockReq.params = { id: "1" };
            (employeeService.getEmployeeById as jest.Mock).mockResolvedValue(mockEmployee);

            // Act
            await employeeController.getEmployeeById(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee retrieved successfully",
                data: mockEmployee,
            });
        });

        it("should return 400 if ID is missing", async () => {
            // Arrange
            // mockReq.params.id is undefined

            // Act
            await employeeController.getEmployeeById(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Employee ID is required" });
        });

        it("should return 404 if employee not found", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            (employeeService.getEmployeeById as jest.Mock).mockResolvedValue(null);

            // Act
            await employeeController.getEmployeeById(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Employee with ID 1 not found" });
        });
    });

    /**
     * createEmployee
     */

    describe("createEmployee", () => {
        it("should create employee successfully", async () => {
            // Arrange
            const mockBody = { 
                name: "Alice", 
                position: "Dev", 
                department: "IT", 
                email: "alice@test.com", 
                phone: "555-1234", 
                branchId: 1 
            };
            const mockEmployee: Employee = { id: 1, ...mockBody };
            mockReq.body = mockBody;
            (employeeService.createEmployee as jest.Mock).mockResolvedValue(mockEmployee);

            // Act
            await employeeController.createEmployee(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee created successfully",
                data: mockEmployee,
            });
        });

        it("should return 400 if required fields are missing", async () => {
            // Arrange
            mockReq.body = { position: "Dev" }; // name missing

            // Act
            await employeeController.createEmployee(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Employee name is required" });
        });
    });

    /**
     * updateEmployee
     */

    describe("updateEmployee", () => {
        it("should update employee successfully", async () => {
            // Arrange
            const mockEmployee: Employee = { 
                id: 1, name: "Alice", 
                position: "Lead Dev", 
                department: "IT", 
                email: "alice@test.com", 
                phone: "555-1234", 
                branchId: 1 
            };
            mockReq.params = { id: "1" };
            mockReq.body = { position: "Lead Dev" };
            (employeeService.updateEmployee as jest.Mock).mockResolvedValue(mockEmployee);

            // Act
            await employeeController.updateEmployee(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee updated successfully",
                data: mockEmployee,
            });
        });

        it("should call next with error on failure", async () => {
            // Arrange
            const error = new Error("Service error");
            mockReq.params = { id: "1" };
            (employeeService.updateEmployee as jest.Mock).mockRejectedValue(error);

            // Act
            await employeeController.updateEmployee(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    /**
     * deleteEmployee
     */

    describe("deleteEmployee", () => {
        it("should delete employee successfully", async () => {
            // Arrange
            mockReq.params = { id: "1" };

            // Act
            await employeeController.deleteEmployee(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(employeeService.deleteEmployee).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee deleted successfully",
            });
        });

        it("should call next with error on failure", async () => {
            // Arrange
            const error = new Error("Service error");
            mockReq.params = { id: "1" };
            (employeeService.deleteEmployee as jest.Mock).mockRejectedValue(error);

            // Act
            await employeeController.deleteEmployee(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
