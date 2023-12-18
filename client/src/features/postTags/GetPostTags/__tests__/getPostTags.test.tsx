import { useRouter } from "next/router";

import { graphql } from "msw";
import { screen, waitFor, within } from "@testing-library/react";

import PostTagsPage from "@pages/post-tags";
import * as mocks from "../utils/getPostTags.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("View/Get post tags", () => {
  beforeAll(() => {
    mocks.server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    mocks.server.resetHandlers();
  });

  afterAll(() => {
    mocks.server.close();
  });

  describe("Api response redirects the user to an authentication page", () => {
    it.each(mocks.redirects)("%s", async (_, path, resolver) => {
      mocks.server.use(graphql.query("GetPostTags", resolver));

      renderUI(<PostTagsPage />);
      const { replace } = useRouter();

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      await waitFor(() => expect(replace).toHaveBeenCalledTimes(1));
      expect(replace).toHaveBeenCalledWith(path);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("Api response should display a notification message", () => {
    it.each(mocks.alerts)("%s", async (_, message, resolver) => {
      mocks.server.use(graphql.query("GetPostTags", resolver));

      renderUI(<PostTagsPage />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(await screen.findByRole("alert")).toHaveTextContent(message);
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  describe("Get all post tags", () => {
    it("Should render a list of all post tags", async () => {
      renderUI(<PostTagsPage />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();

      const list = await screen.findByRole("list");
      const listItem = within(list).getAllByRole("listitem");

      expect(listItem).toHaveLength(mocks.getTags.length);
      expect(listItem[0]).toHaveTextContent(mocks.getTags[0]);
      expect(listItem[1]).toHaveTextContent(mocks.getTags[1]);
      expect(listItem[2]).toHaveTextContent(mocks.getTags[2]);
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
