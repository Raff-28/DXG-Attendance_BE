import express, { Express } from "express";
import { EmployeeController } from "../controller/employee.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

export function setupRouter(employeeController: EmployeeController): Express {
  const r = express();
  r.use(express.json());

  r.get(
    "/employees",
    authenticate("admin"),
    employeeController.getEmployees.bind(employeeController)
  );
  r.delete(
    "/employees/:id",
    authenticate("admin"),
    employeeController.deleteEmployee.bind(employeeController)
  );
  return r;
}
