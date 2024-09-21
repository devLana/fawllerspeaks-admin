import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";
import { graphql } from "msw";

import PostTagsPage from "@pages/post-tags";
import * as mocks from "./editPostTag.mocks";
import { renderUI } from "@testUtils/renderUI";

describe("Edit a post tag", () => {
  const cancelBtn = { name: /^cancel$/i };
  const wrapper = new RegExp(`^${mocks.tagName} post tag container$`, "i");
  const name = { name: new RegExp(`^${mocks.tagName} post tag$`, "i") };
  const editMenuItem = { name: /^edit$/i };
  const dialog = { name: /^edit post tag - /i };
  const editBtn = { name: /^edit tag$/i };
  const textbox = { name: /^post tag$/i };

  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Client side form validation", () => {
    it("Input field should have an error message if the value is an empty string", async () => {
      const { user } = renderUI(<PostTagsPage />);

      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
      await user.hover(screen.getByLabelText(wrapper));
      await user.click(screen.getByRole("button", name));

      const tagMenu = screen.getByRole("menu", name);

      await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

      const modal = screen.getByRole("dialog", dialog);
      const inputBox = within(modal).getByRole("textbox", textbox);

      expect(inputBox).toHaveValue(mocks.tagName);

      await user.clear(inputBox);
      await user.click(within(modal).getByRole("button", editBtn));

      expect(inputBox).toHaveAccessibleErrorMessage("Enter new post tag name");
    });
  });

  describe("Edit post tag api request", () => {
    describe("Validate post tag name to edit", () => {
      it.each(mocks.validations)("%s", async (_, mock) => {
        const { user } = renderUI(<PostTagsPage />);

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);

        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.name);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();

        await waitFor(() => {
          expect(inputBox).toHaveAccessibleErrorMessage(mock.msg);
        });

        expect(within(modal).getByRole("button", editBtn)).toBeEnabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeEnabled();
      });
    });

    describe("Redirect the user to an authentication page", () => {
      it.each(mocks.redirects)("%s", async (_, { pathname, url }, mock) => {
        const router = useRouter();
        router.pathname = pathname;

        const { user } = renderUI(<PostTagsPage />);

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);

        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.name);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
        await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
        expect(router.replace).toHaveBeenCalledWith(url);
        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
      });
    });

    describe("Api response is an error or an unsupported type", () => {
      it.each(mocks.alerts)("%s", async (_, mock) => {
        const { user } = renderUI(<PostTagsPage />);

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);

        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.name);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(mock.msg);
        expect(within(modal).getByRole("button", editBtn)).toBeEnabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeEnabled();
      });
    });

    describe("Post tag is successfully edited", () => {
      afterEach(() => {
        mocks.server.resetHandlers();
      });

      const name1 = { name: new RegExp(`^${mocks.tagName}$`, "i") };
      const name2 = { name: new RegExp(`^${mocks.edit.name}$`, "i") };

      it("Should edit a post tag with the new post tag name", async () => {
        const { user } = renderUI(<PostTagsPage />);

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
        expect(screen.getByRole("checkbox", name1)).toBeInTheDocument();

        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);

        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mocks.edit.name);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();

        mocks.server.use(graphql.query("GetPostTags", mocks.resolver));

        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(mocks.edit.msg);
        expect(modal).not.toBeInTheDocument();
        expect(screen.queryByRole("checkbox", name1)).not.toBeInTheDocument();
        expect(screen.getByRole("checkbox", name2)).toBeInTheDocument();
      });

      it("Should update the name of a selected post tag after editing", async () => {
        const btnName = { name: /^delete all post tags$/i };
        const dialogName = { name: /^delete post tag$/i };
        const { user } = renderUI(<PostTagsPage />);

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
        await user.click(screen.getByRole("checkbox", name1));
        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);

        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mocks.edit.name);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();

        mocks.server.use(graphql.query("GetPostTags", mocks.resolver));

        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(mocks.edit.msg);
        expect(modal).not.toBeInTheDocument();
        expect(screen.queryByRole("checkbox", name1)).not.toBeInTheDocument();
        expect(screen.getByRole("checkbox", name2)).toBeInTheDocument();

        await user.click(screen.getByRole("button", btnName));

        const delModal = screen.getByRole("dialog", dialogName);

        expect(
          within(delModal).getByText(content => content === mocks.edit.name)
        ).toBeInTheDocument();
      });
    });
  });
});
