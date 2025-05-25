import { screen, within } from "@testing-library/react";
import type { Mock } from "vitest";

import CreatePostMetadata from "..";
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
  const mockOnDraft = vi.fn().mockName("onDraft");
  const mockHandleHideErrors = vi.fn().mockName("handleHideErrors");

  const UI = (props: mocks.Props) => (
    <CreatePostMetadata
      postData={props.postData}
      draftStatus="idle"
      errors={props.errors}
      shouldShowErrors={props.shouldShow}
      handleHideErrors={mockHandleHideErrors}
      onDraft={mockOnDraft}
      dispatch={mockDispatch}
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

        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    describe("Text box input validations when the user tries to save a post as draft", () => {
      it("No values entered in the text boxes, Expect the text boxes to have an error message", async () => {
        const { user } = renderUI(<UI {...mocks.props} />);

        await expect(
          screen.findByRole("combobox", mocks.postTags)
        ).resolves.toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(
          screen.getByRole("textbox", mocks.title)
        ).toHaveAccessibleErrorMessage("Enter post title");

        expect(
          screen.getByRole("textbox", mocks.description)
        ).not.toHaveAccessibleErrorMessage();

        expect(
          screen.getByRole("textbox", mocks.excerpt)
        ).not.toHaveAccessibleErrorMessage();

        expect(mockOnDraft).not.toHaveBeenCalled();
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

        expect(mockOnDraft).not.toHaveBeenCalled();
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
      });

      it("Should allow the user to be able to select/unselect an image file for upload", async () => {
        const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
        const { user } = renderUI(<UI {...mocks.props} />);

        await expect(
          screen.findByRole("combobox", mocks.postTags)
        ).resolves.toBeInTheDocument();

        await user.upload(screen.getByLabelText(mocks.image), file);

        expect(screen.queryByLabelText(mocks.image)).not.toBeInTheDocument();

        expect(
          screen.getByLabelText(mocks.changeImg)
        ).not.toHaveAccessibleErrorMessage();

        expect(screen.getByRole("img", mocks.img)).toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.imageBtn));

        expect(screen.queryByRole("img", mocks.img)).not.toBeInTheDocument();
      });
    });
  });

  describe("Post tags input field", () => {
    it("Should render the post tags combobox after fetching post tags data on mount", async () => {
      renderUI(<UI {...mocks.props} />);

      expect(
        screen.queryByRole("combobox", mocks.postTags)
      ).not.toBeInTheDocument();

      await expect(
        screen.findByRole("combobox", mocks.postTags)
      ).resolves.toBeInTheDocument();
    });

    it("More than 5 post tags selected, Expect the post tags select box to have an error message", async () => {
      const { user } = renderUI(<UI {...mocks.props} />);

      await expect(
        screen.findByRole("combobox", mocks.postTags)
      ).resolves.toBeInTheDocument();

      await user.click(screen.getByRole("combobox", mocks.postTags));
      await user.click(screen.getByRole("option", mocks.tagName(0)));
      await user.click(screen.getByRole("option", mocks.tagName(1)));
      await user.click(screen.getByRole("option", mocks.tagName(2)));
      await user.click(screen.getByRole("option", mocks.tagName(3)));
      await user.click(screen.getByRole("option", mocks.tagName(4)));
      await user.click(screen.getByRole("option", mocks.tagName(5)));
      await user.keyboard("{Escape}");

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

  describe("API request gets an input validation error response", () => {
    it("Expect an alert errors list and input error messages to be displayed in the UI", async () => {
      const { user } = renderUI(
        <UI {...mocks.errorsProps} shouldShow={true} />
      );

      await expect(
        screen.findByRole("combobox", mocks.postTags)
      ).resolves.toHaveAccessibleErrorMessage(mocks.tagsMsg);

      expect(screen.getByRole("alert")).toHaveTextContent(mocks.contentMsg);

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

      await user.click(screen.getByRole("button", mocks.alertBtn));

      expect(mockHandleHideErrors).toHaveBeenCalledOnce();
    });
  });

  describe("Draft post API request", () => {
    it("Should be able to save a post as a draft", async () => {
      const { user } = renderUI(<UI {...mocks.textBoxProps} />);

      await expect(
        screen.findByRole("combobox", mocks.postTags)
      ).resolves.toBeInTheDocument();

      await user.click(screen.getByRole("button", mocks.draftBtn));

      expect(mockOnDraft).toHaveBeenCalledOnce();
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
