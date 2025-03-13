import { EmployeeResponseData } from "../dto/employee.dto.js";

export class EmployeeEntity {
  id: number;
  userId: number;
  fullName: string;
  position: string;
  department: string;
  phone: string;
  email: string;

  constructor(
    id: number,
    userId: number,
    fullName: string,
    position: string,
    department: string,
    phone: string,
    email: string
  ) {
    this.id = id;
    this.userId = userId;
    this.fullName = fullName;
    this.position = position;
    this.department = department;
    this.phone = phone;
    this.email = email;
  }

  toDto() {
    return new EmployeeResponseData(
      this.id,
      this.userId,
      this.fullName,
      this.position,
      this.department,
      this.phone,
      this.email
    );
  }
}

export class UpdateEmployeeEntity {
  id: number;
  fullName?: string;
  position?: string;
  department?: string;
  phone?: string;

  constructor(
    id: number,
    fullName?: string,
    position?: string,
    department?: string,
    phone?: string
  ) {
    this.id = id;
    this.fullName = fullName;
    this.position = position;
    this.department = department;
    this.phone = phone;
  }
}
