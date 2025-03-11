import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrInternalServer, ErrInvalidId, HttpError } from "../errors/http.js";
import { EmployeeUsecase } from "../usecase/employee.usecase.js";

export class EmployeeController {
  private employeeUsecase: EmployeeUsecase;
  constructor(employeeUsecase: EmployeeUsecase) {
    this.employeeUsecase = employeeUsecase;
  }

  async deleteEmployee(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const idNumber = parseInt(id);
      if (isNaN(idNumber)) {
        throw ErrInvalidId;
      }
      await this.employeeUsecase.deleteEmployee(idNumber);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).send({ message: e.message });
      } else {
        const e = ErrInternalServer;
        res.status(e.status).json({ message: e.message });
      }
    }
  }
}
