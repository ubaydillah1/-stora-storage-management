import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidToken } from "./lib/utils";

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("r")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { isValid, error } = await isValidToken({
    token: refreshToken,
    type: "REFRESH_TOKEN",
  });

  console.log(isValid, error);

  const protectedRoutes = ["/", "/others", "/documents", "images"];
  const publicRoutes = ["/login", "/register"];

  const currentPath = req.nextUrl.pathname;

  if (isValid && publicRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isValid && protectedRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|register|login).*)"],
};
