import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";
import { graphql } from "msw";

import PostTagsPage from "@pages/post-tags";
import * as mocks from "./deletePostTags.mocks";
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
    it.each(mocks.redirects)("%s", async (_, { pathname, url }, mock) => {
      const [tagName] = mock.tagNames;
      const router = useRouter();

      router.pathname = pathname;
      mocks.server.use(graphql.query("GetPostTags", mock.resolver));

      const { user } = renderUI(<PostTagsPage />);

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
      await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
      expect(router.replace).toHaveBeenCalledWith(url);
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

      await expect(screen.findByRole("alert")).resolves.toHaveTextContent(msg);
      await expect(screen.findByRole("status")).resolves.toBeInTheDocument();
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
    const { deleteBtn2, dialog2, wrapper, toolbarBtn, tagLabel } = mocks;

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
      const { msg, tagNames: tags, resolver } = mocks.allDel1;
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

      await expect(screen.findByRole("alert")).resolves.toHaveTextContent(msg);
      expect(modal).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[0]))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[1]))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[2]))).not.toBeInTheDocument();
    });

    // Attempt the delete operation by selecting each post tag checkbox individually
    it("Should delete some post tags from the list of post tags", async () => {
      const { msg, tagNames: tags, resolver } = mocks.allDel2;
      mocks.server.use(graphql.query("GetPostTags", resolver));
      const label = tagLabel;

      const { user } = renderUI(<PostTagsPage />);

      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
      expect(screen.getByRole("checkbox", label(tags[1]))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", label(tags[3]))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", label(tags[0])));
      await user.click(screen.getByRole("checkbox", label(tags[2])));
      await user.click(screen.getByRole("checkbox", label(tags[4])));
      await user.click(screen.getByRole("button", toolbarBtn("3", "s")));

      const modal = screen.getByRole("dialog", dialog2);
      await user.click(within(modal).getByRole("button", deleteBtn2));

      expect(within(modal).getByRole("button", deleteBtn2)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      await expect(screen.findByRole("alert")).resolves.toHaveTextContent(msg);
      expect(modal).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[0]))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[2]))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[4]))).not.toBeInTheDocument();
      expect(screen.getByRole("checkbox", label(tags[1]))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", label(tags[3]))).toBeInTheDocument();
    });

    // Attempt the delete operation by clicking a 'post tag menu'
    it("Should delete a post tag, remove it from the post tags list and preserve the selected post tags", async () => {
      const { msg, tagNames: tags, resolver } = mocks.someDel;
      const { deleteMenuItem, deleteBtn1 } = mocks;
      mocks.server.use(graphql.query("GetPostTags", resolver));

      const { user } = renderUI(<PostTagsPage />);

      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
      await user.click(screen.getByRole("checkbox", tagLabel(tags[1])));
      await user.click(screen.getByRole("checkbox", tagLabel(tags[2])));
      await user.click(screen.getByRole("checkbox", tagLabel(tags[3])));
      await user.hover(screen.getByLabelText(wrapper(tags[2])));
      await user.click(screen.getByRole("button", mocks.name(tags[2])));

      const tagMenu = screen.getByRole("menu", mocks.name(tags[2]));
      await user.click(within(tagMenu).getByRole("menuitem", deleteMenuItem));

      const modal = screen.getByRole("dialog", mocks.dialog1);
      await user.click(within(modal).getByRole("button", deleteBtn1));

      expect(within(modal).getByRole("button", deleteBtn1)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      await expect(screen.findByRole("alert")).resolves.toHaveTextContent(msg);
      expect(modal).not.toBeInTheDocument();
      expect(screen.queryByLabelText(wrapper(tags[2]))).not.toBeInTheDocument();
      expect(screen.getByRole("checkbox", tagLabel(tags[1]))).toBeChecked();
      expect(screen.getByRole("checkbox", tagLabel(tags[3]))).toBeChecked();
    });
  });
});
