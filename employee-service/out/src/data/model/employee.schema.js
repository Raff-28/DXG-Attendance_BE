import { z } from "zod";
export const putEmployeeSchema = z.object({
    full_name: z.string().nonempty().optional(),
    position: z.string().nonempty().optional(),
    department: z.string().nonempty().optional(),
    phone_number: z
        .string()
        .min(10)
        .regex(/^\d+$/, { message: "Must be a valid number" })
        .optional(),
});
