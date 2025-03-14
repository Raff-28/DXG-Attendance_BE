import bcrypt from "bcrypt";
import { ErrInternalServer } from "../../src/errors/sentinel.js";
export class BcryptImpl {
    async hash(password, rounds) {
        try {
            return await bcrypt.hash(password, rounds);
        }
        catch (error) {
            throw ErrInternalServer;
        }
    }
    async compare(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        }
        catch (e) {
            throw ErrInternalServer;
        }
    }
}
