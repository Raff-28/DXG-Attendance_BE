import { RegisterEntity } from "../entity/auth.entity.js";
export class RegisterBody {
    id;
    email;
    password;
    name;
    position;
    department;
    phone_number;
    constructor(email, password, name, position, department, phone_number, id = 0) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.position = position;
        this.department = department;
        this.phone_number = phone_number;
    }
    static fromSchema(data) {
        return new RegisterBody(data.email, data.password, data.name, data.position, data.department, data.phone_number);
    }
    toEntity() {
        return new RegisterEntity(this.id, this.email, this.password, this.name, this.position, this.department, this.phone_number);
    }
}
export class LoginRequestBody {
    email;
    password;
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    static fromSchema(data) {
        return new LoginRequestBody(data.email, data.password);
    }
}
export class LoginResponseData {
    token;
    constructor(token) {
        this.token = token;
    }
}
export class CredentialsResponseData {
    id;
    role;
    constructor(id, role) {
        this.id = id;
        this.role = role;
    }
}
