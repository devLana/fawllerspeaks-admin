import { useRouter } from "next/router";

import { screen, within } from "@testing-library/react";

import PageBreadcrumbs from "..";
import { renderUI } from "@utils/tests/renderUI";

describe("Page Breadcrumbs", () => {
  const name = { name: /^breadcrumb$/i };

  describe("Breadcrumbs is not rendered", () => {
    it("Should not render breadcrumbs if the current page is the Home(Dashboard) page", () => {
      renderUI(<PageBreadcrumbs />);
      expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();
    });

    it("Should not render breadcrumbs if the current page is only one directory deep", () => {
      const router = useRouter();
      router.pathname = "/post-tags";

      renderUI(<PageBreadcrumbs />);
      expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();
    });

    it("Should not render breadcrumbs if the current page is a posts dynamic route", () => {
      const router = useRouter();
      router.pathname = "/posts/[[...postsPage]]";

      renderUI(<PageBreadcrumbs />);
      expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();
    });

    it("Should not render breadcrumbs on an error(404 or 500) page", () => {
      const router = useRouter();
      router.pathname = "/500";

      renderUI(<PageBreadcrumbs />);
      expect(screen.queryByRole("navigation", name)).not.toBeInTheDocument();
    });
  });

  describe("Breadcrumbs is rendered", () => {
    it("Should render breadcrumbs for paths that are two directories deep", () => {
      const router = useRouter();
      router.pathname = "/settings/me";

      renderUI(<PageBreadcrumbs />);
      const breadcrumbs = screen.getByRole("navigation", name);
      const crumbs = within(breadcrumbs).getAllByRole("listitem");

      expect(crumbs).toHaveLength(2);

      expect(crumbs[0]).toContainElement(
        screen.getByRole("link", { name: "Settings" })
      );

      expect(
        within(crumbs[0]).getByRole("link", { name: "Settings" })
      ).toHaveAttribute("href", "/settings");

      expect(crumbs[1]).toContainElement(screen.getByRole("paragraph"));
      expect(within(crumbs[1]).getByRole("paragraph")).toHaveTextContent("Me");
    });

    it("Should render breadcrumbs for paths that are more than two directories deep", () => {
      const router = useRouter();
      router.pathname = "/settings/me/edit";

      renderUI(<PageBreadcrumbs />);

      const newBreadcrumbs = screen.getByRole("navigation", name);
      const newCrumbs = within(newBreadcrumbs).getAllByRole("listitem");

      expect(newCrumbs).toHaveLength(3);

      expect(newCrumbs[0]).toContainElement(
        screen.getByRole("link", { name: "Settings" })
      );

      expect(
        within(newCrumbs[0]).getByRole("link", { name: "Settings" })
      ).toHaveAttribute("href", "/settings");

      expect(newCrumbs[1]).toContainElement(
        screen.getByRole("link", { name: "Me" })
      );

      expect(
        within(newCrumbs[1]).getByRole("link", { name: "Me" })
      ).toHaveAttribute("href", "/settings/me");

      expect(newCrumbs[2]).toContainElement(screen.getByRole("paragraph"));

      expect(within(newCrumbs[2]).getByRole("paragraph")).toHaveTextContent(
        "Edit"
      );
    });

    it("Should render breadcrumbs if the current page is a nested posts dynamic route", () => {
      const router = useRouter();
      router.pathname = "/posts/edit/[slug]";
      router.asPath = "/posts/edit/new-post-title-by-john-öleg";

      renderUI(<PageBreadcrumbs />);

      const breadcrumbs = screen.getByRole("navigation", name);
      const crumbs = within(breadcrumbs).getAllByRole("listitem");

      expect(crumbs).toHaveLength(2);

      expect(crumbs[0]).toContainElement(
        screen.getByRole("link", { name: "Posts" })
      );

      expect(
        within(crumbs[0]).getByRole("link", { name: "Posts" })
      ).toHaveAttribute("href", "/posts");

      expect(crumbs[1]).toContainElement(screen.getByRole("paragraph"));

      expect(within(crumbs[1]).getByRole("paragraph")).toHaveTextContent(
        "New Post Title By John Öleg"
      );
    });
  });
});
