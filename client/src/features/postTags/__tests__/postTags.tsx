import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";

import PostTags from "@pages/post-tags";
import { renderTestUI } from "@utils/renderTestUI";
import * as createMocks from "../utils/createPostTags.mocks";
import { getAlerts, getRedirect, getTags } from "../utils/getPostTags.mocks";
import * as editMocks from "../utils/editPostTag.mocks";

describe("Post Tags Page", () => {
  const cancelBtn = { name: /^cancel$/i };

  describe("Create post tags", () => {
    const createDialogBtn = { name: /^create post tags$/i };
    const dialog = { name: /^create new post tags$/i };
    const textbox = { name: /^post tag$/i };
    const addMoreBtn = { name: /^add more$/i };
    const createTagBtn = { name: /^Create tags$/i };

    describe("Create post tags client side input validation", () => {
      it("Input fields should have error messages if their values are empty", async () => {
        const { createPostTagsMock } = createMocks;
        const { user } = renderTestUI(<PostTags />, [createPostTagsMock]);

        await user.click(screen.getByRole("button", createDialogBtn));

        const modal = screen.getByRole("dialog", dialog);
        await user.click(within(modal).getByRole("button", addMoreBtn));
        await user.click(within(modal).getByRole("button", addMoreBtn));

        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(3);

        await user.click(within(modal).getByRole("button", createTagBtn));

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

        await user.click(screen.getByRole("button", createDialogBtn));

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

        await user.click(screen.getByRole("button", createDialogBtn));

        const modal = screen.getByRole("dialog", dialog);
        await user.click(within(modal).getByRole("button", addMoreBtn));

        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(2);

        await user.type(inputBoxes[0], mock.tags[0]);
        await user.type(inputBoxes[1], mock.tags[1]);
        await user.click(within(modal).getByRole("button", createTagBtn));

        expect(within(modal).getByRole("button", createTagBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(mock.message);
        expect(modal).toBeInTheDocument();
        expect(within(modal).getByRole("button", cancelBtn)).toBeEnabled();
        expect(within(modal).getByRole("button", createTagBtn)).toBeEnabled();
      });
    });

    describe("New post tags are created", () => {
      it("All passed post tags are created, Display a notification alert", async () => {
        const { create } = createMocks;
        const { user } = renderTestUI(<PostTags />, create.gql());

        await user.click(screen.getByRole("button", createDialogBtn));

        const modal = screen.getByRole("dialog", dialog);
        await user.click(within(modal).getByRole("button", addMoreBtn));
        await user.click(within(modal).getByRole("button", addMoreBtn));

        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(3);

        await user.type(inputBoxes[0], create.tags[0]);
        await user.type(inputBoxes[1], create.tags[1]);
        await user.type(inputBoxes[2], create.tags[2]);
        await user.click(within(modal).getByRole("button", createTagBtn));

        expect(within(modal).getByRole("button", createTagBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();

        await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
          "Post tags created"
        );
        expect(screen.getByText(create.tags[0])).toBeInTheDocument();
        expect(screen.getByText(create.tags[1])).toBeInTheDocument();
        expect(screen.getByText(create.tags[2])).toBeInTheDocument();
        expect(modal).not.toBeInTheDocument();
      });

      it("Some of the passed post tags are created", async () => {
        const { warnCreate } = createMocks;
        const { user } = renderTestUI(<PostTags />, warnCreate.gql());

        await user.click(screen.getByRole("button", createDialogBtn));

        const modal = screen.getByRole("dialog", dialog);
        await user.click(within(modal).getByRole("button", addMoreBtn));
        await user.click(within(modal).getByRole("button", addMoreBtn));
        await user.click(within(modal).getByRole("button", addMoreBtn));

        const inputBoxes = within(modal).getAllByRole("textbox", textbox);

        expect(inputBoxes).toHaveLength(4);

        await user.type(inputBoxes[0], warnCreate.tags[0]);
        await user.type(inputBoxes[1], warnCreate.tags[1]);
        await user.type(inputBoxes[2], warnCreate.tags[2]);
        await user.type(inputBoxes[3], warnCreate.tags[3]);
        await user.click(within(modal).getByRole("button", createTagBtn));

        expect(within(modal).getByRole("button", createTagBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();

        await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
          createMocks.warnCreate.message
        );
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

  describe("Edit a post tag", () => {
    const wrapper = new RegExp(`^${editMocks.tag} post tag container$`, "i");
    const name = { name: new RegExp(`^${editMocks.tag} post tag$`, "i") };
    const editMenuItem = { name: /^edit$/i };
    const dialog = { name: /^edit post tag$/i };
    const editBtn = { name: /^edit tag$/i };
    const textbox = { name: /^post tag$/i };

    describe("Form input client side validation", () => {
      it("Input box should have an error if value is empty", async () => {
        const { user } = renderTestUI(<PostTags />, editMocks.editMock.gql());

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();

        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);
        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(inputBox).toHaveErrorMessage("Enter new post tag name");
      });
    });

    describe("Edit post tag error object response should redirect the user to an authentication page", () => {
      it.each(editMocks.registerTable)("%s", async (_, mock) => {
        const { replace } = useRouter();
        const { user } = renderTestUI(<PostTags />, mock.gql());

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();

        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);
        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.tag);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
        await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
        expect(replace).toHaveBeenCalledWith(mock.path);
        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
      });
    });

    describe("Edit post tag response error should render an input box error", () => {
      it.each(editMocks.validationTable)("%s", async (_, mock) => {
        const { message } = mock;
        const { user } = renderTestUI(<PostTags />, mock.gql());

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();

        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);
        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.tag);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
        await waitFor(() => expect(inputBox).toHaveErrorMessage(message));
        expect(within(modal).getByRole("button", editBtn)).toBeEnabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeEnabled();
      });
    });

    describe("Edit post tag response renders a notification alert message", () => {
      it.each(editMocks.alertsTable)("%s", async (_, mock) => {
        const { user } = renderTestUI(<PostTags />, mock.gql());

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();

        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);
        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.tag);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(mock.message);
        expect(within(modal).getByRole("button", editBtn)).toBeEnabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeEnabled();
      });
    });

    describe("Edit post tag success response", () => {
      it("Should edit the post tag", async () => {
        const { user } = renderTestUI(<PostTags />, editMocks.edit.gql());

        await expect(screen.findByRole("list")).resolves.toBeInTheDocument();

        await user.hover(screen.getByLabelText(wrapper));
        await user.click(screen.getByRole("button", name));

        const tagMenu = screen.getByRole("menu", name);
        await user.click(within(tagMenu).getByRole("menuitem", editMenuItem));

        const modal = screen.getByRole("dialog", dialog);
        const inputBox = within(modal).getByRole("textbox", textbox);

        await user.clear(inputBox);
        await user.type(inputBox, editMocks.edit.tag);
        await user.click(within(modal).getByRole("button", editBtn));

        expect(within(modal).getByRole("button", editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", cancelBtn)).toBeDisabled();
        await expect(screen.findByRole("alert")).resolves.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent("Post tag edited");
        expect(modal).not.toBeInTheDocument();
        expect(screen.getByText(editMocks.edit.tag)).toBeInTheDocument();
      });
    });
  });

  /** describe("Delete post tags", () => {});*/
});
