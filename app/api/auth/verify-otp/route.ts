import { prisma } from "@/lib/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/features/auth/helpers/auth-helpers";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/utils";
import { FIFTEEN_MINUTES, SEVEN_DAYS } from "@/features/auth/constants";
import { NODE_ENV } from "@/lib/config";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { email, otp } = body;

  const requiredFields = ["email", "otp"];
  const validationResult = validateRequest(body, requiredFields);

  if (!validationResult.isValid) {
    return NextResponse.json(
      {
        message: validationResult.message,
      },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return NextResponse.json(
      { message: "User or OTP not found" },
      { status: 404 }
    );
  }

  if (existingUser?.otp !== otp) {
    return NextResponse.json({ message: "Mismatch OTP" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  const accessToken = await generateAccessToken({
    userId: existingUser.id,
  });

  const refreshToken = await generateRefreshToken({
    userId: existingUser.id,
  });

  (await cookies()).set("r", refreshToken, {
    httpOnly: true,
    sameSite: NODE_ENV === "production" ? "lax" : "none",
    secure: true,
    maxAge: SEVEN_DAYS,
  });

  (await cookies()).set("a", accessToken, {
    sameSite: NODE_ENV === "production" ? "lax" : "none",
    secure: true,
    maxAge: SEVEN_DAYS,
  });

  const csrfToken = uuidv4();
  (await cookies()).set("csrfToken", csrfToken, {
    sameSite: NODE_ENV === "production" ? "lax" : "none",
    maxAge: FIFTEEN_MINUTES,
    secure: false,
  });

  return NextResponse.json({ message: "Verify successful" });
};
