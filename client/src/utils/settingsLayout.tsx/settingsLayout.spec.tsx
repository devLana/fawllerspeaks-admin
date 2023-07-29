import { screen } from "@testing-library/react";

import settingsLayout from ".";
import { renderTestUI } from "@utils/renderTestUI";

const heading = "Settings Page";
const headingName = { name: new RegExp(heading, "i") };
const textNode = "Testing Settings Pages";
const page = <div>{textNode}</div>;

describe("Settings Layout Utility Function", () => {
  it("Layout function should render the loading UI", () => {
    const layout = settingsLayout(heading, { title: "Settings" });
    const ui = layout(page, false, null);

    renderTestUI(ui);

    expect(screen.queryByText(textNode)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", headingName)).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("Layout function should render an alert if there is an error message", () => {
    const layout = settingsLayout(heading, { title: "Settings" });
    const ui = layout(page, true, "An error has occurred");

    renderTestUI(ui);

    expect(screen.queryByText(textNode)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", headingName)).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "An error has occurred"
    );
  });

  it("Layout function should render the settings page ui", () => {
    const layout = settingsLayout(heading, { title: "Settings" });
    const ui = layout(page, true, null);

    renderTestUI(ui);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", headingName)).toBeInTheDocument();
    expect(screen.getByText(textNode)).toBeInTheDocument();
  });
});
