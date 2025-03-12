import { RowDataPacket } from "mysql2";

export interface AttendanceModel extends RowDataPacket {
  id: number;
  employee_id: number;
  timestamp: Date;
  attendance_date: Date;
  photo_url: string;
  created_at: Date;
  updated_at: Date;
}
