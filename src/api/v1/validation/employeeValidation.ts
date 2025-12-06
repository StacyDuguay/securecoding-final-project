import Joi from "joi";

export const employeeSchemas = {
    create: {
        body: Joi.object({
            name: Joi.string().trim().min(2).max(30).required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
                "string.min": "Name must be at least 2 characters",
                "string.max": "Name cannot exceed 30 characters"
            }),
            position: Joi.string().trim().min(2).max(40).required().messages({
                "any.required": "Position is required",
                "string.empty": "Position cannot be empty",
                "string.min": "Position must be at least 2 characters",
                "string.max": "Position cannot exceed 40 characters"
            }),
            department: Joi.string().trim().min(2).max(30).required().messages({
                "any.required": "Department is required",
                "string.empty": "Department cannot be empty",
                "string.min": "Department must be at least 2 characters",
                "string.max": "Department cannot exceed 30 characters"
            }),
            email : Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'ca', 'gov', 'net']}})
            .required()
            .messages({
                "string.email": "Email must be valid",
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty"
            }),
            phone: Joi.string().pattern(/^[0-9\-+() ]{7,20}$/).required()
            .messages({
                "any.required": "Phone number is required",
                "string.empty": "Phone number cannot be empty",
                "string.pattern.base" : "Phone number must be valid"
            }),
            branchId: Joi.number().integer().required().messages({
                "number.base": "BranchId must be a number"
            }),
        }),
    },
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Item ID is required",
                "string.empty": "Item ID cannot be empty",
            }),
        }),
        body: Joi.object({
            name: Joi.string().trim().min(2).max(30).optional().messages({
                "string.empty": "Name cannot be empty",
                "string.min": "Name must be at least 2 characters",
                "string.max": "Name cannot exceed 30 characters"
            }),
            position: Joi.string().trim().min(2).max(40).optional().messages({
                "string.empty": "Position cannot be empty",
                "string.min": "Position must be at least 2 characters",
                "string.max": "Position cannot exceed 40 characters"
            }),
            department: Joi.string().trim().min(2).max(30).optional().messages({
                "string.empty": "Department cannot be empty",
                "string.min": "Department must be at least 2 characters",
                "string.max": "Department cannot exceed 30 characters"
            }),
            email : Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'ca', 'gov', 'net']}})
            .optional()
            .messages({
                "string.email": "Email must be valid",
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty"
            }),
            phone: Joi.string().pattern(/^[0-9\-+() ]{7,20}$/).optional()
            .messages({
                "string.pattern.base": "Phone must be a valid number",
            }),
            branchId: Joi.number().integer().optional().messages({
                "number.base": "BranchId must be a number"
            }),
        }),
    }, 
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Employee ID is required",
                "string.empty": "Employee ID cannot be empty",
            }),
        }),
    },
};

