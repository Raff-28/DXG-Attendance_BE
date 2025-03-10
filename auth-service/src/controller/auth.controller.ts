import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  LoginRequestBody,
  LoginResponseData,
  RegisterBody,
} from "../data/dto/auth.dto.js";
import { AppResponse } from "../data/dto/response.js";
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
}
