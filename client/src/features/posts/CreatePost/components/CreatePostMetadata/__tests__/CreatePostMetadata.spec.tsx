import { screen } from "@testing-library/react";
import type { Mock } from "vitest";

import CreatePostMetadata from "..";
import CreatePostFileInput from "../CreatePostFileInput";
import PostMetadataPostTagsInput from "@features/posts/components/PostMetadataPostTagsInput";
import { saveStoragePost } from "@utils/posts/storagePost";
import * as mocks from "./CreatePostMetadata.mocks";
import { renderUI } from "@utils/tests/renderUI";
import type { StoragePostData } from "types/posts/createPost";

type MockSaveStoragePost = Mock<[StoragePostData], undefined>;

vi.mock("@utils/posts/storagePost");

describe("Create Post - Metadata", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  const mockSaveStoragePost = saveStoragePost as MockSaveStoragePost;
  const mockDispatch = vi.fn().mockName("dispatch");
  const mockHandleDraftPost = vi.fn().mockName("handleDraftPost");

  const UI = (props: mocks.Props) => (
    <CreatePostMetadata
      title={props.title}
      description={props.description}
      excerpt={props.excerpt}
      contentError={props.contentError}
      draftStatus="idle"
      handleDraftPost={mockHandleDraftPost}
      dispatch={mockDispatch}
      fileInput={
        <CreatePostFileInput
          imageBanner={undefined}
          imageBannerError={props.imageBannerError}
          dispatch={mockDispatch}
        />
      }
      postTagsInput={
        <PostMetadataPostTagsInput
          tagIds={undefined}
          tagIdsError={props.tagIdsError}
          dispatchFn={mockDispatch}
        />
      }
    />
  );

  describe("Client side input validations", () => {
    describe("Text box input validations when the user tries to proceed to the content section", () => {
      it("No values entered in the text boxes, Expect the text boxes to have an error message", async () => {
        const { user } = renderUI(<UI {...mocks.props} />);

        await expect(
          screen.findByRole("combobox", mocks.postTags)
        ).resolves.toBeInTheDocument();

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

        await expect(
          screen.findByRole("combobox", mocks.postTags)
        ).resolves.toBeInTheDocument();

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
      });
    });

    describe("Text box input validations when the user tries to save a post as draft", () => {
      it("No value entered into the title input field, Expect the title input field to have an error message", async () => {
        const { user } = renderUI(<UI {...mocks.props} />);

        await expect(
          screen.findByRole("combobox", mocks.postTags)
        ).resolves.toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(
          screen.getByRole("textbox", mocks.title)
        ).toHaveAccessibleErrorMessage("Enter post title");

        expect(mockHandleDraftPost).not.toHaveBeenCalled();
      });

      it("Text box values exceed the maximum limit, Expect the text boxes to have an error message", async () => {
        const { user } = renderUI(<UI {...mocks.maxValuesProps} />);

        await expect(
          screen.findByRole("combobox", mocks.postTags)
        ).resolves.toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(
          screen.getByRole("textbox", mocks.title)
        ).toHaveAccessibleErrorMessage(mocks.titleMsg);

        expect(
          screen.getByRole("textbox", mocks.description)
        ).toHaveAccessibleErrorMessage(mocks.descriptionMsg);

        expect(
          screen.getByRole("textbox", mocks.excerpt)
        ).toHaveAccessibleErrorMessage(mocks.excerptMsg);

        expect(mockHandleDraftPost).not.toHaveBeenCalled();
      });
    });

    describe("Image file input validation", () => {
      it("A non-image file is selected, Expect the image input field to have an error message", async () => {
        const file = new File(["foo"], "foo.mp3", { type: "audio/mpeg" });
        const { user } = renderUI(<UI {...mocks.props} />);

        await expect(
          screen.findByRole("combobox", mocks.postTags)
        ).resolves.toBeInTheDocument();

        await user.upload(screen.getByLabelText(mocks.image), file);

        expect(screen.getByLabelText(mocks.image)).toHaveAccessibleErrorMessage(
          "You can only upload an image file"
        );

        expect(mockDispatch).not.toHaveBeenCalledOnce();
      });

      it("Should allow the user to be able to select an image for upload", async () => {
        const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
        const { user } = renderUI(<UI {...mocks.props} />);

        await expect(
          screen.findByRole("combobox", mocks.postTags)
        ).resolves.toBeInTheDocument();

        await user.upload(screen.getByLabelText(mocks.image), file);

        expect(
          screen.getByLabelText(mocks.image)
        ).not.toHaveAccessibleErrorMessage();

        expect(mockDispatch).toHaveBeenCalledOnce();
      });
    });
  });

  describe("Post tags input field rendering", () => {
    it("Should render the post tags combobox after fetching post tags data on mount", async () => {
      renderUI(<UI {...mocks.props} />);

      expect(
        screen.queryByRole("combobox", mocks.postTags)
      ).not.toBeInTheDocument();

      await expect(
        screen.findByRole("combobox", mocks.postTags)
      ).resolves.toBeInTheDocument();
    });

    it("When the post tags fetch fails or there are no created post tags, Expect a status message", async () => {
      mocks.getPostTagResolver();

      renderUI(<UI {...mocks.props} />);

      expect(
        screen.queryByRole("combobox", mocks.postTags)
      ).not.toBeInTheDocument();

      await expect(screen.findByRole("status")).resolves.toHaveTextContent(
        mocks.postTagsErrorMsg
      );

      expect(
        screen.queryByRole("combobox", mocks.postTags)
      ).not.toBeInTheDocument();

      mocks.server.resetHandlers();
    });
  });

  describe("Draft post API input validation error response", () => {
    it("The API responds with a 'contentError' or 'tagIdsError' or 'imageBannerError', Expect the applicable input fields to have an error message", async () => {
      renderUI(<UI {...mocks.errorsProps} />);

      await expect(
        screen.findByRole("combobox", mocks.postTags)
      ).resolves.toHaveAccessibleErrorMessage(mocks.tagsMsg);

      expect(screen.getByRole("alert")).toHaveTextContent(mocks.contentMsg);

      expect(screen.getByLabelText(mocks.image)).toHaveAccessibleErrorMessage(
        mocks.imageBannerMsg
      );
    });

    it("The API responds with a 'titleError' or 'descriptionError' or 'excerptError', Expect the applicable text boxes to have an error message", async () => {
      mockHandleDraftPost.mockImplementationOnce(mocks.callback);

      const { user } = renderUI(<UI {...mocks.textBoxProps} />);

      await expect(
        screen.findByRole("combobox", mocks.postTags)
      ).resolves.toBeInTheDocument();

      await user.click(screen.getByRole("button", mocks.draftBtn));

      await expect(
        screen.findByRole("textbox", mocks.title)
      ).resolves.toHaveAccessibleErrorMessage(mocks.titleMsg);

      expect(
        screen.getByRole("textbox", mocks.description)
      ).toHaveAccessibleErrorMessage(mocks.descriptionMsg);

      expect(
        screen.getByRole("textbox", mocks.excerpt)
      ).toHaveAccessibleErrorMessage(mocks.excerptMsg);

      expect(screen.getByRole("textbox", mocks.title)).toHaveFocus();
      expect(mockHandleDraftPost).toHaveBeenCalledOnce();
    });
  });

  describe("Create post section change", () => {
    it("User fills in the required metadata information, Expect the page to change to the content section", async () => {
      const { user } = renderUI(<UI {...mocks.textBoxProps} />);

      await expect(
        screen.findByRole("combobox", mocks.postTags)
      ).resolves.toBeInTheDocument();

      await user.click(screen.getByRole("button", mocks.next));

      expect(mockSaveStoragePost).toHaveBeenCalledOnce();
      expect(mockDispatch).toHaveBeenCalledOnce();
    });
  });
});
