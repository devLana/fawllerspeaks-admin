import { NextResponse } from "next/server";
import { middlewareService, type MiddlewareAuthCookies } from ".";

describe("Middleware Service", () => {
  const url = "https://example-site.com";

  const validCookies: MiddlewareAuthCookies = {
    authCookie: "authCookie",
    sigCookie: "sigCookie",
    tokenCookie: "tokenCookie",
  };

  describe("Unauthenticated user request", () => {
    const inValidCookies1: MiddlewareAuthCookies = {
      authCookie: undefined,
      sigCookie: undefined,
      tokenCookie: undefined,
    };

    const inValidCookies2: MiddlewareAuthCookies = {
      authCookie: "authCookie",
      sigCookie: undefined,
      tokenCookie: "tokenCookie",
    };

    it("When the user requests for a protected page, Redirect to the login page", () => {
      middlewareService(inValidCookies1, "/", url);

      expect(NextResponse.redirect).toHaveBeenCalledOnce();

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        new URL("/login", url)
      );

      expect(NextResponse.next).not.toHaveBeenCalled();

      middlewareService(inValidCookies1, "/settings/me", url);

      expect(NextResponse.redirect).toHaveBeenCalledTimes(2);

      expect(NextResponse.redirect).toHaveBeenNthCalledWith(
        1,
        new URL("/login", url)
      );

      expect(NextResponse.redirect).toHaveBeenNthCalledWith(
        2,
        new URL("/login", url)
      );

      expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("When the user requests for a non-protected page, Allow the request", () => {
      middlewareService(inValidCookies2, "/non-protected-page", url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledOnce();
    });
  });

  describe("Authenticated user request", () => {
    it("When the user requests for a non-authentication page, Allow the request", () => {
      middlewareService(validCookies, "/404", url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledOnce();
    });

    it("When the user requests for an authentication page, Redirect to the dashboard page", () => {
      middlewareService(validCookies, "/login", url);

      expect(NextResponse.redirect).toHaveBeenCalledOnce();
      expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/", url));
      expect(NextResponse.next).not.toHaveBeenCalled();
    });
  });

  describe("Authenticated user request for 'posts' pages", () => {
    it("When the user makes a request to a supported posts page, Allow the request", () => {
      middlewareService(validCookies, "/posts/new", url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledOnce();

      middlewareService(validCookies, "/posts/new/", url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledTimes(2);

      middlewareService(validCookies, "/posts/edit/blog-post1-slug", url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledTimes(3);

      middlewareService(validCookies, "/posts/edit/blog-post-slug/", url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledTimes(4);

      middlewareService(validCookies, "/posts/view/blog-post-slug", url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledTimes(5);

      middlewareService(validCookies, "/posts/view/blog-post1-slug/", url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledTimes(6);
    });

    it.each([
      [
        "When the user requests for the posts index page, Allow the request",
        "/posts",
      ],
      [
        "When the user requests for a posts page with a supported pagination type and cursor, Allow the request",
        "/posts/before/djfy73tvby633246",
      ],
    ])("%s", (_, pathname) => {
      middlewareService(validCookies, `${pathname}`, url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledOnce();

      middlewareService(validCookies, `${pathname}/`, url);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledTimes(2);
    });

    it("When the user makes a request for a supported posts page but without a post id, Redirect to the not found page", () => {
      middlewareService(validCookies, "/posts/edit", url);

      expect(NextResponse.rewrite).toHaveBeenCalledOnce();
      expect(NextResponse.rewrite).toHaveBeenCalledWith(new URL("/404", url));
      expect(NextResponse.next).not.toHaveBeenCalled();

      middlewareService(validCookies, "/posts/view/", url);

      expect(NextResponse.rewrite).toHaveBeenCalledTimes(2);

      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        1,
        new URL("/404", url)
      );

      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        2,
        new URL("/404", url)
      );

      expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("When the user requests for the posts page with only the pagination type and no cursor, Redirect to the not found page", () => {
      middlewareService(validCookies, "/posts/before/", url);

      expect(NextResponse.rewrite).toHaveBeenCalledOnce();
      expect(NextResponse.rewrite).toHaveBeenCalledWith(new URL("/404", url));
      expect(NextResponse.next).not.toHaveBeenCalled();

      middlewareService(validCookies, "/posts/after", url);

      expect(NextResponse.rewrite).toHaveBeenCalledTimes(2);

      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        1,
        new URL("/404", url)
      );

      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        2,
        new URL("/404", url)
      );

      expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("When the user makes a request for an unsupported posts page, Redirect to the not found page", () => {
      middlewareService(validCookies, "/posts/blog-post", url);

      expect(NextResponse.rewrite).toHaveBeenCalledOnce();
      expect(NextResponse.rewrite).toHaveBeenCalledWith(new URL("/404", url));
      expect(NextResponse.next).not.toHaveBeenCalled();

      middlewareService(validCookies, "/posts/blog-post/", url);

      expect(NextResponse.rewrite).toHaveBeenCalledTimes(2);
      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        1,
        new URL("/404", url)
      );
      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        2,
        new URL("/404", url)
      );
      expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("When the user requests for the posts page with the wrong pagination type, Redirect to the not found page", () => {
      middlewareService(validCookies, "/posts/afters/cursor", url);

      expect(NextResponse.rewrite).toHaveBeenCalledOnce();
      expect(NextResponse.rewrite).toHaveBeenCalledWith(new URL("/404", url));
      expect(NextResponse.next).not.toHaveBeenCalled();

      middlewareService(validCookies, "/posts/not-before/cursor/", url);

      expect(NextResponse.rewrite).toHaveBeenCalledTimes(2);

      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        1,
        new URL("/404", url)
      );

      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        2,
        new URL("/404", url)
      );

      expect(NextResponse.next).not.toHaveBeenCalled();
    });

    it("When the user requests for the posts page with a pagination type and cursor and also with unsupported pathnames, Redirect to the not found page", () => {
      const pathname1 = "/posts/after/cursor/unsupported/path/names";

      middlewareService(validCookies, pathname1, url);

      expect(NextResponse.rewrite).toHaveBeenCalledOnce();
      expect(NextResponse.rewrite).toHaveBeenCalledWith(new URL("/404", url));
      expect(NextResponse.next).not.toHaveBeenCalled();

      const pathname2 = "/posts/after/cursor/unsupported/path/names/";

      middlewareService(validCookies, pathname2, url);

      expect(NextResponse.rewrite).toHaveBeenCalledTimes(2);

      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        1,
        new URL("/404", url)
      );

      expect(NextResponse.rewrite).toHaveBeenNthCalledWith(
        2,
        new URL("/404", url)
      );

      expect(NextResponse.next).not.toHaveBeenCalled();
    });
  });
});
