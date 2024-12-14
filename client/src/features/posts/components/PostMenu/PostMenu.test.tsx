import PostMenu from ".";
import { renderUI } from "@utils/tests/renderUI";
import { screen, within } from "@testing-library/react";
import type { PostStatus } from "@apiTypes";

describe("PostMenu", () => {
  const title = "Test Post Title";
  const slug = "test-post-slug";
  const name = { name: /^test post title post actions$/i };
  const link = /^edit$/i;
  const draftLink = /^Continue writing post$/i;

  const UI = ({ status }: { status: PostStatus }) => (
    <PostMenu slug={slug} status={status} title={title} />
  );

  it("Should render a list of menu items for a 'Draft' post", async () => {
    const { user } = renderUI(<UI status="Draft" />);

    await user.click(screen.getByRole("button", name));

    const menu = screen.getByRole("menu", name);
    const menuItems = within(menu).getAllByRole("menuitem");

    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent(draftLink);
    expect(menuItems[1]).toHaveTextContent(/^send to bin$/i);
  });

  it("Should render a list of menu items for a 'Published' post", async () => {
    const { user } = renderUI(<UI status="Published" />);

    await user.click(screen.getByRole("button", name));

    const menu = screen.getByRole("menu", name);
    const menuItems = within(menu).getAllByRole("menuitem");

    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toHaveTextContent(/^Unpublish$/i);
    expect(menuItems[1]).toHaveTextContent(link);
    expect(menuItems[1]).toHaveStyle({ borderTop: "1px solid" });
    expect(menuItems[2]).toHaveTextContent(/^send to bin$/i);
  });

  it("Should render a list of menu items for an 'Unpublished' post", async () => {
    const { user } = renderUI(<UI status="Unpublished" />);

    await user.click(screen.getByRole("button", name));

    const menu = screen.getByRole("menu", name);
    const menuItems = within(menu).getAllByRole("menuitem");

    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toHaveTextContent(/^publish$/i);
    expect(menuItems[1]).toHaveTextContent(link);
    expect(menuItems[1]).toHaveStyle({ borderTop: "1px solid" });
    expect(menuItems[2]).toHaveTextContent(/^send to bin$/i);
  });
});
