import axios from "axios";
import { ErrInternalServer, ErrUnauthorized, HttpError, } from "../errors/http.js";
export function authenticate(requiredRole) {
    return async (req, res, next) => {
        try {
            const response = await axios.get(`${process.env.AUTH_SERVICE_BASE_URL}/credentials`, {
                headers: {
                    Authorization: req.headers.authorization,
                },
            });
            if (response.data.data?.role !== requiredRole) {
                throw ErrUnauthorized;
            }
            next();
        }
        catch (e) {
            if (e instanceof HttpError) {
                res.status(e.status).json({ message: e.message });
            }
            else if (axios.isAxiosError(e) &&
                e.response?.data.message) {
                res
                    .status(e.response.status)
                    .json({ message: e.response.data.message });
            }
            else {
                res
                    .status(ErrInternalServer.status)
                    .json({ message: ErrInternalServer.message });
            }
        }
    };
}
