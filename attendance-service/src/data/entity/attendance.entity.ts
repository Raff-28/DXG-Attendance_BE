import { PostAttendanceResponseData } from "../dto/attendance.dto.js";

export class AttendanceEntity {
  employeeId: number;
  photo: Buffer;
  mimeType: string;
  id: number;
  photoUrl: string;
  timestamp: Date;

  constructor(
    employeeId: number,
    photo: Buffer,
    mimeType: string,
    id?: number,
    photoUrl?: string,
    timestamp?: Date
  ) {
    this.employeeId = employeeId;
    this.photo = photo;
    this.mimeType = mimeType;
    this.id = id || 0;
    this.photoUrl = photoUrl || "";
    this.timestamp = timestamp || new Date();
  }

  toDto() {
    return new PostAttendanceResponseData(
      this.id,
      this.employeeId,
      this.photoUrl,
      new Date(this.timestamp.getTime() + 1000 * 60 * 60 * 7)
    );
  }
}
