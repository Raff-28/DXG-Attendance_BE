import { ReasonPhrases } from "http-status-codes";

export const ErrInternalServer = new Error(ReasonPhrases.INTERNAL_SERVER_ERROR);
export const ErrEmailAlreadyExist = new Error("Email already exist");
