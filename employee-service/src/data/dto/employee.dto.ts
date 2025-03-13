import { z } from "zod";
import { UpdateEmployeeEntity } from "../entity/employee.entity.js";
import { putEmployeeSchema } from "../model/employee.schema.js";

export class PutEmployeeRequestBody {
  full_name?: string;
  position?: string;
  department?: string;
  phone_number?: string;
  constructor(
    full_name?: string,
    position?: string,
    department?: string,
    phone_number?: string
  ) {
    this.full_name = full_name;
    this.position = position;
    this.department = department;
    this.phone_number = phone_number;
  }

  toEntity(employeeId: number) {
    return new UpdateEmployeeEntity(
      employeeId,
      this.full_name,
      this.position,
      this.department,
      this.phone_number
    );
  }

  static fromSchema(schema: z.infer<typeof putEmployeeSchema>) {
    return new PutEmployeeRequestBody(
      schema.full_name,
      schema.position,
      schema.department,
      schema.phone_number
    );
  }
}

export class EmployeeResponseData {
  id: number;
  user_id: number;
  full_name: string;
  position: string;
  department: string;
  phone_number: string;
  email: string;
  constructor(
    id: number,
    user_id: number,
    full_name: string,
    position: string,
    department: string,
    phone_number: string,
    email: string
  ) {
    this.id = id;
    this.user_id = user_id;
    this.full_name = full_name;
    this.position = position;
    this.department = department;
    this.phone_number = phone_number;
    this.email = email;
  }
}
