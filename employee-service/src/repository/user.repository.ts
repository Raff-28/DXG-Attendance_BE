import { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import { ErrInternalServer } from "../errors/http.js";

export interface UserRepository {
  checkUserExistById(id: number, connection?: PoolConnection): Promise<boolean>;
  deleteUser(id: number, connection?: PoolConnection): Promise<void>;
}

export class UserRepositoryImpl implements UserRepository {
  private db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }

  async checkUserExistById(
    id: number,
    connection?: PoolConnection
  ): Promise<boolean> {
    try {
      const conn = connection || this.db;
      const [rows] = await conn.execute<RowDataPacket[]>(
        "SELECT 1 FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1",
        [id]
      );
      return rows.length > 0;
    } catch (e) {
      throw ErrInternalServer;
    }
  }

  async deleteUser(id: number, connection?: PoolConnection): Promise<void> {
    try {
      const conn = connection || this.db;
      await conn.execute("UPDATE users SET deleted_at = NOW() WHERE id = ?", [
        id,
      ]);
    } catch (e) {
      throw e;
    }
  }
}
