import { useRouter } from "next/router";

import { screen, waitFor } from "@testing-library/react";

import {
  LOGGED_IN_SESSION_ID,
  refresh,
  table1,
  table2,
} from "../utils/refreshToken.mocks";
import { mockFn, sessionTestRenderer } from "../utils/sessionTestRenderer";
import { SESSION_ID } from "@utils/constants";

jest.useFakeTimers();
jest.spyOn(window, "setTimeout").mockName("setTimeout");

describe("Refresh expired user access token", () => {
  beforeEach(() => {
    localStorage.setItem(SESSION_ID, LOGGED_IN_SESSION_ID);
  });

  afterAll(() => {
    localStorage.removeItem(SESSION_ID);
    jest.useRealTimers();
  });

  describe("Redirect to the login page", () => {
    it.each(table1)("%s", async (_, mock, status) => {
      const { replace } = useRouter();

      sessionTestRenderer(mock);

      await waitFor(() => expect(setTimeout).toHaveBeenCalled());
      await waitFor(() => expect(replace).toHaveBeenCalledTimes(2));
      expect(replace).toHaveBeenCalledWith(`/login?status=${status}`);
    });
  });

  describe("Render an error alert UI", () => {
    it.each(table2)("%s", async (_, expected) => {
      sessionTestRenderer(expected.gql());

      await waitFor(() => expect(setTimeout).toHaveBeenCalled());
      await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(expected.message);
    });
  });

  describe("Refresh token request is successful", () => {
    it("Update application with refreshed access token", async () => {
      sessionTestRenderer(refresh.gql());

      await waitFor(() => expect(setTimeout).toHaveBeenCalled());
      await waitFor(() => expect(mockFn).toHaveBeenCalledTimes(2));
      expect(mockFn).toHaveBeenCalledWith("new_accessToken");
    });
  });
});
