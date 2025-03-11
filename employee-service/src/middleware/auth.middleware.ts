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
        `http://localhost:${process.env.AUTH_SERVICE_PORT}/credentials`,
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );
      if (response.data.message) {
        throw new Error(response.data.message);
      }
      if (response.data.data?.role !== requiredRole) {
        throw ErrUnauthorized;
      }
      next();
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).send({ message: e.message });
      } else if (
        axios.isAxiosError<AppResponse<void>>(e) &&
        e.response?.data.message
      ) {
        res
          .status(ErrUnauthorized.status)
          .send({ message: e.response.data.message });
      } else {
        res
          .status(ErrInternalServer.status)
          .json({ message: ErrInternalServer.message });
      }
    }
  };
}
