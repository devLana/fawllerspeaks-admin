import { screen, within } from "@testing-library/react";

import EditPostPreview from "..";
import * as mocks from "./EditPostPreview.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("Edit Post - Preview", () => {
  const mockDispatch = vi.fn().mockName("dispatch");
  const mockOnCloseEditError = vi.fn().mockName("onCloseEditError");
  const mockHandleEditPost = vi.fn().mockName("handleEditPost");
  const mockSetIsOpen = vi.fn().mockName("setIsOpen");

  const UI = (props: mocks.Props) => (
    <EditPostPreview
      isOpen={props.isOpen}
      post={props.postData}
      editApiStatus={props.editStatus}
      postStatus={props.postStatus}
      editErrors={props.errors}
      dispatch={mockDispatch}
      handleEditPost={mockHandleEditPost}
      onCloseEditError={mockOnCloseEditError}
      setIsOpen={mockSetIsOpen}
    />
  );

  describe("Preview blog post", () => {
    it("Should render the provided post metadata and content", () => {
      renderUI(<UI {...mocks.previewProps} />, { writeQuery: mocks.writeTags });

      expect(screen.getByLabelText(mocks.postStatus)).toHaveTextContent(
        "Published"
      );

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
        "Tag 2"
      );

      expect(within(tags).getAllByRole("listitem")[1]).toHaveTextContent(
        "Tag 3"
      );

      expect(within(tags).getAllByRole("listitem")[2]).toHaveTextContent(
        "Tag 6"
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

  describe("API request input validation errors", () => {
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

      expect(within(list).getAllByRole("listitem")[6]).toHaveTextContent(
        "Post id error"
      );

      expect(within(list).getAllByRole("listitem")[7]).toHaveTextContent(
        "Post status error"
      );

      await user.click(within(alert).getByRole("button", mocks.hideErrors));

      expect(mockOnCloseEditError).toHaveBeenCalledOnce();
    });
  });

  describe("Edit post Dialog", () => {
    it("Attempt to open the edit post dialog using the edit post icon button", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getAllByRole("button", mocks.editBtn)[0]);

      expect(mockSetIsOpen).toHaveBeenCalledOnce();
    });

    it("Attempt to open the edit post dialog using the edit post button", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getAllByRole("button", mocks.editBtn)[1]);

      expect(mockSetIsOpen).toHaveBeenCalledOnce();
    });
  });

  describe("Edit post API request", () => {
    it("Should edit a post without editing the post status", async () => {
      const { user } = renderUI(<UI {...mocks.apiProps} />);

      const dialog = screen.getByRole("dialog", mocks.dialog);

      expect(within(dialog).getByRole("paragraph")).toHaveTextContent(
        "Are you sure you want to edit this blog post?"
      );

      await user.click(within(dialog).getByRole("button", mocks.edit));

      expect(mockHandleEditPost).toHaveBeenCalledOnce();
    });

    it.each(mocks.dialogUI)("%s", async (_, props, mock) => {
      const { user } = renderUI(<UI {...props} />);

      const dialog = screen.getByRole("dialog", mocks.dialog);

      expect(within(dialog).getAllByRole("paragraph")).toHaveLength(3);

      expect(within(dialog).getAllByRole("paragraph")[0]).toHaveTextContent(
        mock.paragraph1
      );

      expect(within(dialog).getAllByRole("paragraph")[1]).toHaveTextContent(
        mock.paragraph2
      );

      expect(within(dialog).getAllByRole("paragraph")[2]).toHaveTextContent(
        "Are you sure you want to proceed?"
      );

      await user.click(within(dialog).getByRole("button", mock.buttonLabel));

      expect(mockHandleEditPost).toHaveBeenCalledOnce();
    });
  });
});
