import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";

import EditPostTag from "..";
import { PostTagsPageContext } from "@context/PostTags";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./editPostTag.mocks";

describe("Edit a post tag", () => {
  const dispatchMock = vi.fn().mockName("dispatch");
  const mockFn = vi.fn().mockName("handleOpenAlert");

  const UI = ({ id, name }: { id: string; name: string }) => (
    <PostTagsPageContext.Provider value={{ handleOpenAlert: mockFn }}>
      <EditPostTag open dispatch={dispatchMock} id={id} name={name} />
    </PostTagsPageContext.Provider>
  );

  describe("Client side form validation", () => {
    it("Input field should have an error message if the value is an empty string", async () => {
      const { user } = renderUI(<UI id="post-tag-id" name="test post tag" />);

      const modal = screen.getByRole("dialog", mocks.dialog("test post tag"));
      const inputBox = within(modal).getByRole("textbox", mocks.textbox);

      expect(inputBox).toHaveDisplayValue("test post tag");

      await user.clear(inputBox);
      await user.click(within(modal).getByRole("button", mocks.editBtn));

      expect(inputBox).toHaveAccessibleErrorMessage("Enter new post tag name");
    });
  });

  describe("Edit post tag API request", () => {
    beforeAll(() => {
      mocks.server.listen({ onUnhandledRequest: "error" });
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("Validate post tag name", () => {
      it.each(mocks.validations)("%s", async (_, mock) => {
        const { user } = renderUI(<UI id={mock.id} name={mock.name} />);

        const modal = screen.getByRole("dialog", mocks.dialog(mock.name));
        const inputBox = within(modal).getByRole("textbox", mocks.textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.name);
        await user.click(within(modal).getByRole("button", mocks.editBtn));

        expect(within(modal).getByRole("button", mocks.editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitFor(() => {
          expect(inputBox).toHaveAccessibleErrorMessage(mock.msg);
        });

        expect(within(modal).getByRole("button", mocks.editBtn)).toBeEnabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeEnabled();
      });
    });

    describe("API responds with a user authentication error", () => {
      it.each(mocks.redirects)("%s", async (_, { pathname, params }, mock) => {
        const router = useRouter();
        router.pathname = pathname;

        const { user } = renderUI(<UI id={mock.id} name={mock.name} />);

        const modal = screen.getByRole("dialog", mocks.dialog(mock.name));
        const inputBox = within(modal).getByRole("textbox", mocks.textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.name);
        await user.click(within(modal).getByRole("button", mocks.editBtn));

        expect(within(modal).getByRole("button", mocks.editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

        expect(router.replace).toHaveBeenCalledWith(params);
        expect(within(modal).getByRole("button", mocks.editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();
      });
    });

    describe("API response is an error or an unsupported object type", () => {
      it.each(mocks.alerts)("%s", async (_, mock) => {
        const { user } = renderUI(<UI id={mock.id} name={mock.name} />);

        const modal = screen.getByRole("dialog", mocks.dialog(mock.name));
        const inputBox = within(modal).getByRole("textbox", mocks.textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.name);
        await user.click(within(modal).getByRole("button", mocks.editBtn));

        expect(within(modal).getByRole("button", mocks.editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();

        await expect(screen.findByRole("alert")).resolves.toHaveTextContent(
          mock.msg
        );

        expect(within(modal).getByRole("button", mocks.editBtn)).toBeEnabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeEnabled();
      });
    });

    describe.each(mocks.table)("%s", (_, table) => {
      it.each(table)("%s", async (__, mock) => {
        const { user } = renderUI(<UI id={mock.id} name={mock.name} />);

        const modal = screen.getByRole("dialog", mocks.dialog(mock.name));
        const inputBox = within(modal).getByRole("textbox", mocks.textbox);

        await user.clear(inputBox);
        await user.type(inputBox, mock.name);
        await user.click(within(modal).getByRole("button", mocks.editBtn));

        expect(within(modal).getByRole("button", mocks.editBtn)).toBeDisabled();
        expect(within(modal).getByRole("button", mocks.cancel)).toBeDisabled();

        await waitFor(() => {
          expect(
            within(modal).getByRole("button", mocks.editBtn)
          ).toBeEnabled();
        });

        expect(within(modal).getByRole("button", mocks.cancel)).toBeEnabled();
        expect(mockFn).toHaveBeenCalledOnce();
        expect(mockFn).toHaveBeenCalledWith(mock.msg);
        expect(dispatchMock).toHaveBeenCalledOnce();
      });
    });
  });
});
