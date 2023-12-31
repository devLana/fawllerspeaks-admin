import { useRouter } from "next/router";

import { screen, within } from "@testing-library/react";

import PageBreadcrumbs from ".";
import { renderUI } from "@utils/tests/renderUI";

describe("Page Breadcrumbs", () => {
  const name = { name: /^breadcrumb$/i };

  it("Should not render breadcrumbs if the current page is the Home(Dashboard) page", () => {
    renderUI(<PageBreadcrumbs />);
    expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();
  });

  it("Should not render breadcrumbs if the current pathname is only one level deep", () => {
    const router = useRouter();
    router.pathname = "/posts";

    renderUI(<PageBreadcrumbs />);
    expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();
  });

  it("Should render breadcrumbs if the current pathname is two or more levels deep", async () => {
    const router = useRouter();
    router.pathname = "/settings/profile";

    const { rerender, user } = renderUI(<PageBreadcrumbs />);

    const breadcrumbs = screen.getByRole("navigation", name);
    const crumbs = within(breadcrumbs).getAllByRole("listitem");

    expect(breadcrumbs).toBeInTheDocument();
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0]).toHaveTextContent("Settings");
    expect(crumbs[1]).toHaveTextContent("Profile");

    router.pathname =
      "/posts_page/post-preview/post/new 123-post-title-by-@john-öleg";
    rerender(<PageBreadcrumbs />);

    await user.click(screen.getByRole("button", { name: /^show path$/i }));

    const newBreadcrumbs = screen.getByRole("navigation", name);
    const newCrumbs = within(newBreadcrumbs).getAllByRole("listitem");

    expect(newBreadcrumbs).toBeInTheDocument();
    expect(newCrumbs).toHaveLength(4);
    expect(newCrumbs[0]).toHaveTextContent("Posts Page");
    expect(newCrumbs[1]).toHaveTextContent("Post Preview");
    expect(newCrumbs[1]).toHaveTextContent("Post");
    expect(newCrumbs[3]).toHaveTextContent("New 123 Post Title By @john öleg");
  });
});
