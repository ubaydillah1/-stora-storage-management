import { sendOTP } from "@/features/api/auth/utils/otp";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { email } = body;

  const requiredFields = ["email"];
  const validationResult = validateRequest(body, requiredFields);

  if (!validationResult.isValid) {
    return NextResponse.json(
      {
        message: validationResult.message,
      },
      { status: 400 }
    );
  }

  if (!email) {
    return NextResponse.json(
      {
        message: "Missing email field",
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
      {
        message: "User not found",
      },
      { status: 404 }
    );
  }

  await sendOTP(existingUser);

  return NextResponse.json({ message: "Successful" });
};
