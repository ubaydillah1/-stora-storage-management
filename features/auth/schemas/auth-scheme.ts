import { FormScheme } from "../types/auth-types";
import { z } from "zod";

export const authFormScheme = (formType: FormScheme) => {
  const baseSchema = z.object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?!.* )/, { message: "Password cannot contain spaces" }),
    username:
      formType === "register"
        ? z
            .string()
            .trim()
            .toLowerCase()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must be at most 20 characters")
        : z.string().optional(),
    confirmPassword:
      formType === "register"
        ? z
            .string()
            .min(8, "Confirm password must be at least 8 characters")
            .max(20, "Confirm password must be at most 20 characters")
        : z.string().optional(),
  });

  return formType === "register"
    ? baseSchema.refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
      })
    : baseSchema;
};
