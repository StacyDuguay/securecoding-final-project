import { Request, Response, NextFunction } from "express";
import * as employeeController from "../src/api/v1/controllers/employeeController";
import * as employeeService from "../src/api/v1/services/employeeServices";
import { Employee } from "../src/api/v1/models/employeeModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { Http2ServerResponse } from "node:http2";

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
                    position: "Developer", 
                    department: "Developer Team", 
                    email: "alice@test.com", 
                    phone: "555-1234", 
                    branchId: 1 
                },
            ];
            (employeeService.getAllEmployees as jest.Mock).mockResolvedValue(mockEmployees);

            // Act
            await employeeController.getAllEmployees(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

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
            (employeeService.getAllEmployees as jest.Mock).mockRejectedValue(HTTP_STATUS.BAD_REQUEST);

            // Act
            await employeeController.getAllEmployees(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
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
                position: "Developer", 
                department: "Developer Team", 
                email: "alice@test.com", 
                phone: "555-1234", 
                branchId: 1 
            };
            mockReq.params = { id: "1" };
            (employeeService.getEmployeeById as jest.Mock).mockResolvedValue(mockEmployee);

            // Act
            await employeeController.getEmployeeById(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

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
            await employeeController.getEmployeeById(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Employee ID is required" });
        });

        it("should return 404 if employee not found", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            (employeeService.getEmployeeById as jest.Mock).mockResolvedValue(null);

            // Act
            await employeeController.getEmployeeById(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

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
                position: "Developer", 
                department: "Developer Team", 
                email: "alice@test.com", 
                phone: "555-1234", 
                branchId: 1 
            };
            const mockEmployee: Employee = { id: 1, ...mockBody };
            mockReq.body = mockBody;
            (employeeService.createEmployee as jest.Mock).mockResolvedValue(mockEmployee);

            // Act
            await employeeController.createEmployee(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee created successfully",
                data: mockEmployee,
            });
        });

        it("should return 400 if required fields are missing", async () => {
            // Arrange
            mockReq.body = { position: "Developer" }; 

            // Act
            await employeeController.createEmployee(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

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
            await employeeController.updateEmployee(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee updated successfully",
                data: mockEmployee,
            });
        });

        it("should call next with error on failure", async () => {
            // Arrange

            mockReq.params = { id: "1" };
            (employeeService.updateEmployee as jest.Mock).mockRejectedValue(HTTP_STATUS.BAD_REQUEST);

            // Act
            await employeeController.updateEmployee(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
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
            await employeeController.deleteEmployee(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(employeeService.deleteEmployee).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee deleted successfully",
            });
        });

        it("should call next with error on failure", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            (employeeService.deleteEmployee as jest.Mock).mockRejectedValue(HTTP_STATUS.BAD_REQUEST);

            // Act
            await employeeController.deleteEmployee(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        });

    /**
     * getEmployeesByBranch
     */

    describe("getEmployeesByBranch", () => {
        it("should return employees for a branch", async () => {
            // Arrange
            const mockEmployees = [{ 
                id: 1, 
                name: "John", 
                branchId: 1, 
                position:"Dev", 
                department:"IT", 
                email:"a@b.com", 
                phone:"123"
            }];
            mockReq.params = { branchId: "1" };
            (employeeService.getEmployeesByBranch as jest.Mock).mockResolvedValue(mockEmployees);

            // Act
            await employeeController.getEmployeesByBranch(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: "Employees for branch retrieved successfully", data: mockEmployees 
            });
        });

        it("should return 400 if branchId is missing", async () => {
            // Arrange
            mockReq.params = {};

            // Act
            await employeeController.getEmployeesByBranch(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Branch ID is required" });
        });
    });

    /**
     * getEmployeeByDepartment
     */

    describe("getEmployeesByDepartment", () => {
        it("should return employees for a department", async () => {
            // Arrange
            const mockEmployees = [{ 
                id: 1, 
                name: "John", 
                branchId: 1, 
                position:"Developer", 
                department:"Developer Team", 
                email:"a@b.com", 
                phone:"123"
            }];
            mockReq.params = { department: "IT" };
            (employeeService.getEmployeesByDepartment as jest.Mock).mockResolvedValue(mockEmployees);

            // Act
            await employeeController.getEmployeesByDepartment(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({ 
                message: "Employees for department retrieved successfully", data: mockEmployees 
            });
        });

        it("should return 400 if department param is missing", async () => {
            // Act
            mockReq.params = {};

            // Arrange
            await employeeController.getEmployeesByDepartment(
                mockReq as Request, 
                mockRes as Response, 
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Department is required" });
            });
        });
    });
});