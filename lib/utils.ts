/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY } from "./config";
import { ValidationResult } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateAccessToken = (user: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user,
      ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) {
          return reject(err);
        }

        if (!token) {
          return reject(new Error("JWT token was not generated."));
        }

        return resolve(token);
      }
    );
  });
};

export const generateRefreshToken = (user: object): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user,
      REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return reject(err);
        }

        if (!token) {
          return reject(new Error("JWT token was not generated."));
        }

        return resolve(token);
      }
    );
  });
};

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

export const isValidToken = async ({
  type = "ACCESS_TOKEN",
  token,
}: {
  type?: "REFRESH_TOKEN" | "ACCESS_TOKEN";
  token: string;
}): Promise<{ isValid: boolean; error?: "expired" | "invalid" }> => {
  const secretKey =
    type === "REFRESH_TOKEN"
      ? REFRESH_TOKEN_PRIVATE_KEY
      : ACCESS_TOKEN_PRIVATE_KEY;

  try {
    await new Promise<void>((resolve, reject) => {
      jwt.verify(token, secretKey, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    return { isValid: true };
  } catch (error) {
    console.log(error);
    if (error instanceof TokenExpiredError) {
      return { isValid: false, error: "expired" };
    }
    return { isValid: false, error: "invalid" };
  }
};
