import { Router } from "express";
import * as branchController from "../controllers/branchController";
import { validateRequest } from "../middleware/validate";
import { branchSchemas } from "../validation/branchValidation";

const router: Router = Router();

router.get("/", branchController.getAllBranches);

router.post(
    "/", 
    validateRequest(branchSchemas.create),
    branchController.createBranch
);

router.get("/:id", branchController.getBranchById);

router.put(
    "/:id", 
    validateRequest(branchSchemas.update),
    branchController.updateBranch
);

router.delete("/:id",validateRequest(branchSchemas.delete),
    branchController.deleteBranch
);

export default router;

