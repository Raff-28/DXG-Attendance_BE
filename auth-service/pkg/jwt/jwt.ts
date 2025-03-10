import jwt, { SignOptions } from "jsonwebtoken";
import { UserTokenPayload } from "../../src/data/entity/auth.entity.js";
import { ErrInvalidToken } from "../../src/errors/http.js";
import { ErrInternalServer } from "../../src/errors/sentinel.js";

export interface Jwt {
  sign(payload: UserTokenPayload, options?: SignOptions): string;
  verify(token: string): UserTokenPayload;
}

export class JwtImpl {
  sign(payload: UserTokenPayload, options?: SignOptions) {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw ErrInternalServer;
      }
      return jwt.sign(payload, secret, options);
    } catch (e) {
      throw ErrInternalServer;
    }
  }

  verify(token: string) {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw ErrInternalServer;
      }
      return jwt.verify(token, secret) as UserTokenPayload;
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        throw ErrInvalidToken;
      }
      throw ErrInternalServer;
    }
  }
}
