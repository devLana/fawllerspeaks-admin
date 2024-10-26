import { screen } from "@testing-library/react";

import PostTags from "..";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./PostTags.mocks";

vi.mock("@features/postTags/EditPostTag");
vi.mock("@features/postTags/DeletePostTags");

describe("Post Tags List", () => {
  const UI = (
    <>
      <h1 id="page-title">Post Tags</h1>
      <PostTags id="page-title" />
    </>
  );

  describe("Select/Unselect post tags", () => {
    it("Should select/unselect all post tags with 'ctrl + a' or 'ctrl + A'", async () => {
      const { user } = renderUI(UI, { writeQuery: mocks.writeTags });

      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.selectAll)).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(0))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(4))).not.toBeChecked();

      await user.keyboard("{Control>}a{/Control}");

      expect(screen.getByRole("checkbox", mocks.unselectAll)).toBeChecked();
      expect(screen.getByRole("button", mocks.btn("all"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.name(0))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(1))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(2))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(3))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(4))).toBeChecked();

      await user.click(screen.getByRole("checkbox", mocks.unselectAll));

      expect(screen.getByRole("checkbox", mocks.selectAll)).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(0))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(4))).not.toBeChecked();

      expect(
        screen.queryByRole("button", mocks.btn("all"))
      ).not.toBeInTheDocument();

      await user.keyboard("{Control>}A{/Control}");

      expect(screen.getByRole("checkbox", mocks.unselectAll)).toBeChecked();
      expect(screen.getByRole("button", mocks.btn("all"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.name(0))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(1))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(2))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(3))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(4))).toBeChecked();
    });

    it("Should select/unselect all post tags by clicking on the toolbar checkbox", async () => {
      const { user } = renderUI(UI, { writeQuery: mocks.writeTags });

      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.selectAll)).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(0))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(4))).not.toBeChecked();

      await user.click(screen.getByRole("checkbox", mocks.selectAll));

      expect(screen.getByRole("checkbox", mocks.unselectAll)).toBeChecked();
      expect(screen.getByRole("button", mocks.btn("all"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.name(0))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(1))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(2))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(3))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(4))).toBeChecked();

      await user.click(screen.getByRole("checkbox", mocks.unselectAll));

      expect(screen.getByRole("checkbox", mocks.selectAll)).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(0))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(4))).not.toBeChecked();

      expect(
        screen.queryByRole("button", mocks.btn("all"))
      ).not.toBeInTheDocument();
    });

    it("Should select/unselect a post tag by clicking on the post tag", async () => {
      const { user } = renderUI(UI, { writeQuery: mocks.writeTags });

      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.selectAll)).not.toBeChecked();

      await user.click(screen.getByRole("checkbox", mocks.name(0)));

      expect(screen.getByRole("button", mocks.regex)).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.name(0))).toBeChecked();

      expect(
        screen.getByRole("checkbox", mocks.selectAll)
      ).toBePartiallyChecked();

      await user.click(screen.getByRole("checkbox", mocks.name(1)));

      expect(screen.getByRole("button", mocks.btn("2"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.name(1))).toBeChecked();

      expect(
        screen.getByRole("checkbox", mocks.selectAll)
      ).toBePartiallyChecked();

      await user.click(screen.getByRole("checkbox", mocks.name(2)));

      expect(screen.getByRole("button", mocks.btn("3"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.name(2))).toBeChecked();

      expect(
        screen.getByRole("checkbox", mocks.selectAll)
      ).toBePartiallyChecked();

      await user.click(screen.getByRole("checkbox", mocks.name(3)));

      expect(screen.getByRole("button", mocks.btn("4"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.name(3))).toBeChecked();

      expect(
        screen.getByRole("checkbox", mocks.selectAll)
      ).toBePartiallyChecked();

      await user.click(screen.getByRole("checkbox", mocks.name(4)));

      expect(screen.getByRole("checkbox", mocks.name(4))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.unselectAll)).toBeChecked();
      expect(screen.getByRole("button", mocks.btn("all"))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", mocks.name(2)));

      expect(screen.getByRole("button", mocks.btn("4"))).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.name(2))).not.toBeChecked();

      expect(
        screen.getByRole("checkbox", mocks.selectAll)
      ).toBePartiallyChecked();
    });

    it("Should select/unselect a range of multiple post tags by using 'shift + click'", async () => {
      const { user } = renderUI(UI, { writeQuery: mocks.writeTags });

      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getByRole("checkbox", mocks.selectAll)).not.toBeChecked();

      await user.click(screen.getByRole("checkbox", mocks.name(0)));
      await user.keyboard("{Shift>}");
      await user.click(screen.getByRole("checkbox", mocks.name(4)));
      await user.keyboard("{/Shift}");

      expect(screen.getByRole("checkbox", mocks.name(0))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(1))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(2))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(3))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(4))).toBeChecked();
      expect(screen.getByRole("checkbox", mocks.unselectAll)).toBeChecked();
      expect(screen.getByRole("button", mocks.btn("all"))).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", mocks.name(3)));
      await user.keyboard("{Shift>}");
      await user.click(screen.getByRole("checkbox", mocks.name(0)));
      await user.keyboard("{/Shift}");

      expect(screen.getByRole("checkbox", mocks.name(0))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(1))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(2))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(3))).not.toBeChecked();
      expect(screen.getByRole("checkbox", mocks.name(4))).toBeChecked();
      expect(screen.getByRole("button", mocks.regex)).toBeInTheDocument();

      expect(
        screen.getByRole("checkbox", mocks.selectAll)
      ).toBePartiallyChecked();
    });
  });

  describe("Edit post tag", () => {
    it("Should open and close the edit dialog", async () => {
      const { user } = renderUI(UI, { writeQuery: mocks.writeTags });

      expect(screen.getByRole("list")).toBeInTheDocument();

      await user.hover(screen.getByRole("listitem", mocks.postTag(2)));
      await user.click(screen.getByRole("button", mocks.postTag(2)));
      await user.click(screen.getByRole("menuitem", { name: /^edit$/i }));

      expect(await screen.findByText(mocks.edit(2))).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /^cancel$/i }));

      expect(screen.queryByText(mocks.edit(2))).not.toBeInTheDocument();
    });
  });

  describe("Delete post tag", () => {
    it("Should open and close the delete dialog using a post tag menu", async () => {
      const { user } = renderUI(UI, { writeQuery: mocks.writeTags });

      expect(screen.getByRole("list")).toBeInTheDocument();

      await user.hover(screen.getByRole("listitem", mocks.postTag(4)));
      await user.click(screen.getByRole("button", mocks.postTag(4)));
      await user.click(screen.getByRole("menuitem", { name: /^delete$/i }));

      expect(screen.getByText(mocks.del1)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /^cancel$/i }));

      expect(screen.queryByText(mocks.del1)).not.toBeInTheDocument();
    });

    it("Should open and close the delete dialog using the toolbar delete button", async () => {
      const { user } = renderUI(UI, { writeQuery: mocks.writeTags });

      expect(screen.getByRole("list")).toBeInTheDocument();

      await user.click(screen.getByRole("checkbox", mocks.name(0)));
      await user.click(screen.getByRole("checkbox", mocks.name(2)));
      await user.click(screen.getByRole("checkbox", mocks.name(3)));
      await user.click(screen.getByRole("button", mocks.btn("3")));

      expect(screen.getByText(mocks.del2)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /^cancel$/i }));

      expect(screen.queryByText(mocks.del2)).not.toBeInTheDocument();
    });
  });
});
