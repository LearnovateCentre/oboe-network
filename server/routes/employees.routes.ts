import { Router } from "express";
import {
  getEmployee,
  getEmployees,
  updateEmployee,
  saveMatchingEmployees,
  getMatchingEmployees,
} from "../controllers/employees.controller.ts";

const router = Router();

router.get("/:id", getEmployee);
router.get("/", getEmployees);
router.put("/:id", updateEmployee);
router.post("/matchingEmployees", saveMatchingEmployees);
router.get("/matchingEmployees/:id", getMatchingEmployees);

export default router;
