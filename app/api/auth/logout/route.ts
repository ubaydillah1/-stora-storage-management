import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const DELETE = async () => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("a")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "User is already logged out" },
        { status: 200 }
      );
    }

    await prisma.user.update({
      where: {
        refreshToken: refreshToken,
      },
      data: {
        refreshToken: null,
      },
    });

    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Failed to logout" }, { status: 500 });
  }
};
