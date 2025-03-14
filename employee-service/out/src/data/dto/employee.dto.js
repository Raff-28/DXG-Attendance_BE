import { UpdateEmployeeEntity } from "../entity/employee.entity.js";
export class PutEmployeeRequestBody {
    full_name;
    position;
    department;
    phone_number;
    constructor(full_name, position, department, phone_number) {
        this.full_name = full_name;
        this.position = position;
        this.department = department;
        this.phone_number = phone_number;
    }
    toEntity(employeeId) {
        return new UpdateEmployeeEntity(employeeId, this.full_name, this.position, this.department, this.phone_number);
    }
    static fromSchema(schema) {
        return new PutEmployeeRequestBody(schema.full_name, schema.position, schema.department, schema.phone_number);
    }
}
export class EmployeeResponseData {
    id;
    user_id;
    full_name;
    position;
    department;
    phone_number;
    email;
    constructor(id, user_id, full_name, position, department, phone_number, email) {
        this.id = id;
        this.user_id = user_id;
        this.full_name = full_name;
        this.position = position;
        this.department = department;
        this.phone_number = phone_number;
        this.email = email;
    }
}
