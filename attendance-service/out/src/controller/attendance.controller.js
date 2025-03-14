import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { GetAttendanceByUserRequestQuery, } from "../data/dto/attendance.dto.js";
import { AttendanceEntity, } from "../data/entity/attendance.entity.js";
import { ErrInternalServer, HttpError } from "../errors/http.js";
export class AttendanceController {
    attendanceUsecase;
    constructor(attendanceUsecase) {
        this.attendanceUsecase = attendanceUsecase;
    }
    async postAttendance(req, res) {
        try {
            const attendanceEntity = new AttendanceEntity(req.file.buffer, req.body.photo.mimetype, undefined, undefined, undefined, undefined, req.body.work_description, req.body.reason_for_wfh);
            const employeeRes = await axios.get(`${process.env.EMPLOYEE_SERVICE_BASE_URL}/employees/by-user/${res.locals.userId}`, {
                headers: {
                    Authorization: req.headers.authorization,
                },
            });
            if (employeeRes.data.data) {
                attendanceEntity.employeeId = employeeRes.data.data.id;
            }
            const result = await this.attendanceUsecase.createAttendance(attendanceEntity);
            const response = {
                data: result.toDto(),
            };
            res.status(StatusCodes.OK).json(response);
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else if (axios.isAxiosError(e) &&
                e.response?.data.message) {
                res
                    .status(e.response?.status)
                    .json({ message: e.response.data.message });
            }
            else {
                res
                    .status(ErrInternalServer.status)
                    .json({ message: ErrInternalServer.message });
            }
        }
    }
    async getAttendancesByUser(req, res) {
        try {
            const reqQuery = GetAttendanceByUserRequestQuery.fromSchema(req.query);
            const reqQueryEntity = {
                employeeId: 0,
                pageNumber: reqQuery.page_number,
                pageSize: reqQuery.page_size,
            };
            const employeeRes = await axios.get(`${process.env.EMPLOYEE_SERVICE_BASE_URL}/employees/by-user/${req.params.userId}`, {
                headers: {
                    Authorization: req.headers.authorization,
                },
            });
            if (employeeRes.data.data) {
                reqQueryEntity.employeeId = employeeRes.data.data.id;
            }
            const result = await this.attendanceUsecase.getAttendancesByEmployee(reqQueryEntity);
            const attendancesResponse = result.attendances.map((r) => r.toDto());
            const paginationResponse = {
                page_number: reqQuery.page_number,
                page_size: reqQuery.page_size,
                total_pages: result.totalPages,
            };
            const response = {
                data: {
                    attendances: attendancesResponse,
                    pagination_info: paginationResponse,
                },
            };
            res.status(StatusCodes.OK).json(response);
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else if (axios.isAxiosError(e) &&
                e.response?.data.message) {
                res
                    .status(e.response?.status)
                    .json({ message: e.response.data.message });
            }
            else {
                res
                    .status(ErrInternalServer.status)
                    .json({ message: ErrInternalServer.message });
            }
        }
    }
}
