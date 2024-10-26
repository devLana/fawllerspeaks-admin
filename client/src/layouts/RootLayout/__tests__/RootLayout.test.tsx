import { screen } from "@testing-library/react";

import RootLayout from "..";
import { renderUI } from "@utils/tests/renderUI";

describe("Protected Pages Root Layout", () => {
  const page = <div>Page Element UI</div>;

  describe("Root Layout page ui", () => {
    it("Should render the Loading ui", () => {
      renderUI(
        <RootLayout
          clientHasRendered={false}
          errorMessage={null}
          title="Page Title"
        >
          {page}
        </RootLayout>
      );

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
      expect(screen.getByLabelText(/^loading session$/i)).toBeInTheDocument();
    });

    it("Should render an Error ui", () => {
      renderUI(
        <RootLayout
          clientHasRendered={true}
          errorMessage="An error has occurred"
          title="Page Title"
        >
          {page}
        </RootLayout>
      );

      expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();

      expect(
        screen.queryByLabelText(/^loading session$/i)
      ).not.toBeInTheDocument();

      expect(screen.getByRole("alert")).toHaveTextContent(
        "An error has occurred"
      );
    });

    it("Should render the Page ui", () => {
      renderUI(
        <RootLayout
          clientHasRendered={true}
          errorMessage={null}
          title="Page Title"
        >
          {page}
        </RootLayout>
      );

      expect(
        screen.queryByLabelText(/^loading session$/i)
      ).not.toBeInTheDocument();

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByText("Page Element UI")).toBeInTheDocument();
    });
  });
});
