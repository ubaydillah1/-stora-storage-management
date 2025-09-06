/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { ValidationResult } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const parseStringify = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

export const generateRandomNumber = (): string => {
  return String(Math.floor(Math.random() * 900000) + 100000);
};

export const validateRequest = (
  body: any,
  requiredFields: string[]
): ValidationResult => {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!body || !body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    const fieldNames = missingFields
      .map((field) => `'${String(field)}'`)
      .join(", ");
    const message = `The following fields are required: ${fieldNames}.`;
    return {
      isValid: false,
      message,
    };
  }
  return {
    isValid: true,
    message: "Success, valid fields",
  };
};

