import { CredentialsResponseData, LoginResponseData, RegisterBody, } from "../dto/auth.dto.js";
export class RegisterEntity {
    id;
    email;
    password;
    name;
    position;
    department;
    phoneNumber;
    constructor(id, email, password, name, position, department, phone_number) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.position = position;
        this.department = department;
        this.phoneNumber = phone_number;
    }
    toDto() {
        return new RegisterBody(this.email, this.password, this.name, this.position, this.department, this.phoneNumber, this.id);
    }
}
export class LoginEntity {
    email;
    password;
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
export class UserEntity {
    id;
    email;
    password;
    role;
    constructor(id, email, password, role) {
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
    token;
    constructor(token) {
        this.token = token;
    }
    toDto() {
        return new LoginResponseData(this.token);
    }
}
export class UserTokenPayload {
    id;
    constructor(id) {
        this.id = id;
    }
}
