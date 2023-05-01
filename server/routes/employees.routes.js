import { Router } from "express";
import { getEmployee } from "../controllers/employees.controller.js";

const router = Router();

router.get("/:id", getEmployee);

export default router;
