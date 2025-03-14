import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
export function validateData(bodySchema, querySchema, formDataSchema, paramSchema) {
    return (req, res, next) => {
        try {
            req.query = querySchema?.parse(req.query) || req.query;
            req.params = paramSchema?.parse(req.params) || req.params;
            if (formDataSchema) {
                const data = { photo: req.file, ...req.body };
                req.body = formDataSchema.parse(data);
            }
            else {
                req.body = bodySchema?.parse(req.body) || req.body;
            }
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join(".")} is ${issue.message}`,
                }));
                const response = {
                    message: "Invalid data",
                    errors: errorMessages,
                };
                res.status(StatusCodes.BAD_REQUEST).json(response);
            }
            else {
                res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
            }
        }
    };
}
