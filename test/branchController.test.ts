import { Request, Response, NextFunction } from "express";
import * as branchController from "../src/api/v1/controllers/branchController";
import * as branchService from "../src/api/v1/services/branchServices";
import { Branch } from "../src/api/v1/models/branchModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/branchServices");

describe("Branch Controller", () => {
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
     * getAllBranches
     */
    describe("getAllBranches", () => {
        it("should return all branches successfully", async () => {
            // Arrange
            const mockBranches: Branch[] = [
                { 
                    id: 1, name: "Main", 
                    address: "123 St", 
                    phone: "555-1234" 
                },
            ];
            (branchService.getAllBranches as jest.Mock).mockResolvedValue(mockBranches);

            // Act
            await branchController.getAllBranches(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branches retrieved successfully",
                data: mockBranches,
            });
        });

        it("should call next with error on failure", async () => {
            // Arrange
            const error = new Error("Service error");
            (branchService.getAllBranches as jest.Mock).mockRejectedValue(error);

            // Act
            await branchController.getAllBranches(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    /**
     * getBranchById
     */

    describe("getBranchById", () => {
        it("should return branch when ID is valid", async () => {
            // Arrange
            const mockBranch: Branch = { 
                id: 1, name: "Main", 
                address: "123 St", 
                phone: "555-1234" 
            };
            mockReq.params = { id: "1" };
            (branchService.getBranchById as jest.Mock).mockResolvedValue(mockBranch);

            // Act
            await branchController.getBranchById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch retrieved successfully",
                data: mockBranch,
            });
        });

        it("should return 400 if ID is missing", async () => {
            // Act
            await branchController.getBranchById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Branch ID is required" });
        });

        it("should return 404 if branch not found", async () => {
            // Arrange
            mockReq.params = { id: "1" };
            (branchService.getBranchById as jest.Mock).mockResolvedValue(null);

            // Act
            await branchController.getBranchById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Branch with ID 1 not found" });
        });
    });

    /**
     * createBranch
     */

    describe("createBranch", () => {
        it("should create branch successfully", async () => {
            // Arrange
            const mockBody = { 
                name: "Test", 
                address: "123 St", 
                phone: "555-1234" 
            };

            const mockBranch: Branch = { 
                id: 1, 
                ...mockBody 
            };
            mockReq.body = mockBody;
            (branchService.createBranch as jest.Mock).mockResolvedValue(mockBranch);

            // Act
            await branchController.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch created successfully",
                data: mockBranch,
            });
        });

        it("should return 400 if name is missing", async () => {
            // Arrange
            mockReq.body = { 
                address: "123 St", 
                phone: "555-1234" 
            };

            // Act
            await branchController.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Branch name is required" });
        });
    });

    /**
     * updateBranch
     */

    describe("updateBranch", () => {
        it("should update branch successfully", async () => {
            // Arrange
            const mockBranch: Branch = { 
                id: 1, 
                name: "Updated", 
                address: "456 St", 
                phone: "555-5678" 
            };
            mockReq.params = { id: "1" };
            mockReq.body = { 
                name: "Updated", 
                address: "456 St", 
                phone: "555-5678" 
            };
            (branchService.updateBranch as jest.Mock).mockResolvedValue(mockBranch);

            // Act
            await branchController.updateBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch updated successfully",
                data: mockBranch,
            });
        });

        it("should call next with error on failure", async () => {
            // Arrange
            const error = new Error("Service error");
            mockReq.params = { id: "1" };
            (branchService.updateBranch as jest.Mock).mockRejectedValue(error);

            // Act
            await branchController.updateBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    /**
     * deleteBranch
     */

    describe("deleteBranch", () => {
        it("should delete branch successfully", async () => {
            // Arrange
            mockReq.params = { id: "1" };

            // Act
            await branchController.deleteBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchService.deleteBranch).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Branch deleted successfully",
            });
        });

        it("should call next with error on failure", async () => {
            // Arrange
            const error = new Error("Service error");
            mockReq.params = { id: "1" };
            (branchService.deleteBranch as jest.Mock).mockRejectedValue(error);

            // Act
            await branchController.deleteBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
