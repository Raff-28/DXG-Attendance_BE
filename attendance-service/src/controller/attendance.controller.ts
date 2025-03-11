import axios from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { EmployeeResponseData } from "../data/dto/employee.dto.js";
import { AppResponse } from "../data/dto/response.js";
import { AttendanceEntity } from "../data/entity/attendance.entity.js";
import { ErrInternalServer, HttpError } from "../errors/http.js";
import { AttendanceUsecase } from "../usecase/attendance.usecase.js";

export class AttendanceController {
  private attendanceUsecase: AttendanceUsecase;
  constructor(attendanceUsecase: AttendanceUsecase) {
    this.attendanceUsecase = attendanceUsecase;
  }

  async postAttendance(req: Request, res: Response) {
    try {
      const attendanceEntity = new AttendanceEntity(
        req.file!.buffer!,
        req.body.photo.mimetype
      );
      const employeeRes = await axios.get<AppResponse<EmployeeResponseData>>(
        `${process.env.EMPLOYEE_SERVICE_BASE_URL}/employees/by-user/${res.locals.userId}`,
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );
      if (employeeRes.data.data) {
        attendanceEntity.employeeId = employeeRes.data.data.id;
      }
      const result = await this.attendanceUsecase.createAttendance(
        attendanceEntity
      );
      res.status(StatusCodes.OK).json(result.toDto());
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).send({ message: e.message });
      } else if (
        axios.isAxiosError<AppResponse<void>>(e) &&
        e.response?.data.message
      ) {
        res
          .status(e.response?.status)
          .json({ message: e.response.data.message });
      } else {
        res
          .status(ErrInternalServer.status)
          .json({ message: ErrInternalServer.message });
      }
    }
  }
}
