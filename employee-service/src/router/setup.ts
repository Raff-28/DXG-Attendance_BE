import express, { Express } from "express";
import { EmployeeController } from "../controller/employee.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

export function setupRouter(employeeController: EmployeeController): Express {
  const r = express();
  r.use(express.json());

  r.route("/employee/:id").delete(
    authenticate("admin"),
    employeeController.deleteEmployee.bind(employeeController)
  );
  return r;
}
