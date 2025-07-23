import { authFormScheme } from "@/features/auth/schemas/auth-scheme";
import { prisma } from "@/lib/client/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

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
      { message: "Username not found" },
      { status: 400 }
    );

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already in use",
        },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPasword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        email,
        username,
        password: hashPasword,
      },
    });

    return NextResponse.json({ message: "Registration successful" });
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
