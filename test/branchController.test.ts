import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as branchController from "../src/api/v1/controllers/branchController"
import * as branchService from "../src/api/v1/services/branchServices"
import { Branch } from "../src/api/v1/models/branchModel"
import { mock } from "node:test";

jest.mock("../src/api/v1/services/branchServices.ts")

describe("Item Controller", () => {
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

    describe("getAllBranches", () => {
        it("should handle successful operation", async () => {
            const mockBranches = [
                {
                    id: 1, 
                    name: "Main",
                    address: "123 Main St",
                    phone: "555-1234" 
                },
            ];
            (branchService.getAllBranches as jest.Mock).mockResolvedValue(mockBranches);

            await branchController.getAllBranches(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branches retrieved successfully",
                data: mockBranches,
            });
        });
    });

    describe("createBranch", () => {
        it("should handle successful creation", async () => {
            const mockBody = {
                name: "Test Branch",
                address: "123 St",
                phone: "555-1234",
            };

            const mockBranch = { 
                id: 1, 
                ...mockBody 
            };

            mockReq.body = mockBody;

            (branchService.createBranch as jest.Mock).mockResolvedValue(mockBranch);

            await branchController.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch created successfully",
                data: mockBranch,
            });
        });

        it("should return 400 when name is missing", async () => {
            mockReq.body = { address: "123 St", phone: "555-1234" };

            await branchController.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch name is required",
            });
        });
    });
});