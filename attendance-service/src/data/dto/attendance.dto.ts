import { z } from "zod";
import { getAttendancesByUserQuerySchema } from "./attendance.schema.js";

export class AttendanceResponseData {
  id: number;
  employee_id: number;
  photo_url: string;
  timestamp: Date;
  work_description: string;
  reason_for_wfh: string;

  constructor(
    id: number,
    employee_id: number,
    photoUrl: string,
    timestamp: Date,
    work_description: string,
    reason_for_wfh: string
  ) {
    this.id = id;
    this.employee_id = employee_id;
    this.photo_url = photoUrl;
    this.timestamp = timestamp;
    this.work_description = work_description;
    this.reason_for_wfh = reason_for_wfh;
  }
}

export class GetAttendanceByUserRequestQuery {
  page_number: number;
  page_size: number;

  constructor(page_number: number = 1, page_size: number = 10) {
    this.page_number = page_number;
    this.page_size = page_size;
  }

  static fromSchema(schema: z.infer<typeof getAttendancesByUserQuerySchema>) {
    return new GetAttendanceByUserRequestQuery(
      schema.page_number,
      schema.page_size
    );
  }
}
