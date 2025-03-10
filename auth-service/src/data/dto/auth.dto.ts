import { z } from "zod";
import { RegisterEntity } from "../entity/auth.entity.js";
import { registerSchema } from "./auth.schema.js";

export class RegisterBody {
  id: number;
  email: string;
  password: string;
  name: string;
  position: string;
  department: string;
  phone_number: string;

  constructor(
    email: string,
    password: string,
    name: string,
    position: string,
    department: string,
    phone_number: string,
    id: number = 0
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.position = position;
    this.department = department;
    this.phone_number = phone_number;
  }

  static fromSchema(data: z.infer<typeof registerSchema>) {
    return new RegisterBody(
      data.email,
      data.password,
      data.name,
      data.position,
      data.department,
      data.phone_number
    );
  }

  toEntity() {
    return new RegisterEntity(
      this.id,
      this.email,
      this.password,
      this.name,
      this.position,
      this.department,
      this.phone_number
    );
  }
}
