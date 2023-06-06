import { Router } from "express";
import {
  getEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employees.controller.ts";

const router = Router();

router.get("/:id", getEmployee);
router.get("/", getEmployees);
router.put("/:id", updateEmployee);

export default router;
