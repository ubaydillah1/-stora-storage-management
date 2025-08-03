import { prisma } from "@/lib/client/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, otp } = await req.json();

  if (!email && !otp) {
    return NextResponse.json(
      { message: "Email or OTP are missing" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
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

  (await cookies()).set("r", refreshToken);

  return NextResponse.json({ message: "Verify successful", accessToken });
};
