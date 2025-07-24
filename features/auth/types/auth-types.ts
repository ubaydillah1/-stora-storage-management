/* eslint-disable @typescript-eslint/no-unused-vars */
import z from "zod";
import { authFormScheme } from "../schemas/auth-scheme";

export type FormScheme = "login" | "register";

const loginSchema = authFormScheme("login");
const registerSchema = authFormScheme("register");

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

export type AuthSchema = LoginSchema | RegisterSchema;

export type RegisterSuccessResponse = {
  message: string;
  accessToken: string;
  userId: string;
};

export type RegisterErrorResponse = {
  message: string;
  code?: string;
};

export type RegisterResult =
  | { success: true; data: RegisterSuccessResponse }
  | { success: false; error: RegisterErrorResponse };
