"use server";

import axios from "axios";
import { LoginSchema, RegisterSchema } from "../types/auth-types";
import { API_BASE_URL } from "@/lib/config";

export const registerUser = async (formData: RegisterSchema) => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      JSON.stringify(formData)
    );
    console.log(result);
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};

export const loginUser = async (formData: LoginSchema) => {
  try {
    const result = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      JSON.stringify(formData)
    );
    console.log(result);
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};
