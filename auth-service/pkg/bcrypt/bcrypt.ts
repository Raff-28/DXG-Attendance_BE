import bcrypt from "bcrypt";
import { ErrInternalServer } from "../../src/errors/sentinel.js";

export interface Bcrypt {
  hash(password: string, rounds: number): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export class BcryptImpl {
  async hash(password: string, rounds: number) {
    try {
      return await bcrypt.hash(password, rounds);
    } catch (error) {
      throw ErrInternalServer;
    }
  }
  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (e) {
      throw ErrInternalServer;
    }
  }
}
