import { Router } from "express";
import * as employeeController from "../controllers/employeeController";

const router: Router = Router();

router.get("/", employeeController.getAllEmployees);
router.post("/", employeeController.createEmployee);
router.get("/:id", employeeController.getEmployeeById);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

export default router;
