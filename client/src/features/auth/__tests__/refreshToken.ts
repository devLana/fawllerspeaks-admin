import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import {
  newAccessToken,
  notAllowed,
  refresh,
  table,
} from "../utils/refreshToken.mocks";
import {
  handleAuthHeader,
  sessionTestRenderer,
} from "../utils/sessionTestRenderer";
import { SESSION_ID } from "@utils/constants";

jest.useFakeTimers();
jest.spyOn(window, "setTimeout").mockName("setTimeout");

describe("Refresh expired user access token", () => {
  afterAll(() => {
    localStorage.removeItem(SESSION_ID);
    jest.useRealTimers();
  });

  describe("Redirect to the login page", () => {
    it("User session could not be verified", async () => {
      const { replace } = useRouter();
      localStorage.setItem(SESSION_ID, notAllowed.sessionId);

      sessionTestRenderer(notAllowed.gql());

      await waitFor(() => expect(setTimeout).toHaveBeenCalled());
      await waitFor(() => expect(replace).toHaveBeenCalledTimes(2));
      expect(replace).toHaveBeenNthCalledWith(2, "/login?status=unauthorized");
    });
  });

  describe("Should show an alert message box", () => {
    it.each(table)("%s", async (_, expected) => {
      localStorage.setItem(SESSION_ID, expected.sessionId);

      sessionTestRenderer(expected.gql());

      await waitFor(() => expect(setTimeout).toHaveBeenCalled());
      await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
        "Your access token could not be refreshed"
      );
      expect(screen.getByRole("alert")).toContainElement(
        screen.getByRole("button", { name: /^reload page$/i })
      );
    });
  });

  describe("Refresh token request is successful", () => {
    it("Update application with refreshed access token", async () => {
      localStorage.setItem(SESSION_ID, refresh.sessionId);

      sessionTestRenderer(refresh.gql());

      await waitFor(() => expect(setTimeout).toHaveBeenCalled());
      await waitFor(() => expect(handleAuthHeader).toHaveBeenCalledTimes(2));
      expect(handleAuthHeader).toHaveBeenCalledWith(newAccessToken);
    });
  });
});
