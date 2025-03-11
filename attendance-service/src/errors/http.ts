import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const ErrInternalServer = new HttpError(
  StatusCodes.INTERNAL_SERVER_ERROR,
  ReasonPhrases.INTERNAL_SERVER_ERROR
);

export const ErrUnauthorized = new HttpError(
  StatusCodes.UNAUTHORIZED,
  ReasonPhrases.UNAUTHORIZED
);

export const ErrAlreadyAttend = new HttpError(
  StatusCodes.BAD_REQUEST,
  "Employee has already attended"
);
