import { screen, within } from "@testing-library/react";

import CreatePostPreview from "..";
import * as mocks from "./CreatePostPreview.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("Create Post - Preview", () => {
  const mockDispatch = vi.fn().mockName("dispatch");
  const mockHandleDraftPost = vi.fn().mockName("handleDraftPost");
  const mockHandleHideErrors = vi.fn().mockName("handleHideErrors");
  const mockHandleCreatePost = vi.fn().mockName("handleCreatePost");
  const mockSetIsOpen = vi.fn().mockName("setIsOpen");

  const UI = ({ isOpen, errors, shouldShow, postData }: mocks.Props) => (
    <CreatePostPreview
      isOpen={isOpen}
      setIsOpen={mockSetIsOpen}
      post={postData}
      draftStatus="idle"
      createStatus="idle"
      errors={errors}
      shouldShowErrors={shouldShow}
      handleHideErrors={mockHandleHideErrors}
      handleDraftPost={mockHandleDraftPost}
      handleCreatePost={mockHandleCreatePost}
      dispatch={mockDispatch}
    />
  );

  describe("Preview blog post", () => {
    it("Should render the provided post metadata and content", () => {
      renderUI(<UI {...mocks.previewProps} />, { writeQuery: mocks.writeTags });

      const aside = screen.getByRole("complementary");
      const info = within(aside).getByRole("list", mocks.postInfo);
      const tags = within(aside).getByRole("list", mocks.postTags);
      const article = screen.getByRole("article");

      expect(within(info).getAllByRole("listitem")[0]).toHaveTextContent(
        "Post Description"
      );

      expect(within(info).getAllByRole("listitem")[1]).toHaveTextContent(
        "Post Excerpt"
      );

      expect(within(tags).getAllByRole("listitem")[0]).toHaveTextContent(
        "Tag 1"
      );

      expect(within(tags).getAllByRole("listitem")[1]).toHaveTextContent(
        "Tag 2"
      );

      expect(within(tags).getAllByRole("listitem")[2]).toHaveTextContent(
        "Tag 4"
      );

      expect(within(tags).getAllByRole("listitem")[3]).toHaveTextContent(
        "Tag 5"
      );

      expect(within(article).getAllByRole("heading")[0]).toHaveTextContent(
        "Post Title"
      );

      expect(
        within(article).getByRole("img", mocks.postImg)
      ).toBeInTheDocument();

      expect(
        within(article).getByRole("region", mocks.postContent)
      ).toContainHTML(mocks.html);
    });
  });

  describe("API request responds with an input validation error", () => {
    it("Expect an alert errors list in the UI", async () => {
      const { user } = renderUI(<UI {...mocks.errorsProps} />);

      const alert = screen.getByRole("alert");
      const list = within(alert).getByRole("list", mocks.errors);

      expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
        "Post title error"
      );

      expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
        "Post description error"
      );

      expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
        "Post excerpt error"
      );

      expect(within(list).getAllByRole("listitem")[3]).toHaveTextContent(
        "Post content error"
      );

      expect(within(list).getAllByRole("listitem")[4]).toHaveTextContent(
        "Post tags error"
      );

      expect(within(list).getAllByRole("listitem")[5]).toHaveTextContent(
        "Post image banner error"
      );

      await user.click(within(alert).getByRole("button", mocks.hideErrors));

      expect(mockHandleHideErrors).toHaveBeenCalledOnce();
    });
  });

  describe("Draft post API request", () => {
    it("Expect a draft post API request when the 'Save as Draft' button is clicked", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getByRole("button", mocks.draftBtn));

      expect(mockHandleDraftPost).toHaveBeenCalledOnce();
    });

    it("Expect a draft post API request when the 'Save Post As Draft' menu item is clicked", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getByRole("button", mocks.previewMenu));
      await user.click(screen.getByRole("menuitem", mocks.menuDraft));

      expect(mockHandleDraftPost).toHaveBeenCalledOnce();
    });
  });

  describe("Create post API request", () => {
    it("Attempt to open the publish post dialog from the preview menu", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getByRole("button", mocks.previewMenu));
      await user.click(screen.getByRole("menuitem", mocks.publish));

      expect(mockSetIsOpen).toHaveBeenCalledOnce();
    });

    it("Attempt to open the publish post dialog box using the publish post preview button", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getByRole("button", mocks.create));

      expect(mockSetIsOpen).toHaveBeenCalledOnce();
    });

    it("Expect a create post API request when the 'Publish Post' button is clicked in the preview dialog", async () => {
      const { user } = renderUI(<UI {...mocks.apiProps} />);

      const dialog = screen.getByRole("dialog", mocks.dialog);

      await user.click(within(dialog).getByRole("button", mocks.pub));

      expect(mockHandleCreatePost).toHaveBeenCalledOnce();
    });
  });
});
