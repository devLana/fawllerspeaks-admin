import { screen } from "@testing-library/react";

import AuthRootLayout from "..";
import { renderUI } from "@utils/tests/renderUI";

describe("Authentication Pages Root Layout", () => {
  const page = <div>Page Element UI</div>;

  it("Should render the Loader ui", () => {
    renderUI(
      <AuthRootLayout
        clientHasRendered={false}
        errorMessage={null}
        title="Page Title"
      >
        {page}
      </AuthRootLayout>
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("Should render an Error ui", () => {
    renderUI(
      <AuthRootLayout
        clientHasRendered={true}
        errorMessage="An error has occurred"
        title="Page Title"
      >
        {page}
      </AuthRootLayout>
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "An error has occurred"
    );
  });

  it("Should render the Page ui", () => {
    renderUI(
      <AuthRootLayout
        clientHasRendered={true}
        errorMessage={null}
        title="Page Title"
      >
        {page}
      </AuthRootLayout>
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Page Element UI")).toBeInTheDocument();
  });
});
