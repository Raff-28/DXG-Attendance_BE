import { Pool, PoolConnection } from "mysql2/promise";
import { ErrInternalServer } from "../errors/http.js";

export interface AttendanceRepository {
  deleteAttendancesByEmployeeId(
    employeeId: number,
    connection?: PoolConnection
  ): Promise<void>;
}

export class AttendanceRepositoryImpl implements AttendanceRepository {
  private db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }

  async deleteAttendancesByEmployeeId(
    employeeId: number,
    connection?: PoolConnection
  ): Promise<void> {
    try {
      const conn = connection || this.db;
      await conn.execute(
        "UPDATE attendances SET deleted_at = NOW() WHERE employee_id = ?",
        [employeeId]
      );
    } catch (e) {
      throw ErrInternalServer;
    }
  }
}
