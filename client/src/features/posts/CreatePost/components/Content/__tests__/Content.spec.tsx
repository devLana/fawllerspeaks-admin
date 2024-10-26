import { screen, within } from "@testing-library/react";

import CreatePostContent from "..";
import * as mocks from "./Content.mocks";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../CKEditorComponent");

describe("Create Post - Content", () => {
  const mockDispatch = vi.fn().mockName("dispatch");
  const mockHandleDraftPost = vi.fn().mockName("handleDraftPost");
  const mockHandleCloseDraftError = vi.fn().mockName("handleCloseDraftError");

  const UI = ({ content, draftErrors, draftStatus }: mocks.Props) => (
    <CreatePostContent
      content={content}
      draftStatus={draftStatus}
      draftErrors={draftErrors}
      handleDraftPost={mockHandleDraftPost}
      handleCloseDraftError={mockHandleCloseDraftError}
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

  describe("Draft post API input validation error response", () => {
    it("Expect error messages in the UI if the draft post request gets an input validation error response", async () => {
      const { user } = renderUI(<UI {...mocks.apiErrorsProps} />);

      expect(
        screen.getByRole("textbox", mocks.content)
      ).toHaveAccessibleErrorMessage(mocks.contentError);

      const alert = screen.getByRole("alert");
      const list = within(alert).getByRole("list", mocks.draftErrorsList);

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

      expect(mockHandleCloseDraftError).toHaveBeenCalledOnce();
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
