import PostMenu from ".";
import { renderUI } from "@utils/tests/renderUI";
import { screen, within } from "@testing-library/react";
import type { PostStatus } from "@apiTypes";

describe("PostMenu", () => {
  const title = "Test Post Title";
  const slug = "test-post-title";
  const name = { name: /^test post title post actions$/i };
  const link = /^edit$/i;
  const draftLink = /^Continue writing post$/i;
  const onUnpublishMock = vi.fn().mockName("onUnpublish");
  const onBinPostMock = vi.fn().mockName("onBinPost");

  const UI = ({ status }: { status: PostStatus }) => (
    <PostMenu
      slug={slug}
      status={status}
      title={title}
      onUnpublish={onUnpublishMock}
      onBinPost={onBinPostMock}
    />
  );

  it("Should render a list of menu items for a 'Draft' post", async () => {
    const { user } = renderUI(<UI status="Draft" />);

    await user.click(screen.getByRole("button", name));

    const menu = screen.getByRole("menu", name);
    const menuItems = within(menu).getAllByRole("menuitem");

    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent(draftLink);
    expect(menuItems[1]).toHaveTextContent(/^send to bin$/i);

    await user.click(menuItems[1]);

    expect(onBinPostMock).toHaveBeenCalledOnce();
    expect(menu).not.toBeInTheDocument();
  });

  it("Should render a list of menu items for a 'Published' post", async () => {
    const { user } = renderUI(<UI status="Published" />);

    await user.click(screen.getByRole("button", name));

    const menu1 = screen.getByRole("menu", name);
    const menuItems1 = within(menu1).getAllByRole("menuitem");

    expect(menuItems1).toHaveLength(3);
    expect(menuItems1[0]).toHaveTextContent(/^Unpublish$/i);
    expect(menuItems1[1]).toHaveTextContent(link);
    expect(menuItems1[1]).toHaveStyle({ borderTop: "1px solid" });
    expect(menuItems1[2]).toHaveTextContent(/^send to bin$/i);

    await user.click(menuItems1[0]);

    expect(onUnpublishMock).toHaveBeenCalledOnce();
    expect(menu1).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", name));

    const menu2 = screen.getByRole("menu", name);
    const menuItems2 = within(menu2).getAllByRole("menuitem");

    await user.click(menuItems2[2]);

    expect(onBinPostMock).toHaveBeenCalledOnce();
    expect(menu2).not.toBeInTheDocument();
  });

  it("Should render a list of menu items for an 'Unpublished' post", async () => {
    const { user } = renderUI(<UI status="Unpublished" />);

    await user.click(screen.getByRole("button", name));

    const menu = screen.getByRole("menu", name);
    const menuItems = within(menu).getAllByRole("menuitem");

    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent(link);
    expect(menuItems[1]).toHaveTextContent(/^send to bin$/i);

    await user.click(menuItems[1]);

    expect(onBinPostMock).toHaveBeenCalledOnce();
    expect(menu).not.toBeInTheDocument();
  });
});
