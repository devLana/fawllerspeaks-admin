import { useRouter } from "next/router";

import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import { http } from "msw";

import CreatePostPage from "@pages/posts/new";
import { saveCreateStoragePost } from "@utils/posts/createStoragePost";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./mocks/createPostDraftAPI.mocks";

vi.mock("@features/posts/components/CKEditorComponent");
vi.mock("@utils/posts/createStoragePost");

describe("Create Post", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Draft post API request", () => {
    describe("API responds with a user authentication error", () => {
      it.each(mocks.redirects)("%s", async (_, title, { pathname, url }) => {
        const router = useRouter();
        router.pathname = pathname;

        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.titleBox), title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(url);
        expect(saveCreateStoragePost).toHaveBeenCalledOnce();
        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
      });
    });

    describe("API response is an error or an unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, { title, message }) => {
        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.titleBox), title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
        expect(await screen.findByRole("alert")).toHaveTextContent(message);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeEnabled();
      });
    });

    describe("API responds with an input validation error", () => {
      it("Expect input validation UI error messages", async () => {
        const { title } = mocks.validate;
        const { user } = renderUI(<CreatePostPage />);

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.titleBox), title);
        await user.type(screen.getByRole("textbox", mocks.descBox), "abcd");
        await user.type(screen.getByRole("textbox", mocks.extBox), "abcdefgh");
        await user.click(screen.getByRole("button", mocks.metadataNext));

        await expect(
          screen.findByRole("button", mocks.contentNext)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.contBox), mocks.html);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeDisabled();

        const alert = await screen.findByRole("alert");
        const list = within(alert).getByRole("list", mocks.errors);

        expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
          mocks.titleMsg
        );

        expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
          mocks.descriptionMsg
        );

        expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
          mocks.excerptMsg
        );

        expect(within(list).getAllByRole("listitem")[3]).toHaveTextContent(
          mocks.tagsMsg
        );

        expect(within(list).getAllByRole("listitem")[4]).toHaveTextContent(
          mocks.imageBannerMsg
        );

        expect(
          screen.getByRole("textbox", mocks.contBox)
        ).toHaveAccessibleErrorMessage(mocks.contentMsg);

        await user.click(screen.getByRole("button", mocks.hideErrorsBtn));
        await waitForElementToBeRemoved(list);

        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.contentNext)).toBeEnabled();
      });
    });

    describe("Verify post title", () => {
      it.each(mocks.verifyTitle)("%s", async (_, { title, message }) => {
        const { user } = renderUI(<CreatePostPage />);
        const textbox = screen.getByRole("textbox", mocks.titleBox);

        await user.type(textbox, title);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();

        await waitFor(() => {
          expect(textbox).toHaveAccessibleErrorMessage(message);
        });

        expect(screen.getByRole("button", mocks.draftBtn)).toBeEnabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeEnabled();
      });
    });

    describe("Post drafted", () => {
      it.each(mocks.drafted)("%s", async (_, { resolver, mock, url }) => {
        mocks.server.use(http.post(/upload-image$/, resolver));

        const { user } = renderUI(<CreatePostPage />);
        const { push } = useRouter();

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(
          screen.getByRole("textbox", mocks.titleBox),
          mock.title
        );

        await user.upload(screen.getByLabelText(mocks.image), mocks.file);
        await user.click(screen.getByRole("button", mocks.draftBtn));

        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();

        await waitFor(() => expect(push).toHaveBeenCalledOnce());

        expect(push).toHaveBeenCalledWith(url);
        expect(screen.getByRole("button", mocks.draftBtn)).toBeDisabled();
        expect(screen.getByRole("button", mocks.metadataNext)).toBeDisabled();
      });
    });
  });
});
