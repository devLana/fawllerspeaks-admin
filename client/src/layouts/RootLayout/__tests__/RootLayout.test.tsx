import { useRouter } from "next/router";

import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";

import RootLayout from "..";
import * as mocks from "./RootLayout.mocks";
import { protectedTestUI } from "@utils/tests/renderUI/protected";
import { testServer } from "@utils/tests/server";
import { handleClearRefreshTokenTimer } from "@utils/tests/sessionMocks";

describe("Protected Page Root Layout", () => {
  describe("Root Layout page UI", () => {
    it("Expect the Loading UI to be rendered", () => {
      protectedTestUI(
        <RootLayout isVerifying={true} errorMessage={null} title="Page Title">
          <div>Page Element UI</div>
        </RootLayout>,
      );

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
      expect(screen.getByLabelText(/^loading session$/i)).toBeInTheDocument();
    });

    it("Expect an ErrorAlert UI to be rendered", () => {
      protectedTestUI(
        <RootLayout
          isVerifying={false}
          errorMessage="An error has occurred"
          title="Page Title"
        >
          <div>Page Element UI</div>
        </RootLayout>,
      );

      expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();

      expect(
        screen.queryByLabelText(/^loading session$/i),
      ).not.toBeInTheDocument();

      expect(screen.getByRole("alert")).toHaveTextContent(
        "An error has occurred",
      );
    });

    it("Expect the passed Page UI to be rendered", () => {
      protectedTestUI(
        <RootLayout isVerifying={false} errorMessage={null} title="Page Title">
          <div>Page Element UI</div>
        </RootLayout>,
      );

      expect(
        screen.queryByLabelText(/^loading session$/i),
      ).not.toBeInTheDocument();

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByText("Page Element UI")).toBeInTheDocument();
    });
  });

  describe("Logout API request", () => {
    it.each(mocks.alerts)("%s", async (_, message, requestHandler) => {
      testServer.use(requestHandler);

      const { user } = protectedTestUI(
        <RootLayout isVerifying={false} errorMessage={null} title="Page Title">
          <div>Page Element UI</div>
        </RootLayout>,
      );

      await user.click(screen.getByRole("button", mocks.name));
      const modal = screen.getByRole("alertdialog", mocks.name);
      await user.click(within(modal).getByRole("button", mocks.name));

      await waitForElementToBeRemoved(modal);

      expect(screen.getByRole("alert")).toHaveTextContent(message);
    });

    it("Expect the user to be logged out and redirected to the login page", async () => {
      const { push } = useRouter();
      testServer.use(mocks.response);

      const { user } = protectedTestUI(
        <RootLayout isVerifying={false} errorMessage={null} title="Page Title">
          <div>Page Element UI</div>
        </RootLayout>,
      );

      await user.click(screen.getByRole("button", mocks.name));
      const modal = screen.getByRole("alertdialog", mocks.name);
      await user.click(within(modal).getByRole("button", mocks.name));

      await waitFor(() => {
        expect(push).toHaveBeenCalledExactlyOnceWith("/login");
      });

      expect(handleClearRefreshTokenTimer).toHaveBeenCalledOnce();
    });
  });
});
