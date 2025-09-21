import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as employeeController from "../src/api/v1/controllers/employeeController";
import * as employeeService from "../src/api/v1/services/employeeServices";
import { Employee } from "../src/api/v1/models/employeeModel";

jest.mock("../src/api/v1/services/employeeServices");

describe("Employee Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe("getAllEmployees", () => {
        it("should handle successful operation", async () => {
            const mockEmployees: Employee[] = [
                {
                    id: 1,
                    name: "Dan",
                    position: "Manager",
                    department: "HR",
                    email: "dan@example.com",
                    phone: "555-1234",
                    branchId: 1,
                },
            ];

            (employeeService.getAllEmployees as jest.Mock).mockReturnValue(mockEmployees);

            await employeeController.getAllEmployees(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employees retrieved successfully",
                data: mockEmployees,
            });
        });
    });

    describe("createEmployee", () => {
        it("should handle successful creation", async () => {
            const mockBody = {
                name: "Bob",
                position: "Cashier",
                department: "Sales",
                email: "bob@example.com",
                phone: "555-2222",
                branchId: 1,
            };

            const mockEmployee: Employee = {
                id: 1,
                ...mockBody,
            };

            mockReq.body = mockBody;
            (employeeService.createEmployee as jest.Mock).mockReturnValue(mockEmployee);

            await employeeController.createEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee created successfully",
                data: mockEmployee,
            });
        });

        it("should return 400 when name is missing", async () => {
            mockReq.body = {
                position: "Cashier",
                department: "Sales",
                email: "bob@example.com",
                phone: "555-2222",
                branchId: 1,
            };

            await employeeController.createEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Employee name is required",
            });
        });
    });
});
