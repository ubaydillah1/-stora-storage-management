/* eslint-disable @typescript-eslint/no-unused-vars */
import z from "zod";
import { authFormScheme } from "../schemas/auth-schemes";
import { AxiosError } from "axios";

export type FormScheme = "login" | "register";

const loginSchema = authFormScheme("login");
const registerSchema = authFormScheme("register");

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

export type AuthSchema = LoginSchema | RegisterSchema;

export type AuthSuccessResponse = {
  message: string;
  accessToken: string;
  userId: string;
};

export type AuthErrorResponse = {
  message: string;
  code?: string;
};

export type AuthResult =
  | { success: true; data: AuthSuccessResponse }
  | { success: false; error: AuthErrorResponse };

export type Error = AxiosError<{ message: string; code: string }>;

export type InputOTPFormProps = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
};
