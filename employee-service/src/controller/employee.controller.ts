import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  EmployeeResponseData,
  PutEmployeeRequestBody,
} from "../data/dto/employee.dto.js";
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
        res.status(e.status).json({ message: e.message });
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
      const idNumber = Number(id);
      if (isNaN(idNumber) || idNumber < 1) {
        throw ErrInvalidId;
      }
      const employee = await this.employeeUsecase.getEmployeeDetails(idNumber);
      const response: AppResponse<EmployeeResponseData> = {
        data: employee.toDto(),
      };
      res.status(StatusCodes.OK).json(response);
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).json({ message: e.message });
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
      const idNumber = Number(id);
      if (isNaN(idNumber) || idNumber < 1) {
        throw ErrInvalidId;
      }
      await this.employeeUsecase.deleteEmployee(idNumber);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).json({ message: e.message });
      } else {
        res
          .status(ErrInternalServer.status)
          .json({ message: ErrInternalServer.message });
      }
    }
  }

  async getEmployeeByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const userIdNumber = Number(userId);
      if (isNaN(userIdNumber) || userIdNumber < 1) {
        throw ErrInvalidId;
      }
      const employee = await this.employeeUsecase.getEmployeeByUserId(
        userIdNumber
      );
      const response: AppResponse<EmployeeResponseData> = {
        data: employee.toDto(),
      };
      res.status(StatusCodes.OK).json(response);
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).json({ message: e.message });
      } else {
        res
          .status(ErrInternalServer.status)
          .json({ message: ErrInternalServer.message });
      }
    }
  }

  async putEmployee(
    req: Request<{ id: string }, {}, PutEmployeeRequestBody>,
    res: Response
  ) {
    try {
      const { id } = req.params;
      const idNumber = Number(id);
      if (isNaN(idNumber) || idNumber < 1) {
        throw ErrInvalidId;
      }
      const reqBody = new PutEmployeeRequestBody(
        req.body.full_name,
        req.body.position,
        req.body.department,
        req.body.phone_number
      );
      reqBody.validate();
      const updateEmployeeEntity = reqBody.toEntity(idNumber);
      await this.employeeUsecase.updateEmployee(updateEmployeeEntity);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).json({ message: e.message });
      } else {
        res
          .status(ErrInternalServer.status)
          .json({ message: ErrInternalServer.message });
      }
    }
  }
}
