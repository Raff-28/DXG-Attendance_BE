export class EmployeeResponseData {
    id;
    user_id;
    full_name;
    position;
    department;
    phone_number;
    constructor(id, user_id, full_name, position, department, phone_number) {
        this.id = id;
        this.user_id = user_id;
        this.full_name = full_name;
        this.position = position;
        this.department = department;
        this.phone_number = phone_number;
    }
}
