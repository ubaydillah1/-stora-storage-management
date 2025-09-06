import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import * as jose from "jose";
import { ACCESS_TOKEN_PRIVATE_KEY, NODE_ENV } from "./lib/config";

export async function middleware(req: NextRequest) {
  console.log("Masuk");
  console.log(req.cookies.get("a"));
  const accessToken = req.cookies.get("a")?.value;
  const cookiesCsrfToken = req.cookies.get("csrfToken")?.value;
  console.log(cookiesCsrfToken);
  const csrfToken = req.headers.get("X-CSRF-Token");
  const currentPath = req.nextUrl.pathname;

  if (currentPath.startsWith("/api/dashboard")) {
    if (!accessToken || !csrfToken || !cookiesCsrfToken) {
      return NextResponse.json(
        { message: "Access token required" },
        { status: 401 }
      );
    }

    try {
      const secret = new TextEncoder().encode(ACCESS_TOKEN_PRIVATE_KEY);
      if (csrfToken !== cookiesCsrfToken) {
        return NextResponse.json(
          { message: "Access token required" },
          { status: 401 }
        );
      }

      const { payload } = await jose.jwtVerify(accessToken, secret);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", payload.userId as string);

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
  matcher: ["/api/dashboard/:path", "/"],
};
