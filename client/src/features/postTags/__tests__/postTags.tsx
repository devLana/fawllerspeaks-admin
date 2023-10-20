import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";

import PostTags from "@pages/post-tags";
import { renderTestUI } from "@utils/renderTestUI";
import * as createMocks from "../utils/createPostTags.mocks";
import { getAlerts, getRedirect, getTags } from "../utils/getPostTags.mocks";

describe("Post Tags Page", () => {
  describe("Create post tags", () => {
    const createBtn = { name: /^create post tags$/i };
    const dialog = { name: /^create new post tags$/i };
    const cancelBtn = { name: /^cancel$/i };
    const textbox = { name: /^post tag$/i };
    const addMore = { name: /^add more$/i };
    const saveBtn = { name: /^Create tags$/i };

    describe("Create post tags client side input validation", () => {
      it("Input fields should have error messages if their values are empty", async () => {
        const { createPostTagsMock } = createMocks;
        const { user } = renderTestUI(<PostTags />, [createPostTagsMock]);

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);

        await user.click(within(modal).getByRole("button", addMore));
        await user.click(within(modal).getByRole("button", addMore));

        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(3);

        await user.click(within(modal).getByRole("button", saveBtn));

        expect(inputBoxes[0]).toHaveErrorMessage("Enter post tag");
        expect(inputBoxes[1]).toHaveErrorMessage("Enter post tag");
        expect(inputBoxes[2]).toHaveErrorMessage("Enter post tag");
      });
    });

    describe("Create post tags response should redirect the user to an authentication page", () => {
      it.each(createMocks.redirectTable)("%s", async (_, mock) => {
        const saveButton = { name: /^Create tag$/i };
        const { replace } = useRouter();
        const { user } = renderTestUI(<PostTags />, mock.gql());

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.type(inputBox, mock.tags[0]);
        await user.click(within(modal).getByRole("button", saveButton));

        expect(within(modal).getByRole("button", saveButton)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(mock.path);
        expect(within(modal).getByRole("button", saveButton)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
      });
    });

    describe("Create post tags response is an error, Display a notification alert", () => {
      it.each(createMocks.alertTable)("%s", async (_, mock) => {
        const { user } = renderTestUI(<PostTags />, mock.gql());

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);

        await user.click(within(modal).getByRole("button", addMore));

        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(2);

        await user.type(inputBoxes[0], mock.tags[0]);
        await user.type(inputBoxes[1], mock.tags[1]);
        await user.click(within(modal).getByRole("button", saveBtn));

        expect(within(modal).getByRole("button", saveBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();

        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(mock.message);
        expect(modal).toBeInTheDocument();
        expect(within(modal).getByRole("button", cancelBtn)).toBeEnabled();
        expect(within(modal).getByRole("button", saveBtn)).toBeEnabled();
      });
    });

    describe("New post tags are created", () => {
      it("All passed post tags are created, Display a notification alert", async () => {
        const { create } = createMocks;
        const { user } = renderTestUI(<PostTags />, create.gql());

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);

        await user.click(within(modal).getByRole("button", addMore));
        await user.click(within(modal).getByRole("button", addMore));

        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(3);

        await user.type(inputBoxes[0], create.tags[0]);
        await user.type(inputBoxes[1], create.tags[1]);
        await user.type(inputBoxes[2], create.tags[2]);
        await user.click(within(modal).getByRole("button", saveBtn));

        expect(within(modal).getByRole("button", saveBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();

        const alert = await screen.findAllByRole("alert");

        expect(alert[1]).toHaveTextContent("Post tags created");
        expect(screen.getByText(create.tags[0])).toBeInTheDocument();
        expect(screen.getByText(create.tags[1])).toBeInTheDocument();
        expect(screen.getByText(create.tags[2])).toBeInTheDocument();
        expect(modal).not.toBeInTheDocument();
      });

      it("Some of the passed post tags are created", async () => {
        const { warnCreate } = createMocks;
        const { user } = renderTestUI(<PostTags />, warnCreate.gql());

        await user.click(screen.getByRole("button", createBtn));

        const modal = screen.getByRole("dialog", dialog);

        await user.click(within(modal).getByRole("button", addMore));
        await user.click(within(modal).getByRole("button", addMore));
        await user.click(within(modal).getByRole("button", addMore));

        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(4);

        await user.type(inputBoxes[0], warnCreate.tags[0]);
        await user.type(inputBoxes[1], warnCreate.tags[1]);
        await user.type(inputBoxes[2], warnCreate.tags[2]);
        await user.type(inputBoxes[3], warnCreate.tags[3]);
        await user.click(within(modal).getByRole("button", saveBtn));

        expect(within(modal).getByRole("button", saveBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();

        const alert = await screen.findAllByRole("alert");

        expect(alert[1]).toHaveTextContent(createMocks.warnCreate.message);
        expect(screen.getByText(warnCreate.tags[0])).toBeInTheDocument();
        expect(screen.getByText(warnCreate.tags[3])).toBeInTheDocument();
        expect(modal).not.toBeInTheDocument();
      });
    });
  });

  describe("View/Get post tags", () => {
    describe("Get post tags response error should redirect the user to an authentication page", () => {
      it.each(getRedirect)("%s", async (_, mock) => {
        const { replace } = useRouter();

        renderTestUI(<PostTags />, mock.gql());

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(mock.path);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
      });
    });

    describe("Render a message", () => {
      it.each(getAlerts)("%s", async (_, mock) => {
        const { message } = mock;

        renderTestUI(<PostTags />, mock.gql());

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(await screen.findByRole("alert")).toHaveTextContent(message);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      });
    });

    describe("Get all post tags", () => {
      it("Should render a list of post tags", async () => {
        renderTestUI(<PostTags />, getTags.gql());

        expect(screen.getByRole("progressbar")).toBeInTheDocument();

        const list = await screen.findByRole("list");
        const listItem = within(list).getAllByRole("listitem");

        expect(listItem).toHaveLength(getTags.tags.length);
        expect(listItem[0]).toHaveTextContent(getTags.tags[0]);
        expect(listItem[1]).toHaveTextContent(getTags.tags[1]);
        expect(listItem[2]).toHaveTextContent(getTags.tags[2]);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      });
    });
  });

  /** describe("Edit a post tag", () => {});*/
  /** describe("Delete post tags", () => {});*/
});
