import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as employeeService from "../services/employeeServices";
import { Employee } from "../models/employeeModel";

/**
 * Manages requests and responses to retrieve all Employees
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
 * Manages requests, responses, and validation to create an Employee
 */
export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, position, department, email, phone, branchId } = req.body;

        // Basic validation
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
 */
export const updateEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, position, department, email, phone, branchId } = req.body;

        const updatedEmployee: Employee = await employeeService.updateEmployee(Number(id), {
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
 */
export const deleteEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        await employeeService.deleteEmployee(Number(id));
        res.status(HTTP_STATUS.OK).json({
            message: "Employee deleted successfully",
        });
    } catch (error: unknown) {
        next(error);
    }
};
