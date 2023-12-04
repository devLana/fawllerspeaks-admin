import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";

import RootLayout from "..";
import * as mocks from "../utils/Layout.mocks";
import { renderUI, stopRefreshTokenTimer } from "@utils/tests/renderUI";
import { DEFAULT_THEME, SESSION_ID } from "@utils/constants";

describe("Protected Pages Root Layout", () => {
  const page = <div>Page Element UI</div>;
  const { props } = mocks;

  describe("Root Layout page ui", () => {
    it("Should render the Loader ui", () => {
      renderUI(
        <RootLayout
          clientHasRendered={false}
          errorMessage={null}
          title="Page Title"
        >
          {page}
        </RootLayout>
      );

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("Should render an Error ui", () => {
      renderUI(
        <RootLayout
          clientHasRendered={true}
          errorMessage="An error has occurred"
          title="Page Title"
        >
          {page}
        </RootLayout>
      );

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(
        "An error has occurred"
      );
    });

    it("Should render the Page ui", () => {
      renderUI(<RootLayout {...props}>{page}</RootLayout>);

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByText("Page Element UI")).toBeInTheDocument();
    });
  });

  describe("Root Layout header", () => {
    describe("Header theme button", () => {
      it("Should change the global app theme when the theme button is clicked", async () => {
        const { user } = renderUI(<RootLayout {...props}>{page}</RootLayout>);

        const name = { name: /^change app theme$/i };
        const button = screen.getByRole("button", name);

        await user.click(button);

        expect(localStorage.getItem(DEFAULT_THEME)).toBe(
          mocks.storageTheme("sunset")
        );

        await user.click(button);

        expect(localStorage.getItem(DEFAULT_THEME)).toBe(
          mocks.storageTheme("pitch black")
        );

        await user.click(button);

        expect(localStorage.getItem(DEFAULT_THEME)).toBe(
          mocks.storageTheme("sunny")
        );

        localStorage.removeItem(DEFAULT_THEME);
      });
    });
  });

  describe("Logout api request", () => {
    const btnName = { name: /^logout$/i };
    const cancelBtnName = { name: /^cancel$/i };
    const dialogName = { name: /^logout of your account$/i };

    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
      localStorage.removeItem(SESSION_ID);
    });

    describe("Api response is an error or an unsupported object type", () => {
      it.each(mocks.errors)("%s", async (_, data) => {
        localStorage.setItem(SESSION_ID, data.sessionId);

        const { user } = renderUI(<RootLayout {...props}>{page}</RootLayout>);

        await user.click(screen.getByRole("button", btnName));

        const dialog = screen.getByRole("dialog", dialogName);
        const dialogLogoutBtn = within(dialog).getByRole("button", btnName);
        const cancelBtn = within(dialog).getByRole("button", cancelBtnName);

        await user.click(dialogLogoutBtn);

        expect(dialogLogoutBtn).toBeDisabled();
        expect(cancelBtn).toBeDisabled();

        await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
          data.message
        );

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    describe("The user is redirect to the login page", () => {
      it.each(mocks.logout)("%s", async (_, data, path) => {
        localStorage.setItem(SESSION_ID, data.sessionId);

        const { replace } = useRouter();
        const { user } = renderUI(<RootLayout {...props}>{page}</RootLayout>);

        await user.click(screen.getByRole("button", btnName));

        const dialog = screen.getByRole("dialog", dialogName);
        const dialogLogoutBtn = within(dialog).getByRole("button", btnName);
        const cancelBtn = within(dialog).getByRole("button", cancelBtnName);

        await user.click(dialogLogoutBtn);

        expect(dialogLogoutBtn).toBeDisabled();
        expect(cancelBtn).toBeDisabled();
        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(path);
        expect(stopRefreshTokenTimer).toHaveBeenCalledTimes(1);
      });
    });
  });
});
