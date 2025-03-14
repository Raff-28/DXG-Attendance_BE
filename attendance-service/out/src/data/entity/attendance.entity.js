import { AttendanceResponseData } from "../dto/attendance.dto.js";
export class AttendanceEntity {
    photo;
    mimeType;
    id;
    employeeId;
    photoUrl;
    timestamp;
    workDescription;
    reasonForWfh;
    constructor(photo, mimeType, id, employeeId, photoUrl, timestamp, workDescription, reasonForWfh) {
        this.photo = photo || Buffer.from("");
        this.mimeType = mimeType || "";
        this.id = id || 0;
        this.employeeId = employeeId || 0;
        this.photoUrl = photoUrl || "";
        this.timestamp = timestamp || new Date();
        this.workDescription = workDescription || "";
        this.reasonForWfh = reasonForWfh || "";
    }
    toDto() {
        return new AttendanceResponseData(this.id, this.employeeId, this.photoUrl, new Date(this.timestamp.getTime() + 1000 * 60 * 60 * 7), this.workDescription, this.reasonForWfh);
    }
}
export class AttendanceQueryParamEntity {
    employeeId;
    pageNumber;
    pageSize;
    constructor(employeeId, pageNumber = 1, pageSize = 10) {
        this.employeeId = employeeId;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
