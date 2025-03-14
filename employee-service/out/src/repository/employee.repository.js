import { EmployeeEntity, } from "../data/entity/employee.entity.js";
import { ErrEmployeeNotFound, ErrInternalServer } from "../errors/http.js";
export class EmployeeRepositoryImpl {
    db;
    constructor(db) {
        this.db = db;
    }
    async selectEmployees(connection) {
        try {
            const conn = connection || this.db;
            const [rows] = await conn.execute(`
          SELECT 
            e.id, e.user_id, e.fullname, e.position, e.department, e.phone, u.email
          FROM
            employees e
          JOIN
            users u
          ON
            e.user_id = u.id
          WHERE
            e.deleted_at IS NULL AND u.deleted_at IS NULL
        `);
            const employees = rows.map((employee) => new EmployeeEntity(employee.id, employee.user_id, employee.fullname, employee.position, employee.department, employee.phone, employee.email));
            return employees;
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
    async selectEmployeeById(id, connection) {
        try {
            const conn = connection || this.db;
            const [rows] = await conn.execute(`
          SELECT
            e.id, e.user_id, e.fullname, e.position, e.department, e.phone, u.email
          FROM
            employees e
          JOIN
            users u
          ON
            e.user_id = u.id
          WHERE
            e.id = ? AND e.deleted_at IS NULL AND u.deleted_at IS NULL
        `, [id]);
            if (rows.length === 0) {
                throw ErrEmployeeNotFound;
            }
            const employee = rows[0];
            return new EmployeeEntity(employee.id, employee.user_id, employee.fullname, employee.position, employee.department, employee.phone, employee.email);
        }
        catch (e) {
            if (e === ErrEmployeeNotFound) {
                throw e;
            }
            throw ErrInternalServer;
        }
    }
    async deleteEmployee(id, connection) {
        try {
            const conn = connection || this.db;
            await conn.execute("UPDATE employees SET deleted_at = NOW() WHERE id = ?", [id]);
        }
        catch (e) {
            throw e;
        }
    }
    async selectEmployeeByUserId(userId, connection) {
        try {
            const conn = connection || this.db;
            const [rows] = await conn.execute(`
          SELECT
            e.id, e.user_id, e.fullname, e.position, e.department, e.phone, u.email
          FROM
            employees e
          JOIN
            users u
          ON
            e.user_id = u.id
          WHERE
            e.user_id = ? AND e.deleted_at IS NULL AND u.deleted_at IS NULL
        `, [userId]);
            if (rows.length === 0) {
                throw ErrEmployeeNotFound;
            }
            const employee = rows[0];
            return new EmployeeEntity(employee.id, employee.user_id, employee.fullname, employee.position, employee.department, employee.phone, employee.email);
        }
        catch (e) {
            if (e === ErrEmployeeNotFound) {
                throw e;
            }
            throw ErrInternalServer;
        }
    }
    async updateEmployee(updateEmployeeEntity) {
        try {
            const updates = [];
            const values = [];
            if (updateEmployeeEntity.fullName !== undefined) {
                updates.push("fullname = ?");
                values.push(updateEmployeeEntity.fullName);
            }
            if (updateEmployeeEntity.position !== undefined) {
                updates.push("position = ?");
                values.push(updateEmployeeEntity.position);
            }
            if (updateEmployeeEntity.department !== undefined) {
                updates.push("department = ?");
                values.push(updateEmployeeEntity.department);
            }
            if (updateEmployeeEntity.phone !== undefined) {
                updates.push("phone = ?");
                values.push(updateEmployeeEntity.phone);
            }
            if (updates.length === 0) {
                return;
            }
            values.push(updateEmployeeEntity.id);
            const query = `UPDATE employees SET ${updates.join(", ")} WHERE id = ?`;
            await this.db.execute(query, values);
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
    async checkEmployeeExist(id) {
        try {
            const [rows] = await this.db.execute("SELECT 1 FROM employees WHERE id = ? AND deleted_at IS NULL", [id]);
            return rows.length > 0;
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
}
