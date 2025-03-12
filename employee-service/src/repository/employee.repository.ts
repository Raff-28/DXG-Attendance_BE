import { Pool, PoolConnection } from "mysql2/promise";
import {
  EmployeeEntity,
  UpdateEmployeeEntity,
} from "../data/entity/employee.entity.js";
import { EmployeeModel } from "../data/model/employee.model.js";
import { ErrEmployeeNotFound, ErrInternalServer } from "../errors/http.js";

export interface EmployeeRepository {
  selectEmployees(connection?: PoolConnection): Promise<EmployeeEntity[]>;
  selectEmployeeById(
    id: number,
    connection?: PoolConnection
  ): Promise<EmployeeEntity>;
  deleteEmployee(id: number, connection?: PoolConnection): Promise<void>;
  selectEmployeeByUserId(
    userId: number,
    connection?: PoolConnection
  ): Promise<EmployeeEntity>;
  updateEmployee(updateEmployeeEntity: UpdateEmployeeEntity): Promise<void>;
}

export class EmployeeRepositoryImpl implements EmployeeRepository {
  private db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }

  async selectEmployees(
    connection?: PoolConnection
  ): Promise<EmployeeEntity[]> {
    try {
      const conn = connection || this.db;
      const [rows] = await conn.execute<EmployeeModel[]>(
        "SELECT * FROM employees WHERE deleted_at IS NULL"
      );
      const employees = rows.map(
        (employee) =>
          new EmployeeEntity(
            employee.id,
            employee.user_id,
            employee.fullname,
            employee.position,
            employee.department,
            employee.phone
          )
      );
      return employees;
    } catch (e) {
      throw ErrInternalServer;
    }
  }

  async selectEmployeeById(
    id: number,
    connection?: PoolConnection
  ): Promise<EmployeeEntity> {
    try {
      const conn = connection || this.db;
      const [rows] = await conn.execute<EmployeeModel[]>(
        "SELECT * FROM employees WHERE id = ? AND deleted_at IS NULL",
        [id]
      );
      if (rows.length === 0) {
        throw ErrEmployeeNotFound;
      }
      const employee = rows[0];

      return new EmployeeEntity(
        employee.id,
        employee.user_id,
        employee.fullname,
        employee.position,
        employee.department,
        employee.phone
      );
    } catch (e) {
      if (e === ErrEmployeeNotFound) {
        throw e;
      }
      throw ErrInternalServer;
    }
  }

  async deleteEmployee(id: number, connection?: PoolConnection): Promise<void> {
    try {
      const conn = connection || this.db;
      await conn.execute(
        "UPDATE employees SET deleted_at = NOW() WHERE id = ?",
        [id]
      );
    } catch (e) {
      throw e;
    }
  }

  async selectEmployeeByUserId(
    userId: number,
    connection?: PoolConnection
  ): Promise<EmployeeEntity> {
    try {
      const conn = connection || this.db;
      const [rows] = await conn.execute<EmployeeModel[]>(
        "SELECT * FROM employees WHERE user_id = ? AND deleted_at IS NULL",
        [userId]
      );
      if (rows.length === 0) {
        throw ErrEmployeeNotFound;
      }
      const employee = rows[0];
      return new EmployeeEntity(
        employee.id,
        employee.user_id,
        employee.fullname,
        employee.position,
        employee.department,
        employee.phone
      );
    } catch (e) {
      if (e === ErrEmployeeNotFound) {
        throw e;
      }
      throw ErrInternalServer;
    }
  }

  async updateEmployee(
    updateEmployeeEntity: UpdateEmployeeEntity
  ): Promise<void> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

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
    } catch (e) {
      throw ErrInternalServer;
    }
  }
}
