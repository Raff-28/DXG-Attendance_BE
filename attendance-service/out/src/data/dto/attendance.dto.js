export class AttendanceResponseData {
    id;
    employee_id;
    photo_url;
    timestamp;
    work_description;
    reason_for_wfh;
    constructor(id, employee_id, photoUrl, timestamp, work_description, reason_for_wfh) {
        this.id = id;
        this.employee_id = employee_id;
        this.photo_url = photoUrl;
        this.timestamp = timestamp;
        this.work_description = work_description;
        this.reason_for_wfh = reason_for_wfh;
    }
}
export class GetAttendanceByUserRequestQuery {
    page_number;
    page_size;
    constructor(page_number = 1, page_size = 10) {
        this.page_number = page_number;
        this.page_size = page_size;
    }
    static fromSchema(schema) {
        return new GetAttendanceByUserRequestQuery(schema.page_number, schema.page_size);
    }
}
