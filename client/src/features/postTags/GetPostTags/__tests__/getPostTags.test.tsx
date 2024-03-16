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
    it.each(mocks.redirects)("%s", async (_, { pathname, url }, resolver) => {
      const router = useRouter();

      router.pathname = pathname;
      mocks.server.use(graphql.query("GetPostTags", resolver));
      renderUI(<PostTagsPage />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
      expect(router.replace).toHaveBeenCalledWith(url);
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
      expect(listItem[3]).toHaveTextContent(mocks.getTags[3]);
      expect(listItem[4]).toHaveTextContent(mocks.getTags[4]);
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Select multiple post tags", () => {
    const regex = /^delete 1 post tag$/i;
    const selectAll = { name: /^select all post tags$/i };
    const unselectAll = { name: /^unselect all post tags$/i };

    const name = (index: number) => ({
      name: new RegExp(`^${mocks.getTags[index]}$`, "i"),
    });

    const btn = (value: string) => ({
      name: new RegExp(`^delete ${value} post tags$`, "i"),
    });

    it("Should select a post tag by clicking on a post tag", async () => {
      const { user } = renderUI(<PostTagsPage />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();

      await user.click(screen.getByRole("checkbox", name(0)));
      expect(screen.getByRole("checkbox", name(0))).toBeChecked();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("button", { name: regex })).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", name(1)));
      expect(screen.getByRole("checkbox", name(1))).toBeChecked();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("button", btn("2"))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", name(2)));
      expect(screen.getByRole("checkbox", name(2))).toBeChecked();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("button", btn("3"))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", name(3)));
      expect(screen.getByRole("checkbox", name(3))).toBeChecked();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("button", btn("4"))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", name(4)));
      expect(screen.getByRole("checkbox", name(4))).toBeChecked();
      expect(screen.getByRole("checkbox", unselectAll)).toBeChecked();
      expect(screen.getByRole("button", btn("all"))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", name(2)));
      expect(screen.getByRole("checkbox", name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("button", btn("4"))).toBeInTheDocument();
    });

    it("Should select multiple post tags by using shift + click", async () => {
      const { user } = renderUI(<PostTagsPage />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();

      await user.click(screen.getByRole("checkbox", name(1)));
      expect(screen.getByRole("checkbox", name(1))).toBeChecked();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("button", { name: regex })).toBeInTheDocument();

      await user.keyboard("{Shift>}");
      await user.click(screen.getByRole("checkbox", name(3)));
      await user.keyboard("{/Shift}");
      expect(screen.getByRole("checkbox", name(2))).toBeChecked();
      expect(screen.getByRole("checkbox", name(3))).toBeChecked();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("button", btn("3"))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", name(1)));
      expect(screen.getByRole("checkbox", name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("button", btn("2"))).toBeInTheDocument();

      await user.keyboard("{Shift>}");
      await user.click(screen.getByRole("checkbox", name(3)));
      await user.keyboard("{/Shift}");
      expect(screen.getByRole("checkbox", name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.queryByRole("button", btn("3"))).not.toBeInTheDocument();
    });

    it("Should select all post tags with ctrl + a", async () => {
      const { user } = renderUI(<PostTagsPage />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(0))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(4))).not.toBeChecked();

      await user.keyboard("{Control>}a{/Control}");
      expect(screen.getByRole("checkbox", unselectAll)).toBeChecked();
      expect(screen.getByRole("button", btn("all"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", name(0))).toBeChecked();
      expect(screen.getByRole("checkbox", name(1))).toBeChecked();
      expect(screen.getByRole("checkbox", name(2))).toBeChecked();
      expect(screen.getByRole("checkbox", name(3))).toBeChecked();
      expect(screen.getByRole("checkbox", name(4))).toBeChecked();

      await user.click(screen.getByRole("checkbox", unselectAll));
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(0))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(4))).not.toBeChecked();
      expect(screen.queryByRole("button", btn("all"))).not.toBeInTheDocument();

      await user.keyboard("{Control>}A{/Control}");
      expect(screen.getByRole("checkbox", unselectAll)).toBeChecked();
      expect(screen.getByRole("button", btn("all"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", name(0))).toBeChecked();
      expect(screen.getByRole("checkbox", name(1))).toBeChecked();
      expect(screen.getByRole("checkbox", name(2))).toBeChecked();
      expect(screen.getByRole("checkbox", name(3))).toBeChecked();
      expect(screen.getByRole("checkbox", name(4))).toBeChecked();
    });

    it("Should select/unselect all post tags by clicking on the toolbar checkbox", async () => {
      const { user } = renderUI(<PostTagsPage />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      await expect(screen.findByRole("list")).resolves.toBeInTheDocument();
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(0))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(4))).not.toBeChecked();

      await user.click(screen.getByRole("checkbox", selectAll));
      expect(screen.getByRole("checkbox", unselectAll)).toBeChecked();
      expect(screen.getByRole("button", btn("all"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", name(0))).toBeChecked();
      expect(screen.getByRole("checkbox", name(1))).toBeChecked();
      expect(screen.getByRole("checkbox", name(2))).toBeChecked();
      expect(screen.getByRole("checkbox", name(3))).toBeChecked();
      expect(screen.getByRole("checkbox", name(4))).toBeChecked();

      await user.click(screen.getByRole("checkbox", unselectAll));
      expect(screen.getByRole("checkbox", selectAll)).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(0))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", name(4))).not.toBeChecked();
      expect(screen.queryByRole("button", btn("all"))).not.toBeInTheDocument();
    });
  });
});
