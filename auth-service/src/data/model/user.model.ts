import { RowDataPacket } from "mysql2";

export type Role = "employee" | "admin";

export interface UserModel extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}
