import { screen, within } from "@testing-library/react";

import EditPostContent from "..";
import * as mocks from "./EditPostContent.mocks";
import { renderUI } from "@utils/tests/renderUI";

vi.mock("../EditPostContentEditor");

describe("Edit Post - Content", () => {
  const mockDispatch = vi.fn().mockName("dispatch");
  const mockOnCloseEditError = vi.fn().mockName("onCloseEditError");

  const UI = ({ content, editErrors, editStatus }: mocks.Props) => (
    <EditPostContent
      content={content}
      editStatus={editStatus}
      editErrors={editErrors}
      onCloseEditError={mockOnCloseEditError}
      dispatch={mockDispatch}
    />
  );

  describe("Post content editor validation when the user tries to proceed to the post preview section", () => {
    it("No post content provided, Expect the post content editor to have an error message", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await user.click(screen.getByRole("button", mocks.next));

      expect(
        screen.getByRole("textbox", mocks.content)
      ).toHaveAccessibleErrorMessage("Post content cannot be empty");

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe("API request input validation errors", () => {
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

      expect(within(list).getAllByRole("listitem")[5]).toHaveTextContent(
        mocks.idError
      );

      expect(within(list).getAllByRole("listitem")[6]).toHaveTextContent(
        mocks.editStatusError
      );

      await user.click(within(alert).getByRole("button", mocks.errorsBtn));

      expect(mockOnCloseEditError).toHaveBeenCalledOnce();
    });
  });

  describe("Edit post section change", () => {
    it("The post content has been edited, Expect the page to change to the preview section", async () => {
      const { user } = renderUI(<UI {...mocks.props} content={mocks.html} />);

      await user.click(screen.getByRole("button", mocks.next));

      expect(mockDispatch).toHaveBeenCalledOnce();
    });
  });
});
