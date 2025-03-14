import { ReasonPhrases } from "http-status-codes";
export const ErrInternalServer = new Error(ReasonPhrases.INTERNAL_SERVER_ERROR);
export const ErrEmailAlreadyExist = new Error("Email already exist");
export const ErrUserDoesNotExist = new Error("User does not exist");
export const ErrInvalidEmailOrPassword = new Error("Invalid email or password");
