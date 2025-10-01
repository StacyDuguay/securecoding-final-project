import { Router } from "express";
import * as branchController from "../controllers/branchController";
import { getBranchById } from "../services/branchServices";

const router: Router = Router();

router.get("/", branchController.getAllBranches);
router.post("/", branchController.createBranch);
router.get("/:id", branchController.getBranchById);
router.put("/:id", branchController.updateBranch);
router.delete("/:id", branchController.deleteBranch);

export default router;
