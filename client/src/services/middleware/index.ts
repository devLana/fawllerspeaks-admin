import { NextResponse } from "next/server";

export interface MiddlewareAuthCookies {
  authCookie: string | undefined;
  sigCookie: string | undefined;
  tokenCookie: string | undefined;
}

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
      /^\/posts\/(?:after|before|edit|view)\/[^/]+\/?$/i.test(pathname)
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
