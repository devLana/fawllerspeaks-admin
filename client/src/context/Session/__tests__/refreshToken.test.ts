import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import * as mocks from "./mocks/refreshToken.mocks";
import { sessionTestRenderer } from "./utils/sessionTestRenderer";
import { SESSION_ID } from "@utils/constants";

describe("Refresh expired user access token", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    localStorage.removeItem(SESSION_ID);
    mocks.server.close();
  });

  describe("Refresh request failed with a user session error", () => {
    afterAll(() => {
      const router = useRouter();
      router.pathname = "/";
    });

    it.each(mocks.redirects)("%s", async (_, { url, pathname }, sessionId) => {
      const router = useRouter();
      router.pathname = pathname;

      localStorage.setItem(SESSION_ID, sessionId);
      sessionTestRenderer();

      await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

      expect(router.replace).toHaveBeenCalledWith(url);
    });
  });

  describe.each(mocks.alerts)("%s", (_, mock) => {
    it.each(mock)("%s", async (__, sessionId) => {
      localStorage.setItem(SESSION_ID, sessionId);

      sessionTestRenderer();

      await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
        "Your access token could not be refreshed"
      );

      expect(screen.getByRole("alert")).toContainElement(
        screen.getByRole("button", { name: /^reload page$/i })
      );
    });
  });
});
