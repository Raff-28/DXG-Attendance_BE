import { ReasonPhrases, StatusCodes } from "http-status-codes";
export class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
export const ErrInternalServer = new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR);
export const ErrUnauthorized = new HttpError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
export const ErrAlreadyAttend = new HttpError(StatusCodes.BAD_REQUEST, "Employee has already attended");
