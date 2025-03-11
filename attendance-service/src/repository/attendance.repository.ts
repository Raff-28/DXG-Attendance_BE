import {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { AttendanceEntity } from "../data/entity/attendance.entity.js";
import { ErrInternalServer } from "../errors/http.js";

export interface AttendanceRepository {
  createAttendance(
    attendanceEntity: AttendanceEntity,
    connection?: PoolConnection
  ): Promise<AttendanceEntity>;
  checkAlreadyAttend(
    employeeId: number,
    connection?: PoolConnection
  ): Promise<boolean>;
}

export class AttendanceRepositoryImpl implements AttendanceRepository {
  private db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }

  async createAttendance(
    attendanceEntity: AttendanceEntity,
    connection?: PoolConnection
  ) {
    try {
      const conn = connection || this.db;
      const [result] = await conn.execute<ResultSetHeader>(
        `INSERT INTO 
            attendances (employee_id, timestamp, attendance_date, photo_url)
         VALUES
            (?, ?, CURDATE(), ?)`,
        [
          attendanceEntity.employeeId,
          attendanceEntity.timestamp,
          attendanceEntity.photoUrl,
        ]
      );

      attendanceEntity.id = result.insertId;
      return attendanceEntity;
    } catch (e) {
      throw ErrInternalServer;
    }
  }

  async checkAlreadyAttend(employeeId: number, connection?: PoolConnection) {
    try {
      const conn = connection || this.db;
      const [result] = await conn.execute<RowDataPacket[]>(
        `SELECT 1 FROM 
            attendances
         WHERE 
            employee_id = ?
         AND attendance_date = CURDATE()
         AND deleted_at IS NULL`,
        [employeeId]
      );
      return result.length > 0;
    } catch (e) {
      throw ErrInternalServer;
    }
  }
}
