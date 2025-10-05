import Joi from "joi";

export const employeeSchemas = {
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty"
            }),
            position: Joi.string().required().messages({
                "any.required": "Position is required",
                "string.empty": "Position cannot be empty"
            }),
            department: Joi.string().required().messages({
                "any.required": "Department is required",
                "string.empty": "Department cannot be empty",
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
                "any.required": "BranchId is required",
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
            name: Joi.string().optional().messages({
                "string.empty": "Name cannot be empty"
            }),
            position: Joi.string().optional().messages({
                "string.empty": "Position cannot be empty"
            }),
            department: Joi.string().optional().messages({
                "string.empty": "Department cannot be empty",
            }),
            email : Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'ca', 'gov', 'net']}})
            .required()
            .messages({
                "string.email": "Email must be valid",
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty"
            }),
            phone: Joi.string().pattern(/^[0-9\-+() ]{7,20}$/).optional()
            .messages({
                "string.pattern.base": "Phone must be a valid number",
            }),
            branchId: Joi.string().optional().messages({
                "string.empty": "BranchId cannot be empty"
            }),
        }),
    }, 
}