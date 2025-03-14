import { EmployeeResponseData } from "../dto/employee.dto.js";
export class EmployeeEntity {
    id;
    userId;
    fullName;
    position;
    department;
    phone;
    email;
    constructor(id, userId, fullName, position, department, phone, email) {
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.position = position;
        this.department = department;
        this.phone = phone;
        this.email = email;
    }
    toDto() {
        return new EmployeeResponseData(this.id, this.userId, this.fullName, this.position, this.department, this.phone, this.email);
    }
}
export class UpdateEmployeeEntity {
    id;
    fullName;
    position;
    department;
    phone;
    constructor(id, fullName, position, department, phone) {
        this.id = id;
        this.fullName = fullName;
        this.position = position;
        this.department = department;
        this.phone = phone;
    }
}
