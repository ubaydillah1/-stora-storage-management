import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import * as jose from "jose";
import { ACCESS_TOKEN_PRIVATE_KEY } from "./lib/config";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("a")?.value;
  const cookiesCsrfToken = req.cookies.get("csrfToken")?.value;
  const csrfToken = req.headers.get("X-CSRF-Token");
  const currentPath = req.nextUrl.pathname;

  console.log("MASUK");

  if (currentPath.startsWith("/api/dashboard")) {
    if (!accessToken) {
      return NextResponse.json(
        { message: "Access token required" },
        { status: 401 }
      );
    }

    if (!cookiesCsrfToken) {
      return NextResponse.json(
        { message: "Cookies CSRF token required" },
        { status: 401 }
      );
    }

    if (!csrfToken) {
      return NextResponse.json(
        { message: "CSRF token required" },
        { status: 401 }
      );
    }

    try {
      const secret = new TextEncoder().encode(ACCESS_TOKEN_PRIVATE_KEY);
      if (csrfToken !== cookiesCsrfToken) {
        return NextResponse.json(
          { message: "Mismatch CSRF token" },
          { status: 401 }
        );
      }

      const { payload } = await jose.jwtVerify(accessToken, secret);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", payload.userId as string);

      console.log(payload);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/dashboard/:path*", "/"],
};
