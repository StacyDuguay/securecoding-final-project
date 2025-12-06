import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as employeeService from "../services/employeeServices";
import { Employee } from "../models/employeeModel";

/**
 * Manages requests and responses to retrieve all Employees
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const employees: Employee[] = await employeeService.getAllEmployees();
        res.status(HTTP_STATUS.OK).json({
            message: "Employees retrieved successfully",
            data: employees,
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
export const getEmployeeById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id }: { id?: string } = req.params;

        if (!id) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Employee ID is required",
            });
            return;
        }

        const employee: Employee | null = await employeeService.getEmployeeById(id);

        if (!employee) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `Employee with ID ${id} not found`,
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Employee retrieved successfully",
            data: employee,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, responses, and validation to create an Employee
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            name,
            position,
            department,
            email,
            phone,
            branchId,
        }: {
            name?: string;
            position?: string;
            department?: string;
            email?: string;
            phone?: string;
            branchId?: string;
        } = req.body;

        if (!name) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Employee name is required" });
            return;
        }
        if (!position) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Employee position is required" });
            return;
        }
        if (!department) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Employee department is required" });
            return;
        }
        if (!email) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Employee email is required" });
            return;
        }
        if (!phone) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Employee phone is required" });
            return;
        }
        if (!branchId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Employee branchId is required" });
            return;
        }

        const newEmployee: Employee = await employeeService.createEmployee({
            name,
            position,
            department,
            email,
            phone,
            branchId,
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: "Employee created successfully",
            data: newEmployee,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update an Employee
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const updateEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id }: { id?: string } = req.params;
        const {
            name,
            position,
            department,
            email,
            phone,
            branchId,
        }: {
            name?: string;
            position?: string;
            department?: string;
            email?: string;
            phone?: string;
            branchId?: string;
        } = req.body;

        const updatedEmployee: Employee = await employeeService.updateEmployee(id as string, {
            name,
            position,
            department,
            email,
            phone,
            branchId,
        });

        res.status(HTTP_STATUS.OK).json({
            message: "Employee updated successfully",
            data: updatedEmployee,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to delete an Employee
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id }: { id?: string } = req.params;

        await employeeService.deleteEmployee(id as string);
        res.status(HTTP_STATUS.OK).json({
            message: "Employee deleted successfully",
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Get all employees from a specific branch
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getEmployeesByBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { branchId }: { branchId?: string } = req.params;
        if (!branchId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Branch ID is required",
            });
            return;
        }

        const employees = await employeeService.getEmployeesByBranch(branchId);

        res.status(HTTP_STATUS.OK).json({
            message: "Employees for branch retrieved successfully",
            data: employees,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Get all employees from a specific department
 * @param req - The express Request
 * @param res - The express Response
 * @param next - The express middleware chaining function
 */
export const getEmployeesByDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { department }: { department?: string } = req.params;
        if (!department) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Department is required",
            });
            return;
        }

        const employees = await employeeService.getEmployeesByDepartment(department);

        res.status(HTTP_STATUS.OK).json({
            message: "Employees for department retrieved successfully",
            data: employees,
        });
    } catch (error: unknown) {
        next(error);
    }
};

