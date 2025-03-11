export class EmployeeEntity {
  id: number;
  userId: number;
  fullName: string;
  position: string;
  department: string;
  phone: string;

  constructor(
    id: number,
    userId: number,
    fullName: string,
    position: string,
    department: string,
    phone: string
  ) {
    this.id = id;
    this.userId = userId;
    this.fullName = fullName;
    this.position = position;
    this.department = department;
    this.phone = phone;
  }
}
