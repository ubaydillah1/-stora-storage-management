import { NextResponse } from "next/server";
import { authFormScheme } from "@/features/auth/schemas/auth-scheme";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTP } from "@/features/auth/utils/otp";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils";
import { cookies } from "next/headers";

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

    (await cookies()).set("r", refreshToken);

    return NextResponse.json({ message: "Login successful", accessToken });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
