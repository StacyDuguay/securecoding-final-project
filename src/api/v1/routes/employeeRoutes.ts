import { Router } from "express";
import * as employeeController from "../controllers/employeeController";
import { validateRequest } from "../middleware/validate";
import { employeeSchemas } from "../validation/employeeValidation";

const router: Router = Router();

router.get("/", employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployeeById);
router.get("/branch/:branchId", employeeController.getEmployeesByBranch);
router.get("/department/:department", employeeController.getEmployeesByDepartment);

router.post(
    "/",
    validateRequest(employeeSchemas.create),
    employeeController.createEmployee);

router.put(
    "/:id",
    validateRequest(employeeSchemas.update),
    employeeController.updateEmployee);
    
router.delete("/:id", employeeController.deleteEmployee);

export default router;
