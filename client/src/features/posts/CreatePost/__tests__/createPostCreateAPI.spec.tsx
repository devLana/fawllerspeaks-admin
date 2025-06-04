import { useRouter } from "next/router";

import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import { http } from "msw";

import CreatePostPage from "@pages/posts/new";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./mocks/createPostCreateAPI.mocks";

vi.mock("../components/CreatePostContent/CreatePostContentEditor");
vi.mock("@utils/posts/createStoragePost");

describe("Create Post", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Create post API request", () => {
    describe("API responds with a user authentication error", () => {
      it.each(mocks.redirects)("%s", async (_, title, { url, pathname }) => {
        const router = useRouter();
        router.pathname = pathname;

        const { user } = renderUI(<CreatePostPage />);

        await mocks.setup(user, title);
        await user.click(screen.getByRole("button", mocks.previewMenu));
        await user.click(screen.getByRole("menuitem", mocks.pubPost));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.pub));

        expect(within(dialog).getByRole("button", mocks.pub)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(url);
        expect(dialog).toBeInTheDocument();
        expect(within(dialog).getByRole("button", mocks.pub)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
      });
    });

    describe("API response is an error/unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, { title, message }) => {
        const { user } = renderUI(<CreatePostPage />);

        await mocks.setup(user, title);
        await user.click(screen.getByRole("button", mocks.pubPost));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.pub));

        expect(within(dialog).getByRole("button", mocks.pub)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        expect(screen.getByRole("alert")).toHaveTextContent(message);
      });
    });

    describe("Verify post title", () => {
      it.each(mocks.verifyTitle)("%s", async (_, { title, message }) => {
        const { user } = renderUI(<CreatePostPage />);

        await mocks.setup(user, title);
        await user.click(screen.getByRole("button", mocks.pubPost));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.pub));

        expect(within(dialog).getByRole("button", mocks.pub)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        const alert = screen.getByRole("alert");
        const list = within(alert).getByRole("list", mocks.errors);

        expect(within(list).getByRole("listitem")).toHaveTextContent(message);
      });
    });

    describe("API responds with an input validation error", () => {
      it("Expect an alert with a list of all relevant error messages", async () => {
        const { user } = renderUI(<CreatePostPage />);

        await mocks.setup(user, mocks.validate.title);
        await user.click(screen.getByRole("button", mocks.previewMenu));
        await user.click(screen.getByRole("menuitem", mocks.pubPost));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.pub));

        expect(within(dialog).getByRole("button", mocks.pub)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitForElementToBeRemoved(dialog);

        const alert = screen.getByRole("alert");
        const list = within(alert).getByRole("list", mocks.errors);

        expect(within(list).getAllByRole("listitem")[0]).toHaveTextContent(
          mocks.descriptionMsg
        );

        expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent(
          mocks.excerptMsg
        );

        expect(within(list).getAllByRole("listitem")[2]).toHaveTextContent(
          mocks.contentMsg
        );

        expect(within(list).getAllByRole("listitem")[3]).toHaveTextContent(
          mocks.tagsMsg
        );

        expect(within(list).getAllByRole("listitem")[4]).toHaveTextContent(
          mocks.imageBannerMsg
        );

        await user.click(screen.getByRole("button", mocks.hideErrorsBtn));
        await waitForElementToBeRemoved(alert);
      });
    });

    describe("Post created", () => {
      it.each(mocks.created)("%s", async (_, { resolver, mock, url }) => {
        mocks.server.use(http.post(/upload-image$/, resolver));

        const { title } = mock;
        const { user } = renderUI(<CreatePostPage />);
        const { push } = useRouter();

        await expect(
          screen.findByRole("combobox", mocks.postTag)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.titleBox), title);
        await user.type(screen.getByRole("textbox", mocks.descBox), "abcd");
        await user.type(screen.getByRole("textbox", mocks.extBox), "abcdefgh");
        await user.upload(screen.getByLabelText(mocks.image), mocks.file);
        await user.click(screen.getByRole("button", mocks.metadataNext));

        await expect(
          screen.findByRole("button", mocks.contentNext)
        ).resolves.toBeInTheDocument();

        await user.type(screen.getByRole("textbox", mocks.contBox), mocks.html);
        await user.click(screen.getByRole("button", mocks.contentNext));

        await expect(
          screen.findByRole("button", mocks.pubPost)
        ).resolves.toBeInTheDocument();

        await user.click(screen.getByRole("button", mocks.pubPost));

        const dialog = screen.getByRole("dialog", mocks.dialog);

        await user.click(within(dialog).getByRole("button", mocks.pub));

        expect(within(dialog).getByRole("button", mocks.pub)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitFor(() => expect(push).toHaveBeenCalledOnce());

        expect(push).toHaveBeenCalledWith(url);
        expect(dialog).toBeInTheDocument();
        expect(within(dialog).getByRole("button", mocks.pub)).toBeDisabled();
        expect(within(dialog).getByRole("button", mocks.cancel)).toBeDisabled();
      });
    });
  });
});
