import { NextResponse } from "next/server";

export const middlewareService = (
  authCookie: string | undefined,
  pathname: string,
  requestUrl: string,
) => {
  if (authCookie) {
    /*
      redirect to the dashboard if the route is:
      /login OR /forgot-password OR /reset-password
    */
    if (/^\/(?:login|forgot-password|reset-password)/i.test(pathname)) {
      return NextResponse.redirect(new URL("/", requestUrl));
    }

    /*
      stay on the current route if the route is:
      /posts OR /posts/new OR /posts/after/<cursor> OR /posts/edit/<slug> OR /posts/view/<slug>
    */
    if (
      /^\/posts\/?$/i.test(pathname) ||
      /^\/posts\/new\/?$/i.test(pathname) ||
      /^\/posts\/(?:after|edit|view)\/[^/]+\/?$/i.test(pathname)
    ) {
      return NextResponse.next();
    }

    // redirect to the 404 route on any other /posts route besides the ones checked above
    if (/^\/posts/i.test(pathname)) {
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
