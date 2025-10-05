import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { employeeSchemas } from "../src/api/v1/validation/employeeValidation";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Employee Validation Schemas", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {},
        };
        mockNext = jest.fn();
    });

    //CREATE SCHEMA TEST
    it("should validate valid employee creation data", () => {
        // Arrange
        mockReq.body = {
            name: "John Doe",
            position: "Manager",
            department: "Sales",
            email: "john.doe@example.com",
            phone: "123-456-7890",
            branchId: 1,
        };
        const middleware = validateRequest(employeeSchemas.create);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should reject missing required fields for create schema", () => {
        // Arrange
        mockReq.body = {
            name: "John Doe",
        };
        const middleware = validateRequest(employeeSchemas.create);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining("Validation error"),
        });
    });

    // UPDATE SCHEMA TEST
    it("should validate valid employee update data", () => {
        // Arrange
        mockReq.params = { id: "123" };
        mockReq.body = {
            name: "Jane Smith",
            email: "jane.smith@company.ca",
        };
        const middleware = validateRequest(employeeSchemas.update);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should reject invalid email and missing id in update schema", () => {
        // Arrange
        mockReq.params = {}; 
        mockReq.body = { email: "not-an-email" };
        const middleware = validateRequest(employeeSchemas.update);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining("Validation error"),
        });
    });
});
