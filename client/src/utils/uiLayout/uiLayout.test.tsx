import { screen } from "@testing-library/react";

import uiLayout from ".";
import TestLayout from "@layouts/TestLayout";
import { renderTestUI } from "@utils/renderTestUI";

const page = <div>Testing Page</div>;

describe("Page Layout Utility Function", () => {
  it("Layout function should render the loading UI", () => {
    const layout = uiLayout(TestLayout, { title: "Testing" });
    const ui = layout(page, false, null);

    renderTestUI(ui);

    expect(screen.queryByText("Testing Page")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("Layout function should render an alert if there is an error message", () => {
    const layout = uiLayout(TestLayout, { title: "Testing" });
    const ui = layout(page, true, "An error has occurred");

    renderTestUI(ui);

    expect(screen.queryByText("Testing Page")).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "An error has occurred"
    );
  });

  it("Layout function should render the page ui", () => {
    const layout = uiLayout(TestLayout, { title: "Testing" });
    const ui = layout(page, true, null);

    renderTestUI(ui);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Testing Page")).toBeInTheDocument();
  });
});
