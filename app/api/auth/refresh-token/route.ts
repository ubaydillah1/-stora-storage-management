import { prisma } from "@/lib/prisma";
import {
  generateAccessToken,
  isValidToken,
  validateRequest,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { refreshToken } = body;

  const requiredFields = ["refreshToken"];
  const validationResult = validateRequest(body, requiredFields);

  if (!validationResult.isValid) {
    return NextResponse.json(
      {
        message: validationResult.message,
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { refreshToken },
  });

  if (!user || !user.refreshToken) {
    return NextResponse.json(
      { message: "Invalid or not found refresh token" },
      { status: 401 }
    );
  }

  try {
    const tokenValidationResult = await isValidToken({
      type: "REFRESH_TOKEN",
      token: refreshToken,
    });

    if (!tokenValidationResult.isValid) {
      let errorMessage = "Invalid or expired token";

      if (tokenValidationResult.error === "expired") {
        errorMessage = "Refresh token expired. Please log in again.";
      }

      return NextResponse.json({ message: errorMessage }, { status: 401 });
    }

    const accessToken = await generateAccessToken({
      userId: user.id,
    });

    return NextResponse.json({
      message: "Success",
      accessToken: accessToken,
    });
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
