import bcrypt from "bcrypt";
import { ErrInternalServer } from "../../src/errors/sentinel.js";

export interface Bcrypt {
  hash(password: string, rounds: number): Promise<string>;
}

export class BcryptImpl {
  async hash(password: string, rounds: number) {
    try {
      return await bcrypt.hash(password, rounds);
    } catch (error) {
      throw ErrInternalServer;
    }
  }
}
