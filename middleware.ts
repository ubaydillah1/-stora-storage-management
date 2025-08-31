import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { REFRESH_TOKEN_PRIVATE_KEY } from "./lib/config";

export async function middleware(req: NextRequest) {
  console.log("Terpanggil");
  const refreshToken = req.cookies.get("r")?.value;
  const currentPath = req.nextUrl.pathname;

  const protectedRoutes = ["/", "/others", "/documents", "/images"];
  const publicRoutes = ["/login", "/register"];

  if (!refreshToken) {
    if (protectedRoutes.some((path) => currentPath.startsWith(path))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  let isValid = false;

  try {
    const secret = new TextEncoder().encode(REFRESH_TOKEN_PRIVATE_KEY);
    await jwtVerify(refreshToken, secret);
    isValid = true;
  } catch {
    isValid = false;
  }

  if (isValid && publicRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    !isValid &&
    protectedRoutes.some((path) => currentPath.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/images", "/others", "/documents", "/media"],
};
