import request, { Response } from "supertest";
import app from "../src/app";
import { response } from "node_modules/@types/express";

describe("GET /api/v1/health", () => {
    it("should return OK", async () => {
        // Arrange
        const response = await request(app).get("/api/v1/health");
        
        // Assert
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("OK");
    });
});
