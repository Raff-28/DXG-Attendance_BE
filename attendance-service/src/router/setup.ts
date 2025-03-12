import express, { Express } from "express";
import { StatusCodes } from "http-status-codes";
import { Multer } from "multer";
import { AttendanceController } from "../controller/attendance.controller.js";
import {
  getAttendancesByUserParamSchema,
  getAttendancesByUserQuerySchema,
  postAttendanceSchema,
} from "../data/dto/attendance.schema.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";

export function setupRouter(c: AttendanceController, upload: Multer): Express {
  const r = express();
  r.use(express.urlencoded({ extended: true }));
  r.use(express.json());

  r.post(
    "/attendances",
    authenticate("employee"),
    upload.single("photo"),
    validateData(undefined, undefined, postAttendanceSchema),
    c.postAttendance.bind(c)
  );

  r.get(
    "/attendances/by-user/:userId",
    authenticate("admin"),
    validateData(
      undefined,
      getAttendancesByUserQuerySchema,
      undefined,
      getAttendancesByUserParamSchema
    ),
    c.getAttendancesByUser.bind(c)
  );

  r.use((_req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: "404 Not Found" });
  });
  return r;
}
