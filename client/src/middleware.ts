import { type NextRequest } from "next/server";
import { middlewareService } from "@services/middleware";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth")?.value;
  const sigCookie = request.cookies.get("sig")?.value;
  const tokenCookie = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  return middlewareService(
    { authCookie, sigCookie, tokenCookie },
    pathname,
    request.url
  );
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
