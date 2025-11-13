import { authFormScheme } from "@/features/api/auth/schemas/auth-schemes";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sendOTP } from "@/features/api/auth/utils/otp";

export const POST = async (req: Request) => {
  const body = await req.json();

  const validationResult = authFormScheme("register").safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        message: validationResult.error.issues.map((issue) => {
          return { path: issue.path[0], message: issue.message };
        }),
      },
      { status: 400 }
    );
  }

  const { username, email, password } = validationResult.data;

  if (!username)
    return NextResponse.json(
      { message: "Username not found", code: "USERNAME_NOT_FOUND" },
      { status: 400 }
    );

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already in use",
          code: "EMAIL_IN_USE",
        },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPasword = await bcrypt.hash(password, salt);

    const registeredUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashPasword,
      },
    });

    await sendOTP(registeredUser);

    return NextResponse.json({
      message: "Registration successful",
    });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
