import { AttendanceResponseData } from "../dto/attendance.dto.js";

export class AttendanceEntity {
  photo: Buffer;
  mimeType: string;
  id: number;
  employeeId: number;
  photoUrl: string;
  timestamp: Date;

  constructor(
    photo?: Buffer,
    mimeType?: string,
    id?: number,
    employeeId?: number,
    photoUrl?: string,
    timestamp?: Date
  ) {
    this.photo = photo || Buffer.from("");
    this.mimeType = mimeType || "";
    this.id = id || 0;
    this.employeeId = employeeId || 0;
    this.photoUrl = photoUrl || "";
    this.timestamp = timestamp || new Date();
  }

  toPostDto() {
    return new AttendanceResponseData(
      this.id,
      this.employeeId,
      this.photoUrl,
      new Date(this.timestamp.getTime() + 1000 * 60 * 60 * 7)
    );
  }

  toGetDto() {
    return new AttendanceResponseData(
      this.id,
      this.employeeId,
      this.photoUrl,
      this.timestamp
    );
  }
}

export class AttendanceQueryParamEntity {
  employeeId: number;
  pageNumber: number;
  pageSize: number;

  constructor(
    employeeId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ) {
    this.employeeId = employeeId;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }
}
