import axios from "axios";
import {
  Error,
  LoginSchema,
  AuthResult,
  RegisterSchema,
} from "../types/auth-types";
import { API_BASE_URL } from "@/lib/config";

export const registerUser = async (
  formData: RegisterSchema
): Promise<AuthResult> => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    const err = error as Error;
    const message = err.response?.data.message ?? "Unknown error occurred";
    const code = err.response?.data.code;

    return {
      success: false,
      error: { message, code },
    };
  }
};

export const loginUser = async (formData: LoginSchema): Promise<AuthResult> => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      JSON.stringify(formData)
    );

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    const err = error as Error;
    const code = err.response?.data.code;
    const message = err.response?.data?.message ?? "Unknown error occurred";

    return {
      success: false,
      error: { message, code },
    };
  }
};

export const verifyOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/auth/verify-otp`,
      JSON.stringify({ email, otp })
    );

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    const err = error as Error;
    const code = err.response?.data.code;
    const message = err.response?.data?.message ?? "Unknown error occurred";

    return {
      success: false,
      error: { message, code },
    };
  }
};

export const resendOtp = async ({ email }: { email: string }) => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/auth/resend-otp`,
      JSON.stringify({ email })
    );

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    const err = error as Error;
    const code = err.response?.data.code;
    const message = err.response?.data?.message ?? "Unknown error occurred";

    return {
      success: false,
      error: { message, code },
    };
  }
};
