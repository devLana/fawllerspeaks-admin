import { useRouter } from "next/router";

import { screen, within } from "@testing-library/react";

import PageBreadcrumbs from "..";
import { renderUI } from "@testUtils/renderUI";

describe("Page Breadcrumbs", () => {
  const name = { name: /^breadcrumb$/i };

  it("Should not render breadcrumbs if the current page is a dynamic route", () => {
    const router = useRouter();
    router.pathname = "/posts/[dynamicRoute]";

    const { rerender } = renderUI(<PageBreadcrumbs />);
    expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();

    router.pathname = "/posts/[...dynamicRoute]";

    rerender(<PageBreadcrumbs />);
    expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();

    router.pathname = "/posts/[[...dynamicRoute]]";

    rerender(<PageBreadcrumbs />);
    expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();
  });

  it("Should not render breadcrumbs if the current page is the Home(Dashboard) page", () => {
    renderUI(<PageBreadcrumbs />);
    expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();
  });

  it("Should not render breadcrumbs if the current pathname is only one directory deep", () => {
    const router = useRouter();

    router.pathname = "/posts";

    renderUI(<PageBreadcrumbs />);
    expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();
  });

  it("Should render breadcrumbs if the current pathname is two or more directories deep", async () => {
    const router = useRouter();
    router.pathname = "/settings/profile";

    const { rerender, user } = renderUI(<PageBreadcrumbs />);
    const breadcrumbs = screen.getByRole("navigation", name);
    const crumbs = within(breadcrumbs).getAllByRole("listitem");

    expect(crumbs).toHaveLength(2);
    expect(crumbs[0]).toHaveTextContent("Settings");
    expect(crumbs[1]).toHaveTextContent("Profile");

    router.pathname =
      "/posts_page/post-preview/post/new-123-post-title-by-john-öleg";

    rerender(<PageBreadcrumbs />);

    await user.click(screen.getByRole("button", { name: /^show path$/i }));

    const newBreadcrumbs = screen.getByRole("navigation", name);
    const newCrumbs = within(newBreadcrumbs).getAllByRole("listitem");

    expect(newCrumbs).toHaveLength(4);
    expect(newCrumbs[0]).toHaveTextContent("Posts Page");
    expect(newCrumbs[1]).toHaveTextContent("Post Preview");
    expect(newCrumbs[1]).toHaveTextContent("Post");
    expect(newCrumbs[3]).toHaveTextContent("New 123 Post Title By John Öleg");
  });
});
