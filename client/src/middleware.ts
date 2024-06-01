import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth")?.value;
  const sigCookie = request.cookies.get("sig")?.value;
  const tokenCookie = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (authCookie && sigCookie && tokenCookie) {
    if (/^\/(?:login|forgot-password|reset-password)/.test(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  const regex = /^\/(?:post-tags|register|settings\/?|posts\/?)/;

  if (pathname === "/" || regex.test(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
