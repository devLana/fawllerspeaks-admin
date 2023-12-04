import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import * as mocks from "../utils/refreshToken.mocks";
import { sessionTestRenderer } from "../utils/sessionTestRenderer";
import { SESSION_ID } from "@utils/constants";

jest.useFakeTimers({ legacyFakeTimers: true });
jest.spyOn(window, "setTimeout").mockName("setTimeout");

describe("Refresh expired user access token", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    localStorage.removeItem(SESSION_ID);
    mocks.server.close();
  });

  describe("Refresh request failed with a user session error", () => {
    it.each(mocks.redirectTable)("%s", async (_, status, sessionId) => {
      const { replace } = useRouter();

      localStorage.setItem(SESSION_ID, sessionId);
      sessionTestRenderer();
      jest.runAllTimers();

      await waitFor(() => expect(window.setTimeout).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
      expect(replace).toHaveBeenCalledWith(`/login?status=${status}`);
    });
  });

  describe("Refresh request got an error or an unsupported object type response", () => {
    it.each(mocks.table)("%s", async (_, sessionId) => {
      localStorage.setItem(SESSION_ID, sessionId);

      sessionTestRenderer();
      jest.runAllTimers();

      await waitFor(() => expect(window.setTimeout).toHaveBeenCalledTimes(1));

      const alert = await screen.findByRole("alert");
      const msg = "Your access token could not be refreshed";
      const btnName = { name: /^reload page$/i };

      expect(alert).toHaveTextContent(msg);
      expect(alert).toContainElement(screen.getByRole("button", btnName));
    });
  });

  describe("Access token is successfully refreshed", () => {
    it("Update application with refreshed access token", async () => {
      localStorage.setItem(SESSION_ID, mocks.refresh);

      sessionTestRenderer();
      jest.runAllTimers();

      await waitFor(() => expect(window.setTimeout).toHaveBeenCalledTimes(1));
    });
  });
});
