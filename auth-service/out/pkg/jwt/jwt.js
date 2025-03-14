import jwt from "jsonwebtoken";
import { ErrInvalidToken } from "../../src/errors/http.js";
import { ErrInternalServer } from "../../src/errors/sentinel.js";
export class JwtImpl {
    sign(payload, options) {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw ErrInternalServer;
            }
            return jwt.sign(payload, secret, options);
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
    verify(token) {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw ErrInternalServer;
            }
            return jwt.verify(token, secret);
        }
        catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                throw ErrInvalidToken;
            }
            throw ErrInternalServer;
        }
    }
}
