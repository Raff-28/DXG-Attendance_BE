import {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import {
  AttendanceEntity,
  AttendanceQueryParamEntity,
} from "../data/entity/attendance.entity.js";
import {
  AttendanceModel,
  TotalResult,
} from "../data/model/attendance.model.js";
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
  selectAttendancesByEmployee(
    attendanceQuery: AttendanceQueryParamEntity,
    connection?: PoolConnection
  ): Promise<{ attendances: AttendanceEntity[]; totalPages: number }>;
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

  async selectAttendancesByEmployee(
    attendanceQuery: AttendanceQueryParamEntity,
    connection?: PoolConnection
  ): Promise<{ attendances: AttendanceEntity[]; totalPages: number }> {
    try {
      const conn = connection || this.db;
      const [rows] = await conn.query<AttendanceModel[]>(
        `SELECT
          id, employee_id, timestamp, attendance_date, photo_url
       FROM
          attendances
       WHERE
          employee_id = ? AND deleted_at IS NULL
       ORDER BY
          timestamp DESC
       LIMIT ? OFFSET ?`,
        [
          attendanceQuery.employeeId,
          attendanceQuery.pageSize,
          (attendanceQuery.pageNumber - 1) * attendanceQuery.pageSize,
        ]
      );

      const [countResult] = await conn.query<TotalResult[]>(
        `SELECT COUNT(*) as total
         FROM attendances
         WHERE employee_id = ? AND deleted_at IS NULL`,
        [attendanceQuery.employeeId]
      );
      const totalRecords = countResult[0]?.total ?? 0;
      const totalPages = Math.ceil(totalRecords / attendanceQuery.pageSize);

      const attendances = rows.map((r) => {
        return new AttendanceEntity(
          undefined,
          undefined,
          r.id,
          r.employee_id,
          r.photo_url,
          r.timestamp
        );
      });

      return { attendances, totalPages };
    } catch (e) {
      throw ErrInternalServer;
    }
  }
}
