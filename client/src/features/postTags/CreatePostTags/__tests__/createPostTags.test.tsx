import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";
import { graphql } from "msw";

import PostTagsPage from "@pages/post-tags";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "../utils/createPostTags.mocks";

describe("Create post tags", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Client side form validation", () => {
    it("Input fields should have an error message if their values are empty", async () => {
      const { user } = renderUI(<PostTagsPage />);

      await user.click(screen.getByRole("button", mocks.createDialogBtn));

      const modal = screen.getByRole("dialog", mocks.dialog);

      await user.click(within(modal).getByRole("button", mocks.addMoreBtn));
      await user.click(within(modal).getByRole("button", mocks.addMoreBtn));

      const inputBoxes = within(modal).getAllByRole("textbox", mocks.textBox);
      expect(inputBoxes).toHaveLength(3);

      await user.click(within(modal).getByRole("button", mocks.saveBtn));

      expect(inputBoxes[0]).toHaveAccessibleErrorMessage("Enter post tag");
      expect(inputBoxes[1]).toHaveAccessibleErrorMessage("Enter post tag");
      expect(inputBoxes[2]).toHaveAccessibleErrorMessage("Enter post tag");
    });
  });

  describe("Create post tags api request", () => {
    describe("On user verification, Redirect the user to an authentication page", () => {
      it.each(mocks.redirects)("%s", async (_, path, mock) => {
        const saveButton = { name: /^Create tag$/i };
        const { user } = renderUI(<PostTagsPage />);
        const { replace } = useRouter();

        await user.click(screen.getByRole("button", mocks.createDialogBtn));

        const modal = screen.getByRole("dialog", mocks.dialog);
        const inputBox = within(modal).getByRole("textbox", mocks.textBox);

        await user.type(inputBox, mock.tags[0]);
        await user.click(within(modal).getByRole("button", saveButton));

        expect(within(modal).getByRole("button", saveButton)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();
        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(path);
        expect(within(modal).getByRole("button", saveButton)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();
      });
    });

    describe("Api response is an error or an unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, mock) => {
        const { user } = renderUI(<PostTagsPage />);

        await user.click(screen.getByRole("button", mocks.createDialogBtn));

        const modal = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(modal).getByRole("button", mocks.addMoreBtn));

        const inputBoxes = within(modal).getAllByRole("textbox", mocks.textBox);
        expect(inputBoxes).toHaveLength(2);

        await user.type(inputBoxes[0], mock.tags[0]);
        await user.type(inputBoxes[1], mock.tags[1]);
        await user.click(within(modal).getByRole("button", mocks.saveBtn));

        expect(within(modal).getByRole("button", mocks.saveBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();
        expect(await screen.findByRole("alert")).toHaveTextContent(mock.msg);
        expect(modal).toBeInTheDocument();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeEnabled();
        expect(within(modal).getByRole("button", mocks.saveBtn)).toBeEnabled();
      });
    });

    describe("New post tags are created", () => {
      afterEach(() => {
        mocks.server.resetHandlers();
      });

      it.each(mocks.creates)("%s", async (_, mock, resolver) => {
        const { user } = renderUI(<PostTagsPage />);

        await user.click(screen.getByRole("button", mocks.createDialogBtn));

        const modal = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(modal).getByRole("button", mocks.addMoreBtn));
        await user.click(within(modal).getByRole("button", mocks.addMoreBtn));

        const inputBoxes = within(modal).getAllByRole("textbox", mocks.textBox);
        expect(inputBoxes).toHaveLength(3);

        await user.type(inputBoxes[0], mock.tags[0]);
        await user.type(inputBoxes[1], mock.tags[1]);
        await user.type(inputBoxes[2], mock.tags[2]);
        await user.click(within(modal).getByRole("button", mocks.saveBtn));

        expect(within(modal).getByRole("button", mocks.saveBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();

        mocks.server.use(graphql.query("GetPostTags", resolver));

        expect(await screen.findByRole("alert")).toHaveTextContent(mock.msg);
        expect(screen.getByText(mock.tags[0])).toBeInTheDocument();
        expect(screen.getByText(mock.tags[1])).toBeInTheDocument();
        expect(screen.getByText(mock.tags[2])).toBeInTheDocument();
        expect(modal).not.toBeInTheDocument();
      });
    });
  });
});
