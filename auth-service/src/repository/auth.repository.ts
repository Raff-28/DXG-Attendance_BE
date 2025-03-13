import {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { RegisterEntity, UserEntity } from "../data/entity/auth.entity.js";
import { UserModel } from "../data/model/user.model.js";
import { ErrInternalServer, ErrUserDoesNotExist } from "../errors/sentinel.js";

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
  selectUserByEmail(
    email: string,
    connection?: PoolConnection
  ): Promise<UserEntity>;
  selectUserById(id: number, connection?: PoolConnection): Promise<UserEntity>;
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
        "SELECT 1 FROM users WHERE email = ? LIMIT 1",
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

  async selectUserByEmail(email: string, connection?: PoolConnection) {
    try {
      const conn = connection || this.db;
      const [rows] = await conn.execute<UserModel[]>(
        `SELECT 
          id, email, password, role
         FROM users
         WHERE email = ? AND deleted_at IS NULL
         LIMIT 1`,
        [email]
      );
      if (rows.length === 0) {
        throw ErrUserDoesNotExist;
      }
      const user = rows[0];
      return new UserEntity(user.id, user.email, user.password, user.role);
    } catch (e) {
      if (e === ErrUserDoesNotExist) {
        throw e;
      }
      throw ErrInternalServer;
    }
  }

  async selectUserById(id: number, connection?: PoolConnection) {
    try {
      const conn = connection || this.db;
      const [rows] = await conn.execute<UserModel[]>(
        `SELECT 
          id, email, password, role
         FROM users
         WHERE id = ? AND deleted_at IS NULL
         LIMIT 1`,
        [id]
      );
      if (rows.length === 0) {
        throw ErrUserDoesNotExist;
      }
      const user = rows[0];
      return new UserEntity(user.id, user.email, user.password, user.role);
    } catch (e) {
      if (e === ErrUserDoesNotExist) {
        throw e;
      }
      throw ErrInternalServer;
    }
  }
}
