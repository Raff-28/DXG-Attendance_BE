import { AttendanceEntity, } from "../data/entity/attendance.entity.js";
import { ErrInternalServer } from "../errors/http.js";
export class AttendanceRepositoryImpl {
    db;
    constructor(db) {
        this.db = db;
    }
    async createAttendance(attendanceEntity, connection) {
        try {
            const conn = connection || this.db;
            const [result] = await conn.execute(`INSERT INTO 
            attendances (employee_id, timestamp, attendance_date, photo_url, work_description, reason_for_wfh)
         VALUES
            (?, ?, CURDATE(), ?, ?, ?)`, [
                attendanceEntity.employeeId,
                attendanceEntity.timestamp,
                attendanceEntity.photoUrl,
                attendanceEntity.workDescription,
                attendanceEntity.reasonForWfh,
            ]);
            attendanceEntity.id = result.insertId;
            return attendanceEntity;
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
    async checkAlreadyAttend(employeeId, connection) {
        try {
            const conn = connection || this.db;
            const [result] = await conn.execute(`SELECT 1 FROM 
            attendances
         WHERE 
            employee_id = ?
         AND attendance_date = CURDATE()
         AND deleted_at IS NULL`, [employeeId]);
            return result.length > 0;
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
    async selectAttendancesByEmployee(attendanceQuery, connection) {
        try {
            const conn = connection || this.db;
            const [rows] = await conn.query(`SELECT
          id, employee_id, timestamp, attendance_date, photo_url, work_description, reason_for_wfh
       FROM
          attendances
       WHERE
          employee_id = ? AND deleted_at IS NULL
       ORDER BY
          timestamp DESC
       LIMIT ? OFFSET ?`, [
                attendanceQuery.employeeId,
                attendanceQuery.pageSize,
                (attendanceQuery.pageNumber - 1) * attendanceQuery.pageSize,
            ]);
            const [countResult] = await conn.query(`SELECT COUNT(*) as total
         FROM attendances
         WHERE employee_id = ? AND deleted_at IS NULL`, [attendanceQuery.employeeId]);
            const totalRecords = countResult[0]?.total ?? 0;
            const totalPages = Math.ceil(totalRecords / attendanceQuery.pageSize);
            const attendances = rows.map((r) => {
                return new AttendanceEntity(undefined, undefined, r.id, r.employee_id, r.photo_url, r.timestamp, r.work_description, r.reason_for_wfh);
            });
            return { attendances, totalPages };
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
}
