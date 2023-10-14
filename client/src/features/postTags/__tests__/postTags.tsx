import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";

import PostTags from "@pages/post-tags";
import {
  alertTable,
  create,
  redirectTable,
  warnCreate,
} from "../CreatePostTags/utils/createPostTags.mocks";
import { renderTestUI } from "@utils/renderTestUI";

describe("Post Tags Page", () => {
  describe("Create post tags", () => {
    const createBtn = { name: /^create post tags$/i };
    const dialog = { name: /^create new post tags$/i };
    const cancelBtn = { name: /^cancel$/i };
    const textbox = { name: /^post tag$/i };
    const addMore = { name: /^add more$/i };
    const saveBtn = { name: /^save tags$/i };

    describe("Create post tags dialog", () => {
      it("Show/hide create post tags dialog", async () => {
        const { user } = renderTestUI(<PostTags />);

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);
        const cancelButton = within(modal).getByRole("button", cancelBtn);

        await user.click(cancelButton);

        expect(screen.queryByRole("dialog", dialog)).not.toBeInTheDocument();
      });
    });

    describe("Create post tags client side input validation", () => {
      it("Input fields should have error messages if their values are empty", async () => {
        const { user } = renderTestUI(<PostTags />);

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);
        const addMoreBtn = within(modal).getByRole("button", addMore);

        await user.click(addMoreBtn);
        await user.click(addMoreBtn);

        const saveButton = within(modal).getByRole("button", saveBtn);
        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(3);

        await user.click(saveButton);

        expect(inputBoxes[0]).toHaveErrorMessage("Enter post tag");
        expect(inputBoxes[1]).toHaveErrorMessage("Enter post tag");
        expect(inputBoxes[2]).toHaveErrorMessage("Enter post tag");
      });
    });

    describe("Create post tags response should redirect the user to an authentication page", () => {
      it.each(redirectTable)("%s", async (_, mock) => {
        const { replace } = useRouter();
        const { user } = renderTestUI(<PostTags />, mock.gql());

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);
        const cancelButton = within(modal).getByRole("button", cancelBtn);
        const inputBox = within(modal).getByRole("textbox", textbox);
        const save = within(modal).getByRole("button", { name: /^save tag$/i });

        await user.type(inputBox, mock.tags[0]);
        await user.click(save);

        expect(save).toBeDisabled();
        expect(cancelButton).toBeDisabled();
        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(mock.path);
        expect(save).toBeDisabled();
        expect(cancelButton).toBeDisabled();
      });
    });

    describe("Create post tags response is an error, Display a notification alert", () => {
      it.each(alertTable)("%s", async (_, mock) => {
        const { user } = renderTestUI(<PostTags />, mock.gql());

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);
        const cancelButton = within(modal).getByRole("button", cancelBtn);
        const addMoreBtn = within(modal).getByRole("button", addMore);

        await user.click(addMoreBtn);

        const saveButton = within(modal).getByRole("button", saveBtn);
        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(2);

        await user.type(inputBoxes[0], mock.tags[0]);
        await user.type(inputBoxes[1], mock.tags[1]);
        await user.click(saveButton);

        expect(saveButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();

        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(mock.message);
        expect(modal).toBeInTheDocument();
        expect(cancelButton).toBeEnabled();
        expect(saveButton).toBeEnabled();
      });
    });

    describe("New post tags are created", () => {
      it("All passed post tags are created, Display a notification alert", async () => {
        const { user } = renderTestUI(<PostTags />, create.gql());

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);
        const cancelButton = within(modal).getByRole("button", cancelBtn);
        const addMoreBtn = within(modal).getByRole("button", addMore);

        await user.click(addMoreBtn);
        await user.click(addMoreBtn);

        const saveButton = within(modal).getByRole("button", saveBtn);
        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(3);

        await user.type(inputBoxes[0], create.tags[0]);
        await user.type(inputBoxes[1], create.tags[1]);
        await user.type(inputBoxes[2], create.tags[2]);
        await user.click(saveButton);

        expect(saveButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent("Post tags created");
        expect(modal).not.toBeInTheDocument();
      });

      it("Some of the passed post tags are created", async () => {
        const { user } = renderTestUI(<PostTags />, warnCreate.gql());

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);
        const cancelButton = within(modal).getByRole("button", cancelBtn);
        const addMoreBtn = within(modal).getByRole("button", addMore);

        await user.click(addMoreBtn);
        await user.click(addMoreBtn);
        await user.click(addMoreBtn);

        const saveButton = within(modal).getByRole("button", saveBtn);
        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(4);

        await user.type(inputBoxes[0], warnCreate.tags[0]);
        await user.type(inputBoxes[1], warnCreate.tags[1]);
        await user.type(inputBoxes[2], warnCreate.tags[2]);
        await user.type(inputBoxes[3], warnCreate.tags[3]);
        await user.click(saveButton);

        expect(saveButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent(warnCreate.message);
        expect(modal).not.toBeInTheDocument();
      });
    });
  });

  /** describe("View post tags", () => {}); */
  /** describe("Edit a post tag", () => {});*/
  /** describe("Delete post tags", () => {});*/
  /** describe("Search post tags", () => {});*/
});
