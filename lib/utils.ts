import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY } from "./config";

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
  console.log(REFRESH_TOKEN_PRIVATE_KEY);
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
