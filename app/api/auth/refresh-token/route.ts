import { REFRESH_TOKEN_PRIVATE_KEY } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, validateRequest } from "@/lib/utils";
import jwt from "jsonwebtoken";
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
    await new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        REFRESH_TOKEN_PRIVATE_KEY,
        (err: Error | null) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        }
      );
    });

    const accessToken = await generateAccessToken({
      userId: user.id,
    });

    return NextResponse.json({
      message: "Success",
      accessToken: accessToken,
    });
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
};
