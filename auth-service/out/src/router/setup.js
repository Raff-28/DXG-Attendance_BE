import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { loginSchema, registerSchema } from "../data/dto/auth.schema.js";
import { validateData } from "../middleware/validation.middleware.js";
export function setupRouter(c) {
    const r = express();
    r.use(cors());
    r.use(express.json());
    r.post("/register", validateData(registerSchema), c.register.bind(c));
    r.post("/login", validateData(loginSchema), c.login.bind(c));
    r.get("/credentials", c.getCredentials.bind(c));
    r.use((_req, res) => {
        res.status(StatusCodes.NOT_FOUND).json({ message: "404 Not Found" });
    });
    return r;
}
