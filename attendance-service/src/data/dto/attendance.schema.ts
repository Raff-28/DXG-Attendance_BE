import { z } from "zod";

export const postAttendanceSchema = z.object({
  photo: z
    .object({
      mimetype: z.enum(["image/jpeg", "image/png", "image/jpg"]),
      size: z.number().max(5 * 1024 * 1024, "Photo must not exceed 5MB"),
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype),
      {
        message: "Photo must be an image file of type jpeg, jpg, or png",
      }
    ),
});
