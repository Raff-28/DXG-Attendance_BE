import cors from "cors";
import express, { Express } from "express";
import { StatusCodes } from "http-status-codes";
import { EmployeeController } from "../controller/employee.controller.js";
import { putEmployeeSchema } from "../data/model/employee.schema.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";

export function setupRouter(employeeController: EmployeeController): Express {
  const r = express();
  r.use(cors());
  r.use(express.json());

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
  r.put(
    "/employees/:id",
    authenticate("admin"),
    validateData(putEmployeeSchema),
    employeeController.putEmployee.bind(employeeController)
  );
  r.delete(
    "/employees/:id",
    authenticate("admin"),
    employeeController.deleteEmployee.bind(employeeController)
  );

  r.use((_req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: "404 Not Found" });
  });
  return r;
}
