import { screen, within } from "@testing-library/react";
import type { Mock } from "vitest";

import EditPostMetadata from "..";
import * as mocks from "./EditPostMetadata.mocks";
import {
  getEditStoragePost,
  saveEditStoragePost,
} from "@utils/posts/editStoragePost";
import { renderUI } from "@utils/tests/renderUI";
import type { EditStoragePostData } from "types/posts/editPost";

type MockGetStoragePost = Mock<[], EditStoragePostData | null>;
type MockSaveStoragePost = Mock<[Partial<EditStoragePostData>], undefined>;

vi.mock("@utils/posts/editStoragePost");

describe("Edit Post - Metadata", () => {
  const mockGetStoragePost = getEditStoragePost as MockGetStoragePost;
  const mockSaveStoragePost = saveEditStoragePost as MockSaveStoragePost;
  const mockDispatch = vi.fn().mockName("dispatch");
  const mockOnCloseEditError = vi.fn().mockName("onCloseEditError");

  const UI = (props: mocks.Props) => (
    <EditPostMetadata
      postId={mocks.storagePost.id}
      postSlug={mocks.storagePost.slug}
      storagePostIsNotLoaded={false}
      postData={props.postData}
      editErrors={props.errors}
      editStatus={props.editStatus}
      status={props.postStatus}
      postTagsData={mocks.postTagsData}
      onCloseEditError={mockOnCloseEditError}
      dispatch={mockDispatch}
    />
  );

  describe("Render the UI with the post details", () => {
    describe("Post title, description and excerpt", () => {
      it("Expect the text boxes to render with the post's details", () => {
        renderUI(<UI {...mocks.textBoxUIProps} />);

        expect(screen.getByRole("textbox", mocks.title)).toHaveDisplayValue(
          "Post Title"
        );

        expect(
          screen.getByRole("textbox", mocks.description)
        ).toHaveDisplayValue("Post Description");

        expect(screen.getByRole("textbox", mocks.excerpt)).toHaveDisplayValue(
          "Post Excerpt"
        );
      });
    });

    describe("Post Tags", () => {
      it("Expect the select input to render with the post's post tag selected", () => {
        renderUI(<UI {...mocks.selectUIProps} />, {
          writeQuery: mocks.writeTags,
        });

        const list = screen.getByRole("list", mocks.selectedPostTags);

        expect(within(list).getAllByRole("listitem")).toHaveLength(2);

        expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
          mocks.testTags[1]
        );

        expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
          mocks.testTags[4]
        );
      });
    });

    describe("Post image banner", () => {
      it("Should render an img element when the post has an image banner link", () => {
        renderUI(<UI {...mocks.imgUIProps} />);

        expect(screen.queryByLabelText(mocks.image)).not.toBeInTheDocument();
        expect(screen.getByRole("img", mocks.img)).toBeInTheDocument();
      });

      it("Should render a file input when the post does not have an image banner link", () => {
        renderUI(<UI {...mocks.props} />);

        expect(screen.getByLabelText(mocks.image)).toBeInTheDocument();
        expect(screen.queryByRole("img", mocks.img)).not.toBeInTheDocument();
      });
    });

    describe("Post status", () => {
      it("Expect the edit status checkbox to render in an unchecked state", () => {
        renderUI(<UI {...mocks.props} />);
        expect(screen.getByRole("checkbox", mocks.pub)).not.toBeChecked();
      });

      it("Expect the edit status checkbox to render in a checked state", () => {
        renderUI(<UI {...mocks.checked} />);
        expect(screen.getByRole("checkbox", mocks.pub)).toBeChecked();
      });

      it.each(mocks.postStatus)("%s", (_, props, mock) => {
        renderUI(<UI {...props} />);

        expect(screen.getByRole("paragraph")).toHaveTextContent(mock.text);
        expect(screen.getByRole("checkbox", mock.label)).toBeInTheDocument();
      });
    });
  });

  describe("Client side input validations", () => {
    describe("Textbox input validations", () => {
      it.each(mocks.updateStatus)("%s", async (_, props, label) => {
        const { user } = renderUI(<UI {...props} />);

        await user.click(screen.getByRole("checkbox", label));
        await user.click(screen.getByRole("button", mocks.next));

        expect(
          screen.getByRole("textbox", mocks.description)
        ).toHaveAccessibleErrorMessage("Enter post description");

        expect(
          screen.getByRole("textbox", mocks.excerpt)
        ).toHaveAccessibleErrorMessage("Enter post excerpt");

        expect(mockDispatch).not.toHaveBeenCalled();
      });

      it("Expect no error messages for the description and excerpt text boxes when no values are entered into them for a 'Draft' post", async () => {
        const { user } = renderUI(<UI {...mocks.draftProps} />);

        await user.click(screen.getByRole("button", mocks.next));

        expect(
          screen.getByRole("textbox", mocks.description)
        ).not.toHaveAccessibleErrorMessage();

        expect(
          screen.getByRole("textbox", mocks.excerpt)
        ).not.toHaveAccessibleErrorMessage();

        expect(mockDispatch).toHaveBeenCalledOnce();
      });

      it.each(mocks.validate)("%s", async (_, props) => {
        const { user } = renderUI(<UI {...props} />);

        await user.click(screen.getByRole("button", mocks.next));

        expect(
          screen.getByRole("textbox", mocks.title)
        ).toHaveAccessibleErrorMessage("Enter post title");

        expect(
          screen.getByRole("textbox", mocks.description)
        ).toHaveAccessibleErrorMessage("Enter post description");

        expect(
          screen.getByRole("textbox", mocks.excerpt)
        ).toHaveAccessibleErrorMessage("Enter post excerpt");

        expect(mockDispatch).not.toHaveBeenCalled();
      });

      it("Values provided to the text boxes exceed the allowed limit, Expect the text boxes to have an error message", async () => {
        const { user } = renderUI(<UI {...mocks.maxValuesProps} />);

        await user.click(screen.getByRole("button", mocks.next));

        expect(
          screen.getByRole("textbox", mocks.title)
        ).toHaveAccessibleErrorMessage(mocks.titleMsg);

        expect(
          screen.getByRole("textbox", mocks.description)
        ).toHaveAccessibleErrorMessage(mocks.descriptionMsg);

        expect(
          screen.getByRole("textbox", mocks.excerpt)
        ).toHaveAccessibleErrorMessage(mocks.excerptMsg);

        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    describe("Image file input validation", () => {
      it("A non-image file is selected, Expect the image input field to have an error message", async () => {
        const file = new File(["foo"], "foo.mp3", { type: "audio/mpeg" });
        const { user } = renderUI(<UI {...mocks.props} />);

        await user.upload(screen.getByLabelText(mocks.image), file);

        expect(screen.getByLabelText(mocks.image)).toHaveAccessibleErrorMessage(
          "You can only upload an image file"
        );
      });

      it("Should allow the user to be able to select/unselect an image file for upload", async () => {
        const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
        const { user } = renderUI(<UI {...mocks.props} />);

        await user.upload(screen.getByLabelText(mocks.image), file);

        expect(screen.queryByLabelText(mocks.image)).not.toBeInTheDocument();

        expect(
          screen.getByLabelText(mocks.changeImg)
        ).not.toHaveAccessibleErrorMessage();

        expect(screen.getByRole("img", mocks.img)).toBeInTheDocument();
        expect(screen.getByRole("img", mocks.img)).toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.imageBtn));

        expect(screen.queryByRole("img", mocks.img)).not.toBeInTheDocument();
      });
    });

    describe("Post tags select field validation", () => {
      it("More than 5 post tags selected, Expect the post tags select box to have an error message", async () => {
        const { user } = renderUI(<UI {...mocks.props} />, {
          writeQuery: mocks.writeTags,
        });

        await user.click(screen.getByRole("combobox", mocks.postTags));
        await user.click(screen.getByRole("option", mocks.tagName(0)));
        await user.click(screen.getByRole("option", mocks.tagName(1)));
        await user.click(screen.getByRole("option", mocks.tagName(2)));
        await user.click(screen.getByRole("option", mocks.tagName(3)));
        await user.click(screen.getByRole("option", mocks.tagName(4)));
        await user.click(screen.getByRole("option", mocks.tagName(5)));
        await user.keyboard("{Escape}");
        await user.click(screen.getByRole("button", mocks.next));

        expect(
          screen.queryByRole("combobox", mocks.postTags)
        ).toHaveAccessibleErrorMessage(mocks.tagsErrMsg);

        const list = screen.getByRole("list", mocks.selectedPostTags);

        expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
          mocks.testTags[0]
        );

        expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
          mocks.testTags[1]
        );

        expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
          mocks.testTags[2]
        );

        expect(within(list).getAllByRole("listitem")[3]).toHaveTextContent(
          mocks.testTags[3]
        );

        expect(within(list).getAllByRole("listitem")[4]).toHaveTextContent(
          mocks.testTags[4]
        );

        expect(within(list).getAllByRole("listitem")[5]).toHaveTextContent(
          mocks.testTags[5]
        );
      });
    });
  });

  describe("API request input validation errors", () => {
    it("Expect an alert errors list and input error messages to be displayed in the UI", async () => {
      const { user } = renderUI(<UI {...mocks.errorsProps} />);

      const alert = screen.getByRole("alert");
      const list = within(alert).getByRole("list", mocks.errors);

      expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
        mocks.contentMsg
      );

      expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
        mocks.postIdMsg
      );

      expect(
        screen.getByRole("textbox", mocks.title)
      ).toHaveAccessibleErrorMessage(mocks.titleMsg);

      expect(
        screen.getByRole("textbox", mocks.description)
      ).toHaveAccessibleErrorMessage(mocks.descriptionMsg);

      expect(
        screen.getByRole("textbox", mocks.excerpt)
      ).toHaveAccessibleErrorMessage(mocks.excerptMsg);

      expect(screen.getByLabelText(mocks.image)).toHaveAccessibleErrorMessage(
        mocks.imageBannerMsg
      );

      expect(
        screen.queryByRole("combobox", mocks.postTags)
      ).toHaveAccessibleErrorMessage(mocks.tagsMsg);

      expect(
        screen.queryByRole("checkbox", mocks.pub)
      ).toHaveAccessibleErrorMessage(mocks.editStatusMsg);

      await user.click(screen.getByRole("button", mocks.alertBtn));

      expect(mockOnCloseEditError).toHaveBeenCalledOnce();
    });
  });

  describe("Edit post section change", () => {
    it("User fills in the required metadata information, Expect the page to change to the content section", async () => {
      mockGetStoragePost.mockReturnValueOnce(mocks.storagePost);

      const { user } = renderUI(<UI {...mocks.textBoxProps} />);

      await user.click(screen.getByRole("button", mocks.next));

      expect(mockDispatch).toHaveBeenCalledOnce();
      expect(mockGetStoragePost).toHaveBeenCalledOnce();
      expect(mockSaveStoragePost).toHaveBeenCalledOnce();
    });
  });
});
