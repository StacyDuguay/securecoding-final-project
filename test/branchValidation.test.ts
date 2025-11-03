import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { branchSchemas } from "../src/api/v1/validation/branchValidation";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Branch Validation Schemas", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = { body: {}, params: {}, query: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {},
        };
        mockNext = jest.fn();
    });

    it("should validate valid branch creation data", () => {
        // Arrange
        mockReq.body = {
            id: 1,
            name: "Main Branch",
            address: "123 Main St",
            phone: "123-456-7890",
        };
        const middleware = validateRequest(branchSchemas.create);

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
            name: "Main Branch",
        };
        const middleware = validateRequest(branchSchemas.create);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining("Validation error"),
        });
    });

    it("should validate valid branch update data", () => {
        // Arrange
        mockReq.params = { id: "1" };
        mockReq.body = { address: "456 New St" };
        const middleware = validateRequest(branchSchemas.update);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should reject invalid phone and missing id in update schema", () => {
        // Arrange
        mockReq.params = {};
        mockReq.body = { phone: "invalid-phone" };
        const middleware = validateRequest(branchSchemas.update);

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
