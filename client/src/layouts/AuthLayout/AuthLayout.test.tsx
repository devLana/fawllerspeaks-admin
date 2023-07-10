import { screen } from "@testing-library/react";

import Layout from ".";
import { renderTestUI } from "@utils/renderTestUI";

describe("Authentication Pages Layout", () => {
  const page = <div>Page Element UI</div>;

  it("Should render the Loader ui", () => {
    renderTestUI(
      <Layout clientHasRendered={false} errorMessage={null} title="Page Title">
        {page}
      </Layout>
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("Should render an Error ui", () => {
    renderTestUI(
      <Layout
        clientHasRendered={true}
        errorMessage="An error has occurred"
        title="Page Title"
      >
        {page}
      </Layout>
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText("Page Element UI")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "An error has occurred"
    );
  });

  it("Should render the Page ui", () => {
    renderTestUI(
      <Layout clientHasRendered={true} errorMessage={null} title="Page Title">
        {page}
      </Layout>
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Page Element UI")).toBeInTheDocument();
  });
});
