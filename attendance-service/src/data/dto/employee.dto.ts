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
