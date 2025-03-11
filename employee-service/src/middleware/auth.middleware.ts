import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { CredentialsResponseData } from "../data/dto/auth.dto.js";
import { AppResponse } from "../data/dto/response.js";
import { Role } from "../data/model/user.model.js";
import {
  ErrInternalServer,
  ErrUnauthorized,
  HttpError,
} from "../errors/http.js";

export function authenticate(requiredRole: Role) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get<AppResponse<CredentialsResponseData>>(
        `${process.env.AUTH_SERVICE_BASE_URL}/credentials`,
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );
      if (response.data.data?.role !== requiredRole) {
        throw ErrUnauthorized;
      }
      next();
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).json({ message: e.message });
      } else if (
        axios.isAxiosError<AppResponse<void>>(e) &&
        e.response?.data.message
      ) {
        res
          .status(e.response.status)
          .json({ message: e.response.data.message });
      } else {
        res
          .status(ErrInternalServer.status)
          .json({ message: ErrInternalServer.message });
      }
    }
  };
}
