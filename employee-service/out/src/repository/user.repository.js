import { ErrInternalServer } from "../errors/http.js";
export class UserRepositoryImpl {
    db;
    constructor(db) {
        this.db = db;
    }
    async checkUserExistById(id, connection) {
        try {
            const conn = connection || this.db;
            const [rows] = await conn.execute("SELECT 1 FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1", [id]);
            return rows.length > 0;
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
    async deleteUser(id, connection) {
        try {
            const conn = connection || this.db;
            await conn.execute("UPDATE users SET deleted_at = NOW() WHERE id = ?", [
                id,
            ]);
        }
        catch (e) {
            throw e;
        }
    }
}
