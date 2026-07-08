import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import * as mocks from "./mocks/refreshToken.mocks";
import { sessionTestRenderer } from "./utils/sessionTestRenderer";
import { testServer } from "@utils/tests/server";

describe("Refresh expired user access token", () => {
  describe("Refresh token error", () => {
    afterEach(() => {
      const router = useRouter();
      router.pathname = "/";
    });

    it.each(mocks.redirects)("%s", async (_, { pathname, handler, status }) => {
      const router = useRouter();

      router.pathname = pathname;
      testServer.use(handler, mocks.verified);

      sessionTestRenderer();

      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledExactlyOnceWith({
          pathname: "/login",
          query: { status, redirectTo: pathname },
        });
      });
    });
  });

  describe.each(mocks.alerts)("%s", (_, mock) => {
    it.each(mock)("%s", async (__, requestHandler) => {
      testServer.use(requestHandler, mocks.verified);

      sessionTestRenderer();

      await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
        "Your access token could not be refreshed",
      );

      expect(screen.getByRole("alert")).toContainElement(
        screen.getByRole("button", { name: /^reload page$/i }),
      );
    });
  });
});
