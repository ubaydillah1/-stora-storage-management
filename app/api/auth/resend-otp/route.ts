import { sendOTP } from "@/features/auth/utils/otp";
import { prisma } from "@/lib/client/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email } = await req.json();

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
