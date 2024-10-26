import { useRouter } from "next/router";

import { screen, waitFor, within } from "@testing-library/react";

import DeletePostTags from "..";
import { PostTagsPageContext } from "@context/PostTags";
import * as mocks from "./deletePostTags.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("Delete post tags", () => {
  const dispatchMock = vi.fn().mockName("dispatch");
  const mockFn = vi.fn().mockName("handleOpenAlert");

  const UI = ({ ids, name }: { ids: string[]; name: string }) => (
    <PostTagsPageContext.Provider value={{ handleOpenAlert: mockFn }}>
      <DeletePostTags open name={name} ids={ids} dispatch={dispatchMock} />
    </PostTagsPageContext.Provider>
  );

  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Delete API request receives an authentication error response", () => {
    it.each(mocks.redirects)("%s", async (_, { pathname, params }, mock) => {
      const router = useRouter();
      router.pathname = pathname;

      const { user } = renderUI(<UI ids={mock.tagIds} name={mock.name} />, {
        writeQuery: mocks.writeTags(mock.tags),
      });

      const text = `Are you sure you want to delete ${mock.name}?`;
      const modal = screen.getByRole("dialog", mocks.dialog1);

      expect(
        within(modal).getByText((__, elem) => elem?.textContent === text)
      ).toBeInTheDocument();

      await user.click(within(modal).getByRole("button", mocks.delBtn1));

      expect(within(modal).getByRole("button", mocks.delBtn1)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      await waitFor(() => expect(router.replace).toHaveBeenCalledOnce());

      expect(router.replace).toHaveBeenCalledWith(params);
      expect(dispatchMock).not.toHaveBeenCalled();
      expect(mockFn).not.toHaveBeenCalled();
      expect(within(modal).getByRole("button", mocks.delBtn1)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();
    });
  });

  describe("Delete API response is an error or an unsupported object type", () => {
    it.each(mocks.alerts)("%s", async (_, mock) => {
      const { user } = renderUI(<UI ids={mock.tagIds} name={mock.name} />, {
        writeQuery: mocks.writeTags(mock.tags),
      });

      const text = "Are you sure you want to delete all post tags?";
      const modal = screen.getByRole("dialog", mocks.dialog2);

      expect(
        within(modal).getByText((__, elem) => elem?.textContent === text)
      ).toBeInTheDocument();

      await user.click(within(modal).getByRole("button", mocks.delBtn2));

      expect(within(modal).getByRole("button", mocks.delBtn2)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      await waitFor(() => expect(dispatchMock).toHaveBeenCalledOnce());

      expect(mockFn).toHaveBeenCalledOnce();
      expect(mockFn).toHaveBeenCalledWith(mock.msg);
    });

    it.each(mocks.errors)("%s", async (_, mock) => {
      const total = mock.tagIds.length - 2;

      const { user } = renderUI(
        <UI name={mock.name} ids={mock.tagIds.slice(0, total)} />,
        { writeQuery: mocks.writeTags(mock.tags) }
      );

      const text = `Are you sure you want to delete these ${total} post tags?`;
      const modal = screen.getByRole("dialog", mocks.dialog2);

      expect(
        within(modal).getByText((__, elem) => elem?.textContent === text)
      ).toBeInTheDocument();

      await user.click(within(modal).getByRole("button", mocks.delBtn2));

      expect(within(modal).getByRole("button", mocks.delBtn2)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      await waitFor(() => expect(dispatchMock).toHaveBeenCalledOnce());

      expect(mockFn).toHaveBeenCalledOnce();
      expect(mockFn).toHaveBeenCalledWith(mock.msg);
    });
  });

  describe("Post tags are deleted", () => {
    it.each(mocks.deletes)("%s", async (_, mock, data) => {
      const total = mock.tagIds.length - data.diff;

      const { user } = renderUI(
        <UI name={mock.name} ids={mock.tagIds.slice(0, total)} />,
        { writeQuery: mocks.writeTags(mock.tags) }
      );

      const text = `Are you sure you want to delete ${data.str}?`;
      const modal = screen.getByRole("dialog", data.dialog);

      expect(
        within(modal).getByText((__, elem) => elem?.textContent === text)
      ).toBeInTheDocument();

      await user.click(within(modal).getByRole("button", data.btn));

      expect(within(modal).getByRole("button", data.btn)).toBeDisabled();
      expect(within(modal).getByRole("button", mocks.cancelBtn)).toBeDisabled();

      await waitFor(() => expect(dispatchMock).toHaveBeenCalledOnce());

      expect(mockFn).toHaveBeenCalledOnce();
      expect(mockFn).toHaveBeenCalledWith(mock.msg);
    });
  });
});
