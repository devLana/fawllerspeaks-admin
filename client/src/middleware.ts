import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth")?.value;
  const sigCookie = request.cookies.get("sig")?.value;
  const tokenCookie = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (authCookie && sigCookie && tokenCookie) {
    if (
      pathname === "/login" ||
      pathname === "/forgot-password" ||
      pathname === "/reset-password"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (
    pathname === "/" ||
    pathname === "/post-tags" ||
    pathname === "/register" ||
    /^\/settings\/?/.test(pathname) ||
    /^\/posts\/?/.test(pathname)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
