import { create } from "domain";
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
            email : Joi.string().required().messages({
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty"
            }),
            branchid: Joi.string().required().messages({
                "any.required": "Branchid is required",
                "string.empty": "Branchid cannot be empty"
            }),
        }),
    },
    update: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "string.empty": "Name cannot be empty"
            }),
            position: Joi.string().required().messages({
                "string.empty": "Position cannot be empty"
            }),
            email : Joi.string().required().messages({
                "string.empty": "Email cannot be empty"
            }),
            branchid: Joi.string().required().messages({
                "string.empty": "Branchid cannot be empty"
            }),
        }),
    }, 
}