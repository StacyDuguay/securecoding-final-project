import Joi from "joi";

export const branchSchemas = {
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty"
            }),
            address: Joi.string().required().messages({
                "any.required": "Address is required",
                "string.empty": "Address is mandatory"
            }),
            phone: Joi.number().required().messages({
                "any.required": "Phone number is required",
                "number.empty": "Phone number cannot be empty"
            }),
        }),
    },

    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Branch ID is required",
                "string.empty": "Branch ID cannot be empty"
            }),
        }),
        body: Joi.object({
            name: Joi.string().required().messages({
                "string.empty": "Name cannot be empty"
            }),
            address: Joi.string().required().messages({
                "string.empty": "Address is mandatory"
            }),
            phone: Joi.number().required().messages({
                "number.empty": "Phone number cannot be empty"
            })
        })
    }
}