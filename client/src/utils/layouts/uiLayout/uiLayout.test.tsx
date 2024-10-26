import { screen } from "@testing-library/react";

import uiLayout from ".";
import TestLayout from "@layouts/components/TestLayout";
import { renderUI } from "@utils/tests/renderUI";

const page = <div>Testing Page</div>;

describe("Page Layout Utility Function", () => {
  it("Layout function should render the loading UI", () => {
    const layout = uiLayout(TestLayout, { title: "Testing" });
    const ui = layout(page, false, null);

    renderUI(ui);

    expect(screen.queryByText("Testing Page")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^loading session$/i)).toBeInTheDocument();
  });

  it("Layout function should render an alert if there is an error message", () => {
    const layout = uiLayout(TestLayout, { title: "Testing" });
    const ui = layout(page, true, "An error has occurred");

    renderUI(ui);

    expect(screen.queryByText("Testing Page")).not.toBeInTheDocument();

    expect(
      screen.queryByLabelText(/^loading session$/i)
    ).not.toBeInTheDocument();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "An error has occurred"
    );
  });

  it("Layout function should render the page ui", () => {
    const layout = uiLayout(TestLayout, { title: "Testing" });
    const ui = layout(page, true, null);

    renderUI(ui);

    expect(
      screen.queryByLabelText(/^loading session$/i)
    ).not.toBeInTheDocument();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Testing Page")).toBeInTheDocument();
  });
});
