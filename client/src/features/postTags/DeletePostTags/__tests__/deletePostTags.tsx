import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";
import { graphql } from "msw";

import PostTagsPage from "@pages/post-tags";
import * as mocks from "../utils/deletePostTags.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("Delete post tags", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    mocks.server.resetHandlers();
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Redirect the user to an authentication page", () => {
    const { deleteBtn1, deleteMenuItem, wrapper, name } = mocks;

    // Attempt the delete operation through each 'post tag menu'
    it.each(mocks.redirects)("%s", async (_, path, mock) => {
      const [tagName] = mock.tagNames;
      mocks.server.use(graphql.query("GetPostTags", mock.resolver));

      const { user } = renderUI(<PostTagsPage />);
      const { replace } = useRouter();

      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();

      expect(screen.getByLabelText(wrapper(tagName))).toBeInTheDocument();

      await user.hover(screen.getByLabelText(wrapper(tagName)));
      await user.click(screen.getByRole("button", name(tagName)));

      const tagMenu = screen.getByRole("menu", name(tagName));
      await user.click(within(tagMenu).getByRole("menuitem", deleteMenuItem));

      const modal = screen.getByRole("dialog", mocks.dialog1);
      await user.click(within(modal).getByRole("button", deleteBtn1));

      expect(within(modal).getByRole("button", deleteBtn1)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();
      await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
      expect(replace).toHaveBeenCalledWith(path);
      expect(within(modal).getByRole("button", deleteBtn1)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();
    });
  });

  describe("Api response is an error or an unsupported type", () => {
    const { selectAll, deleteBtn2, dialog2, wrapper, toolbarBtn } = mocks;

    // Attempt the delete operation by clicking the 'select all checkbox'
    it.each(mocks.alerts)("%s", async (_, mock) => {
      mocks.server.use(graphql.query("GetPostTags", mock.resolver));

      const tag = wrapper(mock.tagNames[0]);
      const { user } = renderUI(<PostTagsPage />);

      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();

      expect(screen.getByLabelText(tag)).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", selectAll));
      await user.click(screen.getByRole("button", toolbarBtn("all", "s")));

      const modal = screen.getByRole("dialog", dialog2);
      await user.click(within(modal).getByRole("button", deleteBtn2));

      expect(within(modal).getByRole("button", deleteBtn2)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();
      expect(await screen.findByRole("alert")).toHaveTextContent(mock.msg);
      expect(screen.getByLabelText(tag)).toBeInTheDocument();
      expect(modal).not.toBeInTheDocument();
    });

    // Attempt the delete operation by clicking each 'post tag checkbox'
    it("Should display an alert message toast if no post tags could be deleted", async () => {
      const { msg, tagNames: tags, resolver } = mocks.unknown;
      mocks.server.use(graphql.query("GetPostTags", resolver));

      const { user } = renderUI(<PostTagsPage />);

      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
      await user.click(screen.getByRole("checkbox", mocks.tagLabel(tags[0])));
      await user.click(screen.getByRole("checkbox", mocks.tagLabel(tags[1])));
      await user.click(screen.getByRole("button", toolbarBtn("all", "s")));

      const modal = screen.getByRole("dialog", dialog2);
      await user.click(within(modal).getByRole("button", deleteBtn2));

      expect(within(modal).getByRole("button", deleteBtn2)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      mocks.server.use(graphql.query("GetPostTags", mocks.unknownResolver));

      const alerts = await screen.findAllByRole("alert");

      expect(alerts[1]).toHaveTextContent(msg);
      expect(modal).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[0]))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[1]))).not.toBeInTheDocument();
    });

    // Attempt the delete operation by clicking the 'select all checkbox'
    it("Should display an alert message toast if the api responded with a validation error", async () => {
      const { msg, tagNames: tags, resolver } = mocks.validate;
      mocks.server.use(graphql.query("GetPostTags", resolver));

      const { user } = renderUI(<PostTagsPage />);

      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();

      expect(screen.getByLabelText(wrapper(tags[0]))).toBeInTheDocument();
      expect(screen.getByLabelText(wrapper(tags[1]))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", mocks.selectAll));
      await user.click(screen.getByRole("button", toolbarBtn("all", "s")));

      const modal = screen.getByRole("dialog", dialog2);
      await user.click(within(modal).getByRole("button", deleteBtn2));

      expect(within(modal).getByRole("button", deleteBtn2)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      mocks.server.use(graphql.query("GetPostTags", mocks.validateResolver));

      expect(await screen.findByRole("alert")).toHaveTextContent(msg);
      expect(modal).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[0]))).not.toBeInTheDocument();
      expect(screen.getByLabelText(wrapper(tags[1]))).toBeInTheDocument();
    });
  });

  describe("Post tags are deleted", () => {
    const { deleteBtn2, dialog2, wrapper, toolbarBtn } = mocks;

    // Attempt the delete operation by clicking each 'post tag checkbox'
    it("Should delete some of the selected post tags", async () => {
      const { msg, tagNames: tags, resolver } = mocks.warn;
      mocks.server.use(graphql.query("GetPostTags", resolver));

      const { user } = renderUI(<PostTagsPage />);

      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
      await user.click(screen.getByRole("checkbox", mocks.tagLabel(tags[0])));
      await user.click(screen.getByRole("checkbox", mocks.tagLabel(tags[1])));
      await user.click(screen.getByRole("checkbox", mocks.tagLabel(tags[2])));
      await user.click(screen.getByRole("button", toolbarBtn("all", "s")));

      const modal = screen.getByRole("dialog", dialog2);
      await user.click(within(modal).getByRole("button", deleteBtn2));

      expect(within(modal).getByRole("button", deleteBtn2)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      mocks.server.use(graphql.query("GetPostTags", mocks.warnResolver));

      expect(await screen.findByRole("alert")).toHaveTextContent(msg);
      expect(modal).not.toBeInTheDocument();
      expect(screen.getByLabelText(wrapper(tags[0]))).toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[1]))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[2]))).not.toBeInTheDocument();
    });

    // Attempt the delete operation by clicking the 'select all checkbox'
    it("Should delete all the selected post tags", async () => {
      const { msg, tagNames: tags, resolver } = mocks.del;
      mocks.server.use(graphql.query("GetPostTags", resolver));

      const { user } = renderUI(<PostTagsPage />);

      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();

      expect(screen.getByLabelText(wrapper(tags[0]))).toBeInTheDocument();
      expect(screen.getByLabelText(wrapper(tags[1]))).toBeInTheDocument();
      expect(screen.getByLabelText(wrapper(tags[2]))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", mocks.selectAll));
      await user.click(screen.getByRole("button", toolbarBtn("all", "s")));

      const modal = screen.getByRole("dialog", dialog2);
      await user.click(within(modal).getByRole("button", deleteBtn2));

      expect(within(modal).getByRole("button", deleteBtn2)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      const alerts = await screen.findAllByRole("alert");

      expect(alerts[0]).toHaveTextContent(mocks.deleteMsg);
      expect(alerts[1]).toHaveTextContent(msg);
      expect(modal).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[0]))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[1]))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[2]))).not.toBeInTheDocument();
    });
  });
});
