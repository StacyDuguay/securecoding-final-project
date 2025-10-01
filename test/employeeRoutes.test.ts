import request from "supertest";
import app from "../src/app";
import * as employeeController from "../src/api/v1/controllers/employeeController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { getEmployeesByDepartment } from "src/api/v1/services/employeeServices";

jest.mock("../src/api/v1/controllers/employeeController", () => ({
    getAllEmployees: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeeById: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    createEmployee: jest.fn((req, res) => res.status(HTTP_STATUS.CREATED).send()),
    updateEmployee: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteEmployee: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeesByBranch: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeesByDepartment: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Employee Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/employees/", () => {
        it("should call getAllEmployees controller", async () => {
            await request(app).get("/api/v1/employees/");
            expect(employeeController.getAllEmployees).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/employees/:id", () => {
        it("should call getEmployeeById controller with valid ID", async () => {
            await request(app).get("/api/v1/employees/1");
            expect(employeeController.getEmployeeById).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/employees/", () => {
        it("should call createEmployee controller with valid data", async () => {
            const mockEmployee = {
                name: "Test Employee",
                position: "Developer",
                department: "Development Team",
                email: "test@example.com",
                phone: "555-1234",
                branchId: 1,
            };

            await request(app).post("/api/v1/employees/").send(mockEmployee);
            expect(employeeController.createEmployee).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/employees/:id", () => {
        it("should call updateEmployee controller with valid data", async () => {
            const mockEmployee = {
                name: "Updated Employee",
                position: "Senior Developer",
                department: "Development Team",
                email: "updated@example.com",
                phone: "555-5678",
                branchId: 1,
            };

            await request(app).put("/api/v1/employees/1").send(mockEmployee);
            expect(employeeController.updateEmployee).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/employees/:id", () => {
        it("should call deleteEmployee controller with valid ID", async () => {
            await request(app).delete("/api/v1/employees/1");
            expect(employeeController.deleteEmployee).toHaveBeenCalled();
        });
    });
});

describe("GET /api/v1/employees/branch/:branchId", () => {
    it("should call getEmployeesByBranch controller", async () => {
        await request(app).get("/api/v1/employees/branch/1");

        expect(employeeController.getEmployeesByBranch).toHaveBeenCalled();
    });
});

describe("GET /api/v1/employees/department/:department", () => {
    it("should call getEmployeesByDepartment controller", async () => {
        await request(app).get("/api/v1/employees/department/IT");
        expect(employeeController.getEmployeesByDepartment).toHaveBeenCalled();
    });
});
