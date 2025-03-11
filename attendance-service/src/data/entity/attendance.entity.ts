import { PostAttendanceResponseData } from "../dto/attendance.dto.js";

export class AttendanceEntity {
  photo: Buffer;
  mimeType: string;
  id: number;
  employeeId: number;
  photoUrl: string;
  timestamp: Date;

  constructor(
    photo: Buffer,
    mimeType: string,
    id?: number,
    employeeId?: number,
    photoUrl?: string,
    timestamp?: Date
  ) {
    this.photo = photo;
    this.mimeType = mimeType;
    this.id = id || 0;
    this.employeeId = employeeId || 0;
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
