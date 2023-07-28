import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";
import useMediaQuery from "@mui/material/useMediaQuery";

import RootLayout from "..";
import {
  LOGOUT_SESSION_ID,
  avatar,
  errorsTable,
  logoutTable,
} from "../utils/Layout.mocks";
import { renderTestUI, stopRefreshTokenTimer } from "@utils/renderTestUI";
import { DEFAULT_THEME, SESSION_ID } from "@utils/constants";

describe("Protected Pages Root Layout", () => {
  const page = <div>Page Element UI</div>;
  const props = {
    clientHasRendered: true,
    errorMessage: null,
    title: "Page Title",
  };

  describe("Root Layout page ui", () => {
    it("Should render the Loader ui", () => {
      renderTestUI(
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
      renderTestUI(
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
      renderTestUI(<RootLayout {...props}>{page}</RootLayout>);

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByText("Page Element UI")).toBeInTheDocument();
    });
  });

  describe("Root Layout header", () => {
    describe("Header theme button", () => {
      it("Click theme button to change app theme", async () => {
        const { user } = renderTestUI(
          <RootLayout {...props}>{page}</RootLayout>
        );

        const name = { name: /^change app theme$/i };
        const button = screen.getByRole("button", name);

        await user.click(button);
        expect(localStorage.getItem(DEFAULT_THEME)).toBe("sunset");

        await user.click(button);
        expect(localStorage.getItem(DEFAULT_THEME)).toBe("pitch black");

        await user.click(button);
        expect(localStorage.getItem(DEFAULT_THEME)).toBe("sunny");

        localStorage.removeItem(DEFAULT_THEME);
      });
    });

    describe("Header user avatar", () => {
      it("User information is not available, Render an icon avatar", () => {
        renderTestUI(<RootLayout {...props}>{page}</RootLayout>);

        expect(
          screen.getByRole("img", { name: /^unknown user avatar$/i })
        ).toBeInTheDocument();
      });

      it("User information has an image link, Render an image avatar", () => {
        avatar(true);
        renderTestUI(<RootLayout {...props}>{page}</RootLayout>);

        expect(
          screen.getByRole("img", { name: /^john doe avatar$/i })
        ).toBeInTheDocument();
      });

      it("User information does not have an image link, Display user initials", () => {
        avatar(false);
        renderTestUI(<RootLayout {...props}>{page}</RootLayout>);

        expect(screen.getByText("JD")).toBeInTheDocument();
      });
    });
  });

  describe("Root Layout navbar", () => {
    const mock = useMediaQuery as jest.MockedFunction<() => boolean>;
    mock.mockReturnValue(true);

    const btnName = { name: /^logout$/i };
    const cancelName = { name: /^cancel$/i };
    const dialogName = { name: /logout of your account/i };

    beforeEach(() => {
      localStorage.setItem(SESSION_ID, LOGOUT_SESSION_ID);
    });

    afterAll(() => {
      localStorage.removeItem(SESSION_ID);
    });

    describe("Navbar logout button", () => {
      it("Open and close the logout modal", async () => {
        const { user } = renderTestUI(
          <RootLayout {...props}>{page}</RootLayout>
        );

        await user.click(screen.getByRole("button", btnName));

        const modal = screen.getByRole("dialog", dialogName);

        expect(modal).toBeInTheDocument();
        expect(within(modal).getByRole("button", btnName)).toBeInTheDocument();

        await user.click(within(modal).getByRole("button", cancelName));

        expect(modal).not.toBeInTheDocument();
      });

      describe("Logout request receives an error/unsupported object response", () => {
        it.each(errorsTable)("%s", async (_, gql, message) => {
          const { user } = renderTestUI(
            <RootLayout {...props}>{page}</RootLayout>,
            gql
          );

          await user.click(screen.getByRole("button", btnName));

          const dialog = screen.getByRole("dialog", dialogName);
          const dialogLogout = within(dialog).getByRole("button", btnName);
          const cancelBtn = within(dialog).getByRole("button", cancelName);

          expect(dialog).toBeInTheDocument();

          await user.click(dialogLogout);

          expect(dialogLogout).toBeDisabled();
          expect(cancelBtn).toBeDisabled();

          expect(await screen.findByRole("alert")).toHaveTextContent(message);
          expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
      });

      describe("Send logout request, Redirect to the login page if user is not logged in", () => {
        it.each(logoutTable)("%s", async (_, gql, path) => {
          const { replace } = useRouter();
          const { user } = renderTestUI(
            <RootLayout {...props}>{page}</RootLayout>,
            gql
          );

          await user.click(screen.getByRole("button", btnName));

          const dialog = screen.getByRole("dialog", dialogName);
          const dialogLogout = within(dialog).getByRole("button", btnName);
          const cancelBtn = within(dialog).getByRole("button", cancelName);

          expect(dialog).toBeInTheDocument();

          await user.click(dialogLogout);

          expect(dialogLogout).toBeDisabled();
          expect(cancelBtn).toBeDisabled();

          await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
          expect(replace).toHaveBeenCalledWith(path);
          expect(stopRefreshTokenTimer).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
