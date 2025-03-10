import jwt, { SignOptions } from "jsonwebtoken";
import { UserTokenPayload } from "../../src/data/entity/auth.entity.js";
import { ErrInternalServer } from "../../src/errors/sentinel.js";

export interface Jwt {
  sign(payload: UserTokenPayload, options?: SignOptions): string;
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
}
