import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as branchService from "../services/branchServices";
import { Branch } from "../models/branchModel";

/**
 * Manages requests and responses to retrieve all Branches
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const branches: Branch[] = await branchService.getAllBranches();
        res.status(HTTP_STATUS.OK).json({
            message: "Branches retrieved successfully",
            data: branches,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to get an Employee by ID
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getBranchById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Branch ID is required",
            });
            return;
        }

        const branch: Branch | null = await branchService.getBranchById(Number(id));

        if (!branch) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Branch with ID ${id} not found`,
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Branch retrieved successfully",
            data: branch,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, responses, and validation to create a Branch
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const createBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Basic validation - check for required fields
        if (!req.body.name) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Branch name is required",
            });
        } else if (!req.body.address) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Branch address is required",
            });
        } else if (!req.body.phone) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Branch phone is required",
            });
        } else {
            const { name, address, phone } = req.body;

            const newBranch: Branch = await branchService.createBranch({ name, address, phone });

            res.status(HTTP_STATUS.CREATED).json({
                message: "Branch created successfully",
                data: newBranch,
            });
        }
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update a Branch
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const updateBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, address, phone } = req.body;

        const updatedBranch: Branch = await branchService.updateBranch(Number(id), {
            name,
            address,
            phone,
        });

        res.status(HTTP_STATUS.OK).json({
            message: "Branch updated successfully",
            data: updatedBranch,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to delete a Branch
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        await branchService.deleteBranch(Number(id));
        res.status(HTTP_STATUS.OK).json({
            message: "Branch deleted successfully",
        });
    } catch (error: unknown) {
        next(error);
    }
};
