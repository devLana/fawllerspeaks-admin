import CreatePostActionButtons from ".";
import { renderUI } from "@utils/tests/renderUI";
import { screen } from "@testing-library/react";

interface Props {
  onNext?: VoidFunction;
  hasPopUp: boolean;
}

describe("Create Post Action Buttons", () => {
  const onNextFn = vi.fn().mockName("onNext");

  const UI = ({ onNext, hasPopUp }: Props) => (
    <CreatePostActionButtons
      status="idle"
      nextLabel="Proceed To Next Section"
      actionLabel="Edit Post"
      onAction={vi.fn().mockName("onAction")}
      onNext={onNext}
      hasPopUp={hasPopUp}
    />
  );

  it("Should render a submit button as the next button", () => {
    renderUI(<UI hasPopUp={false} />);

    expect(
      screen.getByRole("button", { name: /^proceed to next section$/i })
    ).toHaveAttribute("type", "submit");

    expect(
      screen.getByRole("button", { name: /^proceed to next section$/i })
    ).toHaveAttribute("aria-haspopup");
  });

  it("Should render a normal button as the next button", async () => {
    const { user } = renderUI(<UI hasPopUp={false} onNext={onNextFn} />);

    const btn = screen.getByRole("button", {
      name: /^proceed to next section$/i,
    });

    expect(btn).not.toHaveAttribute("type", "submit");
    expect(btn).not.toHaveAttribute("aria-haspopup");

    await user.click(btn);

    expect(onNextFn).toHaveBeenCalledOnce();
  });

  it("Expect next button to have 'aria-haspopup' attribute", () => {
    renderUI(<UI hasPopUp />);

    expect(
      screen.getByRole("button", { name: /^proceed to next section$/i })
    ).toHaveAttribute("aria-haspopup", "dialog");
  });
});
