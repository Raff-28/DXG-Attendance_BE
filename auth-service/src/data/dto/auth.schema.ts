import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().nonempty().email(),
  password: z
    .string()
    .nonempty({ message: "Must be filled" })
    .min(7, { message: "Password must be at least 7 characters long" })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[!-\/:-@[-`{-~]/.test(value), {
      message: "Password must contain at least one special character",
    }),
  name: z.string().nonempty(),
  position: z.string().nonempty(),
  department: z.string().nonempty(),
  phone_number: z
    .string()
    .nonempty()
    .min(10)
    .regex(/^\d+$/, { message: "Must be a valid number" }),
});
