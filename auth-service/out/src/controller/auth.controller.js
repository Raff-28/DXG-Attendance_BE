import { StatusCodes } from "http-status-codes";
import { LoginRequestBody, RegisterBody, } from "../data/dto/auth.dto.js";
import { ErrForbidden, ErrTokenNotProvided, HttpError, } from "../errors/http.js";
import { ErrInternalServer } from "../errors/sentinel.js";
export class AuthController {
    authUseCase;
    constructor(authUseCase) {
        this.authUseCase = authUseCase;
    }
    async register(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader ||
                !authHeader.startsWith("Bearer ") ||
                authHeader.split(" ").length !== 2) {
                throw ErrTokenNotProvided;
            }
            const user = await this.authUseCase.getUserData(authHeader.split(" ")[1]);
            if (user.role !== "admin") {
                throw ErrForbidden;
            }
            const reqBody = req.body;
            const validatedBody = RegisterBody.fromSchema(reqBody);
            const result = await this.authUseCase.register(validatedBody.toEntity());
            const response = {
                data: result.toDto(),
            };
            res.status(StatusCodes.CREATED).json(response);
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else {
                let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
                if (e instanceof Error) {
                    if (e !== ErrInternalServer) {
                        statusCode = StatusCodes.BAD_REQUEST;
                    }
                    res.status(statusCode).json({ message: e.message });
                }
            }
        }
    }
    async login(req, res) {
        try {
            const reqBody = req.body;
            const validatedBody = LoginRequestBody.fromSchema(reqBody);
            const result = await this.authUseCase.login(validatedBody);
            const response = {
                data: result.toDto(),
            };
            res.status(StatusCodes.OK).json(response);
        }
        catch (e) {
            let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            if (e instanceof Error) {
                if (e !== ErrInternalServer) {
                    statusCode = StatusCodes.BAD_REQUEST;
                }
                res.status(statusCode).json({ message: e.message });
            }
        }
    }
    async getCredentials(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader ||
                !authHeader.startsWith("Bearer ") ||
                authHeader.split(" ").length !== 2) {
                throw ErrTokenNotProvided;
            }
            const user = await this.authUseCase.getUserData(authHeader.split(" ")[1]);
            const response = {
                data: user.toCredentialsDto(),
            };
            res.status(StatusCodes.OK).json(response);
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else if (e instanceof Error) {
                let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
                if (e !== ErrInternalServer) {
                    statusCode = StatusCodes.BAD_REQUEST;
                }
                res.status(statusCode).json({ message: e.message });
            }
        }
    }
}
