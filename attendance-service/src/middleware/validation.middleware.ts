import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";
import { AppResponse } from "../data/dto/response.js";

export function validateData(
  bodySchema?: z.ZodObject<any, any>,
  querySchema?: z.ZodObject<any, any>,
  formDataSchema?: z.ZodObject<any, any>,
  paramSchema?: z.ZodObject<any, any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = querySchema?.parse(req.query) || req.query;
      req.params = paramSchema?.parse(req.params) || req.params;
      if (formDataSchema) {
        const data = { photo: req.file, ...req.body };
        req.body = formDataSchema.parse(data);
      } else {
        req.body = bodySchema?.parse(req.body) || req.body;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        const response: AppResponse<void> = {
          message: "Invalid data",
          errors: errorMessages,
        };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}
