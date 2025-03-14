import { UserEntity } from "../data/entity/auth.entity.js";
import { ErrInternalServer, ErrUserDoesNotExist } from "../errors/sentinel.js";
export class AuthRepositoryImpl {
    db;
    constructor(db) {
        this.db = db;
    }
    async isEmailAlreadyExist(registerEntity, connection) {
        try {
            const conn = connection || this.db;
            const [rows] = await conn.execute("SELECT 1 FROM users WHERE email = ? LIMIT 1", [registerEntity.email]);
            return rows.length > 0;
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
    async createUser(registerEntity, connection) {
        try {
            const conn = connection || this.db;
            const [result] = await conn.execute("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [registerEntity.email, registerEntity.password, "employee"]);
            registerEntity.id = result.insertId;
            return registerEntity;
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
    async createEmployee(registerEntity, connection) {
        try {
            const conn = connection || this.db;
            await conn.execute(`INSERT INTO 
          employees (user_id, fullname, position, department, phone)
         VALUES 
          (?, ?, ?, ?, ?)`, [
                registerEntity.id,
                registerEntity.name,
                registerEntity.position,
                registerEntity.department,
                registerEntity.phoneNumber,
            ]);
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
    async selectUserByEmail(email, connection) {
        try {
            const conn = connection || this.db;
            const [rows] = await conn.execute(`SELECT 
          id, email, password, role
         FROM users
         WHERE email = ? AND deleted_at IS NULL
         LIMIT 1`, [email]);
            if (rows.length === 0) {
                throw ErrUserDoesNotExist;
            }
            const user = rows[0];
            return new UserEntity(user.id, user.email, user.password, user.role);
        }
        catch (e) {
            if (e === ErrUserDoesNotExist) {
                throw e;
            }
            throw ErrInternalServer;
        }
    }
    async selectUserById(id, connection) {
        try {
            const conn = connection || this.db;
            const [rows] = await conn.execute(`SELECT 
          id, email, password, role
         FROM users
         WHERE id = ? AND deleted_at IS NULL
         LIMIT 1`, [id]);
            if (rows.length === 0) {
                throw ErrUserDoesNotExist;
            }
            const user = rows[0];
            return new UserEntity(user.id, user.email, user.password, user.role);
        }
        catch (e) {
            if (e === ErrUserDoesNotExist) {
                throw e;
            }
            throw ErrInternalServer;
        }
    }
}
