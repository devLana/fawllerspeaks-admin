import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";
import useMediaQuery from "@mui/material/useMediaQuery";

import Layout from "..";
import {
  LOGOUT_SESSION_ID,
  avatar,
  errorsTable,
  logoutTable,
} from "../utils/Layout.mocks";
import { renderTestUI, stopRefreshTokenTimer } from "@utils/renderTestUI";
import { DEFAULT_THEME, SESSION_ID } from "@utils/constants";

describe("Protected Pages Layout", () => {
  const page = <div>Page Element UI</div>;
  const props = {
    clientHasRendered: true,
    errorMessage: null,
    title: "Page Title",
  };

  describe("Layout page ui", () => {
    it("Should render the Loader ui", () => {
      renderTestUI(
        <Layout
          clientHasRendered={false}
          errorMessage={null}
          title="Page Title"
        >
          {page}
        </Layout>
      );

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("Should render an Error ui", () => {
      renderTestUI(
        <Layout
          clientHasRendered={true}
          errorMessage="An error has occurred"
          title="Page Title"
        >
          {page}
        </Layout>
      );

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(
        "An error has occurred"
      );
    });

    it("Should render the Page ui", () => {
      renderTestUI(<Layout {...props}>{page}</Layout>);

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByText("Page Element UI")).toBeInTheDocument();
    });
  });

  describe("Layout header", () => {
    describe("Header theme button", () => {
      it("Click theme button to change app theme", async () => {
        const { user } = renderTestUI(<Layout {...props}>{page}</Layout>);

        const button = screen.getByRole("button", { name: "Change app theme" });

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
        renderTestUI(<Layout {...props}>{page}</Layout>);

        expect(
          screen.getByRole("img", { name: "Unknown user avatar" })
        ).toBeInTheDocument();
      });

      it("User information has an image link, Render an image avatar", () => {
        avatar(true);
        renderTestUI(<Layout {...props}>{page}</Layout>);

        expect(
          screen.getByRole("img", { name: "John Doe" })
        ).toBeInTheDocument();
      });

      it("User information does not have an image link, Display user initials", () => {
        avatar(false);
        renderTestUI(<Layout {...props}>{page}</Layout>);

        expect(screen.getByText("JD")).toBeInTheDocument();
      });
    });
  });

  describe("Layout navbar", () => {
    const mock = useMediaQuery as jest.MockedFunction<() => boolean>;
    mock.mockReturnValue(true);

    const btnName = { name: "Logout" };
    const cancelName = { name: "Cancel" };

    beforeEach(() => {
      localStorage.setItem(SESSION_ID, LOGOUT_SESSION_ID);
    });

    afterAll(() => {
      localStorage.removeItem(SESSION_ID);
    });

    describe("Navbar logout button", () => {
      it("Open and close the logout modal", async () => {
        const { user } = renderTestUI(<Layout {...props}>{page}</Layout>);

        await user.click(screen.getByRole("button", btnName));

        const modal = screen.getByRole("dialog");

        expect(modal).toBeInTheDocument();
        expect(within(modal).getByRole("button", btnName)).toBeInTheDocument();

        await user.click(within(modal).getByRole("button", { name: "Cancel" }));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      describe("Logout request receives an error/unsupported object response", () => {
        it.each(errorsTable)("%s", async (_, gql, message) => {
          const { user } = renderTestUI(
            <Layout {...props}>{page}</Layout>,
            gql
          );

          await user.click(screen.getByRole("button", btnName));

          const dialog = screen.getByRole("dialog");
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
            <Layout {...props}>{page}</Layout>,
            gql
          );

          await user.click(screen.getByRole("button", btnName));

          const dialog = screen.getByRole("dialog");
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
