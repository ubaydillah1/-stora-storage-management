import { TokenCheckingWithResult } from "@/lib/helpers";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("a")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decodedToken = TokenCheckingWithResult({
      token: accessToken,
      type: "ACCESS_TOKEN",
    });

    if (!decodedToken.isValid) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: decodedToken.user?.userId,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
