import { NextResponse } from "next/server";
import { authFormScheme } from "@/features/api/auth/schemas/auth-schemes";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTP } from "@/features/api/auth/utils/otp";
import { cookies } from "next/headers";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/features/api/auth/helpers/auth-helpers";
import { SEVEN_DAYS } from "@/features/api/auth/constants";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const validationResult = authFormScheme("login").safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          errors: validationResult.error.issues.map((issue) => {
            return { path: issue.path[0], message: issue.message };
          }),
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found, please register first" },
        { status: 404 }
      );
    }

    const salt = await bcrypt.compare(password, user.password);

    if (!salt) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        { status: 400 }
      );
    }

    if (!user.emailVerified) {
      await sendOTP(user);

      return NextResponse.json(
        {
          message: "Email already in use but not verified",
          code: "USER_NOT_VERIFIED",
        },
        { status: 400 }
      );
    }

    const accessToken = await generateAccessToken({
      userId: user.id,
    });
    const refreshToken = await generateRefreshToken({
      userId: user.id,
    });

    (await cookies()).set("r", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: SEVEN_DAYS,
    });

    (await cookies()).set("a", accessToken, {
      sameSite: "lax",
      secure: true,
      maxAge: SEVEN_DAYS,
    });

    const csrfToken = uuidv4();
    (await cookies()).set("csrfToken", csrfToken, {
      sameSite: "lax",
      maxAge: SEVEN_DAYS,
      secure: true,
    });

    return NextResponse.json({ message: "Login successful", result: user });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
