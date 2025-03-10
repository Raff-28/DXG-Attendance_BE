import {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { RegisterEntity } from "../data/entity/auth.entity.js";
import { ErrInternalServer } from "../errors/sentinel.js";

export interface AuthRepository {
  isEmailAlreadyExist(
    registerEntity: RegisterEntity,
    connecton?: PoolConnection
  ): Promise<boolean>;
  createUser(
    registerEntity: RegisterEntity,
    connection?: PoolConnection
  ): Promise<RegisterEntity>;
  createEmployee(
    registerEntity: RegisterEntity,
    connection?: PoolConnection
  ): Promise<void>;
}

export class AuthRepositoryImpl implements AuthRepository {
  private db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }

  async isEmailAlreadyExist(
    registerEntity: RegisterEntity,
    connection?: PoolConnection
  ) {
    try {
      const conn = connection || this.db;
      const [rows] = await conn.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [registerEntity.email]
      );
      return rows.length > 0;
    } catch (e) {
      throw ErrInternalServer;
    }
  }

  async createUser(
    registerEntity: RegisterEntity,
    connection?: PoolConnection
  ) {
    try {
      const conn = connection || this.db;
      const [result] = await conn.execute<ResultSetHeader>(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        [registerEntity.email, registerEntity.password, "employee"]
      );

      registerEntity.id = result.insertId;
      return registerEntity;
    } catch (e) {
      throw ErrInternalServer;
    }
  }

  async createEmployee(
    registerEntity: RegisterEntity,
    connection?: PoolConnection
  ) {
    try {
      const conn = connection || this.db;
      await conn.execute<ResultSetHeader>(
        `INSERT INTO 
          employees (user_id, fullname, position, department, phone)
         VALUES 
          (?, ?, ?, ?, ?)`,
        [
          registerEntity.id,
          registerEntity.name,
          registerEntity.position,
          registerEntity.department,
          registerEntity.phoneNumber,
        ]
      );
    } catch (e) {
      throw ErrInternalServer;
    }
  }
}
