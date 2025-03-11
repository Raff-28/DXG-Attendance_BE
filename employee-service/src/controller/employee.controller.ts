import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { EmployeeResponseData } from "../data/dto/employee.dto.js";
import { AppResponse } from "../data/dto/response.js";
import { ErrInternalServer, ErrInvalidId, HttpError } from "../errors/http.js";
import { EmployeeUsecase } from "../usecase/employee.usecase.js";

export class EmployeeController {
  private employeeUsecase: EmployeeUsecase;
  constructor(employeeUsecase: EmployeeUsecase) {
    this.employeeUsecase = employeeUsecase;
  }

  async getEmployees(_req: Request, res: Response) {
    try {
      const employees = await this.employeeUsecase.getEmployees();
      const response: AppResponse<EmployeeResponseData[]> = {
        data: employees.map((e) => e.toDto()),
      };
      res.status(StatusCodes.OK).json(response);
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).send({ message: e.message });
      } else {
        res
          .status(ErrInternalServer.status)
          .json({ message: ErrInternalServer.message });
      }
    }
  }

  async getEmployeeDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const idNumber = parseInt(id);
      if (isNaN(idNumber)) {
        throw ErrInvalidId;
      }
      const employee = await this.employeeUsecase.getEmployeeDetails(idNumber);
      const response: AppResponse<EmployeeResponseData> = {
        data: employee.toDto(),
      };
      res.status(StatusCodes.OK).json(response);
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).send({ message: e.message });
      } else {
        res
          .status(ErrInternalServer.status)
          .json({ message: ErrInternalServer.message });
      }
    }
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
        res
          .status(ErrInternalServer.status)
          .json({ message: ErrInternalServer.message });
      }
    }
  }
}
