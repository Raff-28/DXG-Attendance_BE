import { RegisterBody } from "../dto/auth.dto.js";

export class RegisterEntity {
  id: number;
  email: string;
  password: string;
  name: string;
  position: string;
  department: string;
  phoneNumber: string;

  constructor(
    id: number,
    email: string,
    password: string,
    name: string,
    position: string,
    department: string,
    phone_number: string
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.position = position;
    this.department = department;
    this.phoneNumber = phone_number;
  }

  toDto() {
    return new RegisterBody(
      this.email,
      this.password,
      this.name,
      this.position,
      this.department,
      this.phoneNumber,
      this.id
    );
  }
}
