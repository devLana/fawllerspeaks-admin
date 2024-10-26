import { useRouter } from "next/router";

import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";

import CreatePostTags from "..";
import { PostTagsPageContext } from "@context/PostTags";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./createPostTags.mocks";

describe("Create post tags", () => {
  const mockFn = vi.fn().mockName("handleOpenAlert");

  const UI = (
    <PostTagsPageContext.Provider value={{ handleOpenAlert: mockFn }}>
      <CreatePostTags />
    </PostTagsPageContext.Provider>
  );

  describe("Client side form validation", () => {
    it("Input fields should have an error message if their values are empty", async () => {
      const { user } = renderUI(UI);

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

  describe("Create post tags API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("API response is a user authentication error", () => {
      it.each(mocks.redirects)("%s", async (_, { pathname, params }, mock) => {
        const saveButton = { name: /^Create tag$/i };
        const router = useRouter();
        const { user } = renderUI(UI);

        router.pathname = pathname;

        await user.click(screen.getByRole("button", mocks.createDialogBtn));

        const modal = screen.getByRole("dialog", mocks.dialog);
        const inputBox = within(modal).getByRole("textbox", mocks.textBox);

        await user.type(inputBox, mock.tags[0]);
        await user.click(within(modal).getByRole("button", saveButton));

        expect(within(modal).getByRole("button", saveButton)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(params);
        expect(within(modal).getByRole("button", saveButton)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();
      });
    });

    describe("API response is an error or an unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, mock) => {
        const { user } = renderUI(UI);

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
      it.each(mocks.creates)("%s", async (_, mock) => {
        const { user } = renderUI(UI);

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

        await waitForElementToBeRemoved(modal);

        expect(mockFn).toHaveBeenCalledOnce();
        expect(mockFn).toHaveBeenCalledWith(mock.msg);
      });
    });
  });
});
