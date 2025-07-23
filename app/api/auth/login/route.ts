import { NextResponse } from "next/server";
import { authFormScheme } from "@/features/auth/schemas/auth-scheme";
import { prisma } from "@/lib/client/prisma";
import bcrypt from "bcryptjs";

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
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const salt = await bcrypt.compare(password, user.password);

    if (!salt) {
      return NextResponse.json({
        message: "Invalid email or password",
      });
    }

    return NextResponse.json({ message: "Login successful" });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
