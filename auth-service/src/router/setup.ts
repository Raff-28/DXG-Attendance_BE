import express, { Express } from "express";
import { AuthController } from "../controller/auth.controller.js";
import { loginSchema, registerSchema } from "../data/dto/auth.schema.js";
import { validateData } from "../middleware/validation.middleware.js";

export function setupRouter(c: AuthController): Express {
  const r = express();
  r.use(express.json());
  r.post("/register", validateData(registerSchema), c.register.bind(c));
  r.post("/login", validateData(loginSchema), c.login.bind(c));
  r.get("/credentials", c.getCredentials.bind(c));

  return r;
}
