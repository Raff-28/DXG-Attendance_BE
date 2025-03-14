import { ReasonPhrases, StatusCodes } from "http-status-codes";
export class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
export const ErrEmployeeNotFound = new HttpError(StatusCodes.BAD_REQUEST, "Employee not found");
export const ErrUserNotFound = new HttpError(StatusCodes.BAD_REQUEST, "User not found");
export const ErrInternalServer = new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR);
export const ErrUnauthorized = new HttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
export const ErrInvalidId = new HttpError(StatusCodes.BAD_REQUEST, "Invalid id");
export const ErrInvalidBody = new HttpError(StatusCodes.BAD_REQUEST, "Invalid request body");
