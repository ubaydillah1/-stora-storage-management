import jwt, { TokenExpiredError, JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY } from "./config";
import { UserToken } from "./types";

type TokenCheckingResult =
  | { isValid: true; user: UserToken }
  | { isValid: false; error: "expired" | "invalid" };

type TokenCheckingParams = {
  type?: "REFRESH_TOKEN" | "ACCESS_TOKEN";
  token: string;
};

export const TokenCheckingWithResult = ({
  type = "ACCESS_TOKEN",
  token,
}: TokenCheckingParams): TokenCheckingResult => {
  const secretKey =
    type === "REFRESH_TOKEN"
      ? REFRESH_TOKEN_PRIVATE_KEY
      : ACCESS_TOKEN_PRIVATE_KEY;

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload | string;

    if (typeof decoded === "string" || !decoded.userId) {
      return { isValid: false, error: "invalid" };
    }

    return { isValid: true, user: { userId: decoded.userId } };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return { isValid: false, error: "expired" };
    }
    return { isValid: false, error: "invalid" };
  }
};
