import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CredentialsResponseData,
  LoginRequestBody,
  LoginResponseData,
  RegisterBody,
} from "../data/dto/auth.dto.js";
import { AppResponse } from "../data/dto/response.js";
import { ErrTokenNotProvided, HttpError } from "../errors/http.js";
import { ErrInternalServer } from "../errors/sentinel.js";
import { AuthUsecase } from "../usecase/auth.usecase.js";

export class AuthController {
  private authUseCase: AuthUsecase;
  constructor(authUseCase: AuthUsecase) {
    this.authUseCase = authUseCase;
  }
  async register(req: Request, res: Response) {
    try {
      const reqBody = req.body;
      const validatedBody = RegisterBody.fromSchema(reqBody);
      const result = await this.authUseCase.register(validatedBody.toEntity());
      const response: AppResponse<RegisterBody> = {
        data: result.toDto(),
      };
      res.status(StatusCodes.CREATED).json(response);
    } catch (e) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      if (e instanceof Error) {
        if (e !== ErrInternalServer) {
          statusCode = StatusCodes.BAD_REQUEST;
        }
        res.status(statusCode).json({ message: e.message });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const reqBody = req.body;
      const validatedBody = LoginRequestBody.fromSchema(reqBody);
      const result = await this.authUseCase.login(validatedBody);
      const response: AppResponse<LoginResponseData> = {
        data: result.toDto(),
      };
      res.status(StatusCodes.OK).json(response);
    } catch (e) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      if (e instanceof Error) {
        if (e !== ErrInternalServer) {
          statusCode = StatusCodes.BAD_REQUEST;
        }
        res.status(statusCode).json({ message: e.message });
      }
    }
  }

  async getCredentials(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (
        !authHeader ||
        !authHeader.startsWith("Bearer ") ||
        authHeader.split(" ").length !== 2
      ) {
        throw ErrTokenNotProvided;
      }
      const user = await this.authUseCase.getUserData(authHeader.split(" ")[1]);
      const response: AppResponse<CredentialsResponseData> = {
        data: user.toCredentialsDto(),
      };
      res.status(StatusCodes.OK).json(response);
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).json({ message: e.message });
      } else if (e instanceof Error) {
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        if (e !== ErrInternalServer) {
          statusCode = StatusCodes.BAD_REQUEST;
        }
        res.status(statusCode).json({ message: e.message });
      }
    }
  }
}
