import { ErrInternalServer } from "../errors/http.js";
export class AttendanceRepositoryImpl {
    db;
    constructor(db) {
        this.db = db;
    }
    async deleteAttendancesByEmployeeId(employeeId, connection) {
        try {
            const conn = connection || this.db;
            await conn.execute("UPDATE attendances SET deleted_at = NOW() WHERE employee_id = ?", [employeeId]);
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
}
