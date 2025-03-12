import { ErrInvalidBody } from "../../errors/http.js";
import { UpdateEmployeeEntity } from "../entity/employee.entity.js";

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

  validate() {
    const fields = [
      { value: this.full_name, name: "full_name", minLength: 1 },
      { value: this.position, name: "position", minLength: 1 },
      { value: this.department, name: "department", minLength: 1 },
      {
        value: this.phone_number,
        name: "phone_number",
        minLength: 10,
        isNumeric: true,
      },
    ];

    for (const field of fields) {
      if (field.value !== undefined) {
        if (
          typeof field.value !== "string" ||
          field.value.length < field.minLength ||
          (field.isNumeric && Number.isNaN(Number(field.value)))
        ) {
          throw ErrInvalidBody;
        }
      }
    }
  }
}

export class EmployeeResponseData {
  id: number;
  user_id: number;
  full_name: string;
  position: string;
  department: string;
  phone_number: string;
  constructor(
    id: number,
    user_id: number,
    full_name: string,
    position: string,
    department: string,
    phone_number: string
  ) {
    this.id = id;
    this.user_id = user_id;
    this.full_name = full_name;
    this.position = position;
    this.department = department;
    this.phone_number = phone_number;
  }
}
