import {
  CredentialsResponseData,
  LoginResponseData,
  RegisterBody,
} from "../dto/auth.dto.js";
import { Role } from "../model/user.model.js";

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

export class LoginEntity {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class UserEntity {
  id: number;
  email: string;
  password: string;
  role: Role;
  constructor(id: number, email: string, password: string, role: Role) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  toCredentialsDto() {
    return new CredentialsResponseData(this.id, this.role);
  }
}

export class UserToken {
  token: string;
  constructor(token: string) {
    this.token = token;
  }

  toDto() {
    return new LoginResponseData(this.token);
  }
}

export class UserTokenPayload {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
}
