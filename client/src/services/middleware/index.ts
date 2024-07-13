import { NextResponse } from "next/server";
import type { MiddlewareAuthCookies } from "@types";

export const middlewareService = (
  { authCookie, sigCookie, tokenCookie }: MiddlewareAuthCookies,
  pathname: string,
  requestUrl: string
) => {
  if (authCookie && sigCookie && tokenCookie) {
    if (/^\/(?:login|forgot-password|reset-password)/i.test(pathname)) {
      return NextResponse.redirect(new URL("/", requestUrl));
    }

    if (
      /^\/posts\/new\/?$/i.test(pathname) ||
      /^\/posts\/?$/i.test(pathname) ||
      /^\/posts\/(?:after|before|edit|view)\/[a-z0-9-]+\/?$/i.test(pathname)
    ) {
      return NextResponse.next();
    }

    if (/^\/posts(?:\/[^/]+)*\/?$/i.test(pathname)) {
      return NextResponse.rewrite(new URL("/404", requestUrl));
    }

    return NextResponse.next();
  }

  const regex = /^\/(?:post-tags|register|settings\/?|posts\/?)/i;

  if (pathname === "/" || regex.test(pathname)) {
    return NextResponse.redirect(new URL("/login", requestUrl));
  }

  return NextResponse.next();
};
