import z from "zod";
import { authFormScheme } from "../schemas/auth-scheme";

export type FormScheme = "login" | "register";

const loginSchema = authFormScheme("login");
const registerSchema = authFormScheme("register");

// Export type untuk kedua schema
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

// Atau jika ingin gabungkan dalam union type
export type AuthSchema = LoginSchema | RegisterSchema;
