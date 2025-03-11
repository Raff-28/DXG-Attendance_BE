import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
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
        req.body.employee_id,
        req.file!.buffer!,
        req.body.photo.mimetype
      );
      const result = await this.attendanceUsecase.createAttendance(
        attendanceEntity
      );
      res.status(StatusCodes.OK).json(result.toDto());
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
