import express, { Express } from "express";
import { Multer } from "multer";
import { AttendanceController } from "../controller/attendance.controller.js";
import { postAttendanceSchema } from "../data/dto/attendance.schema.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validation.middleware.js";

export function setupRouter(c: AttendanceController, upload: Multer): Express {
  const r = express();
  r.use(express.urlencoded({ extended: true }));
  r.use(express.json());

  r.post(
    "/attendance",
    authenticate("employee"),
    upload.single("photo"),
    validateData(postAttendanceSchema, true),
    c.postAttendance.bind(c)
  );
  return r;
}
