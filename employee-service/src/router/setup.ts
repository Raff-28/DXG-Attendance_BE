import express, { Express } from "express";
import { StatusCodes } from "http-status-codes";
import { EmployeeController } from "../controller/employee.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

export function setupRouter(employeeController: EmployeeController): Express {
  const r = express();
  r.use(express.json());
  r.use((_req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: "404 Not Found" });
  });

  r.get(
    "/employees",
    authenticate("admin"),
    employeeController.getEmployees.bind(employeeController)
  );
  r.get(
    "/employees/:id",
    authenticate("admin"),
    employeeController.getEmployeeDetails.bind(employeeController)
  );
  r.get(
    "/employees/by-user/:userId",
    employeeController.getEmployeeByUserId.bind(employeeController)
  );
  r.delete(
    "/employees/:id",
    authenticate("admin"),
    employeeController.deleteEmployee.bind(employeeController)
  );
  return r;
}
