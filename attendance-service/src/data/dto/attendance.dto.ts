export class PostAttendanceResponseData {
  id: number;
  employee_id: number;
  photoUrl: string;
  timestamp: Date;

  constructor(
    id: number,
    employee_id: number,
    photoUrl: string,
    timestamp: Date
  ) {
    this.id = id;
    this.employee_id = employee_id;
    this.photoUrl = photoUrl;
    this.timestamp = timestamp;
  }
}
