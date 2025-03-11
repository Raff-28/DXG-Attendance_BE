import { RowDataPacket } from "mysql2";

export interface EmployeeModel extends RowDataPacket {
  id: number;
  user_id: number;
  fullname: string;
  position: string;
  department: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}
