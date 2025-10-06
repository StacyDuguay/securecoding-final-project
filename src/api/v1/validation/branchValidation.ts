import Joi from "joi";

export const branchSchemas = {
    create: {
        body: Joi.object({
             id: Joi.number().required().messages({
                "any.required": "ID is required",
                "number.base": "ID must be a number",
            }).options({ convert: true }),
            name: Joi.string().trim().min(2).max(30).required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
                "string.min": "Name must be at least 2 characters",
                "string.max": "Name cannot exceed 30 characters"
            }),
            address: Joi.string().trim().min(5).max(50).required().messages({
                "any.required": "Address is required",
                "string.empty": "Address is mandatory",
                "string.min": "Address must be at least 5 characters",
                "string.max": "Address cannot exceed 50 characters"
            }),
            phone: Joi.string().pattern(/^[0-9\-+() ]{7,20}$/).required()
            .messages({
                "any.required": "Phone number is required",
                "string.empty": "Phone number cannot be empty",
                "string.pattern.base": "Phone number must be valid",
        }),
        }),
    },
    update: {
        params: Joi.object({
            id: Joi.number().required().messages({
                "any.required": "Branch ID is required",
                "number.base": "ID must be a number"
            }),
        }),
        body: Joi.object({
            name: Joi.string().trim().min(2).max(30).optional().messages({
                "string.empty": "Name cannot be empty",
                "string.min": "Name must be at least 2 characters",
                "string.max": "Name cannot exceed 30 characters"
            }),
            address: Joi.string().trim().min(5).max(50).optional().messages({
                "string.empty": "Address is mandatory",
                "string.min": "Address must be at least 5 characters",
                "string.max": "Address cannot exceed 50 characters"
            }),
             phone: Joi.string().pattern(/^[0-9\-+() ]{7,20}$/).optional()
            .messages({
                "string.pattern.base": "Phone number must be valid",
        }),
        })
    },
    delete: {
        params: Joi.object({
            id: Joi.number().required().messages({
                "any.required": "Branch ID is required",
                "number.base": "Branch ID must be a number",
            }),
        }),
    },
};