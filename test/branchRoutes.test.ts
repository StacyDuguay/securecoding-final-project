import request from "supertest";
import app from "../src/app";
import * as branchController from "../src/api/v1/controllers/branchController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/itemController", () => ({
    getAllItems: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    createItem: jest.fn((req, res) => res.status(HTTP_STATUS.CREATED).send()),
    updateItem: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteItem: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Branch Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/branches/", () => {
        it("should call getAllBranches controller", async () => {
            await request(app).get("/api/v1/branches/");
            expect(branchController.getAllBranches).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/branches/", () => {
        it("should call createBranch controller with valid data", async () => {
            const mockBranch = {
                name: "Test Branch",
                address: "123 Main St",
                phone: "555-1234",
            };

            await request(app).post("/api/v1/branches/").send(mockBranch);
            expect(branchController.createBranch).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/branches/:id", () => {
        it("should call updateBranch controller with valid data", async () => {
            const mockBranch = {
                name: "Updated Branch",
                address: "456 Updated St",
                phone: "555-5678",
            };

            await request(app).put("/api/v1/branches/1").send(mockBranch);
            expect(branchController.updateBranch).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/branches/:id", () => {
        it("should call deleteBranch controller with valid data", async () => {
            await request(app).delete("/api/v1/branches/1");
            expect(branchController.deleteBranch).toHaveBeenCalled();
        });
    });
});