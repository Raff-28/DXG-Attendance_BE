import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const ErrTokenNotProvided = new HttpError(
  StatusCodes.UNAUTHORIZED,
  "Token not provided"
);

export const ErrInvalidToken = new HttpError(
  StatusCodes.UNAUTHORIZED,
  "Invalid token"
);

export const ErrForbidden = new HttpError(
  StatusCodes.FORBIDDEN,
  ReasonPhrases.FORBIDDEN
);
