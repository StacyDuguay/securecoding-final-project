import { ObjectSchema } from "joi";

export interface RequestSchema {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

export interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}