import { screen, within } from "@testing-library/react";

import CreatePostContent from "..";
import * as mocks from "./CreatePostContent.mocks";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("@features/posts/components/CKEditorComponent");
vi.mock("@utils/posts/createStoragePost");

describe("Create Post - Content", () => {
  const mockDispatch = vi.fn().mockName("dispatch");
  const mockHandleDraftPost = vi.fn().mockName("handleDraftPost");
  const mockHandleHideErrors = vi.fn().mockName("handleHideErrors");

  const UI = ({ content, errors, draftStatus, shouldShow }: mocks.Props) => (
    <CreatePostContent
      content={content}
      draftStatus={draftStatus}
      errors={errors}
      shouldShowErrors={shouldShow}
      handleHideErrors={mockHandleHideErrors}
      handleDraftPost={mockHandleDraftPost}
      dispatch={mockDispatch}
    />
  );

  describe("Post content editor validation when the user tries to proceed to the post preview section", () => {
    it("No post content provided, Expect the post content editor to have an error message", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getByRole("button", mocks.next));

      expect(
        screen.getByRole("textbox", mocks.content)
      ).toHaveAccessibleErrorMessage("Enter post content");

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe("Draft post API request", () => {
    it("The user should be able to make a draft post request", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getByRole("button", mocks.draftBtn));

      expect(mockHandleDraftPost).toHaveBeenCalledOnce();
    });
  });

  describe("API request responds with input validation errors", () => {
    it("Expect an alert errors list and an input error message to be displayed in the UI", async () => {
      const { user } = renderUI(<UI {...mocks.apiErrorsProps} />);

      expect(
        screen.getByRole("textbox", mocks.content)
      ).toHaveAccessibleErrorMessage(mocks.contentError);

      const alert = screen.getByRole("alert");
      const list = within(alert).getByRole("list", mocks.errors);

      expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
        mocks.titleError
      );

      expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
        mocks.descriptionError
      );

      expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
        mocks.excerptError
      );

      expect(within(list).getAllByRole("listitem")[3]).toHaveTextContent(
        mocks.tagIdsError
      );

      expect(within(list).getAllByRole("listitem")[4]).toHaveTextContent(
        mocks.imageBannerError
      );

      await user.click(within(alert).getByRole("button", mocks.errorsBtn));

      expect(mockHandleHideErrors).toHaveBeenCalledOnce();
    });
  });

  describe("Create post section change", () => {
    it("The user fills in the post content, Expect the page to change to the preview section", async () => {
      const { user } = renderUI(<UI {...mocks.props} content={mocks.html} />);

      await user.click(screen.getByRole("button", mocks.next));

      expect(mockDispatch).toHaveBeenCalledOnce();
    });
  });
});
