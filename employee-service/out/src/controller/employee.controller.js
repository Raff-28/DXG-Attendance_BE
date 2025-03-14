import { StatusCodes } from "http-status-codes";
import { PutEmployeeRequestBody, } from "../data/dto/employee.dto.js";
import { ErrInternalServer, ErrInvalidId, HttpError } from "../errors/http.js";
export class EmployeeController {
    employeeUsecase;
    constructor(employeeUsecase) {
        this.employeeUsecase = employeeUsecase;
    }
    async getEmployees(_req, res) {
        try {
            const employees = await this.employeeUsecase.getEmployees();
            const response = {
                data: employees.map((e) => e.toDto()),
            };
            res.status(StatusCodes.OK).json(response);
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else {
                res
                    .status(ErrInternalServer.status)
                    .json({ message: ErrInternalServer.message });
            }
        }
    }
    async getEmployeeDetails(req, res) {
        try {
            const { id } = req.params;
            const idNumber = Number(id);
            if (isNaN(idNumber) || idNumber < 1) {
                throw ErrInvalidId;
            }
            const employee = await this.employeeUsecase.getEmployeeDetails(idNumber);
            const response = {
                data: employee.toDto(),
            };
            res.status(StatusCodes.OK).json(response);
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else {
                res
                    .status(ErrInternalServer.status)
                    .json({ message: ErrInternalServer.message });
            }
        }
    }
    async deleteEmployee(req, res) {
        try {
            const { id } = req.params;
            const idNumber = Number(id);
            if (isNaN(idNumber) || idNumber < 1) {
                throw ErrInvalidId;
            }
            await this.employeeUsecase.deleteEmployee(idNumber);
            res.status(StatusCodes.NO_CONTENT).send();
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else {
                res
                    .status(ErrInternalServer.status)
                    .json({ message: ErrInternalServer.message });
            }
        }
    }
    async getEmployeeByUserId(req, res) {
        try {
            const { userId } = req.params;
            const userIdNumber = Number(userId);
            if (isNaN(userIdNumber) || userIdNumber < 1) {
                throw ErrInvalidId;
            }
            const employee = await this.employeeUsecase.getEmployeeByUserId(userIdNumber);
            const response = {
                data: employee.toDto(),
            };
            res.status(StatusCodes.OK).json(response);
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else {
                res
                    .status(ErrInternalServer.status)
                    .json({ message: ErrInternalServer.message });
            }
        }
    }
    async putEmployee(req, res) {
        try {
            const { id } = req.params;
            const idNumber = Number(id);
            if (isNaN(idNumber) || idNumber < 1) {
                throw ErrInvalidId;
            }
            const reqBody = PutEmployeeRequestBody.fromSchema(req.body);
            const updateEmployeeEntity = reqBody.toEntity(idNumber);
            await this.employeeUsecase.updateEmployee(updateEmployeeEntity);
            res.status(StatusCodes.NO_CONTENT).send();
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else {
                res
                    .status(ErrInternalServer.status)
                    .json({ message: ErrInternalServer.message });
            }
        }
    }
}
