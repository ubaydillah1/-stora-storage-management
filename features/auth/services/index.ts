import axios, { AxiosError } from "axios";
import {
  LoginSchema,
  RegisterResult,
  RegisterSchema,
} from "../types/auth-types";
import { API_BASE_URL } from "@/lib/config";

export const registerUser = async (
  formData: RegisterSchema
): Promise<RegisterResult> => {
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
    const err = error as AxiosError<{ message?: string }>;
    const message = err.response?.data?.message ?? "Unknown error occurred";

    return {
      success: false,
      error: { message },
    };
  }
};

export const loginUser = async (
  formData: LoginSchema
): Promise<RegisterResult> => {
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
    const err = error as AxiosError<{ message?: string }>;
    const message = err.response?.data?.message ?? "Unknown error occurred";

    return {
      success: false,
      error: { message },
    };
  }
};
