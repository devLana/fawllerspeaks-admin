import { render, screen, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TestForm } from "./TestForm";

const renderFn = (renderOptions: RenderOptions = {}) => {
  const user = userEvent.setup({ applyAccept: false });
  const view = render(<TestForm />, renderOptions);

  return { user, ...view };
};

describe("useForm hook", () => {
  it("Expect form input fields to be validated properly", async () => {
    const { user } = renderFn();

    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    expect(
      screen.getByRole("textbox", { name: /^name$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("spinbutton", { name: /^age$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("textbox", { name: /^e-mail$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("group", { name: /^select title$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("group", { name: /^select your hobbies$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByLabelText(/^avatar$/i),
    ).not.toHaveAccessibleErrorMessage();
  });

  it("Expect some form input fields to be able to be re-validated", async () => {
    const { user } = renderFn();

    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    expect(
      screen.getByRole("textbox", { name: /^name$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("spinbutton", { name: /^age$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("textbox", { name: /^e-mail$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("group", { name: /^select title$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("group", { name: /^select your hobbies$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByLabelText(/^avatar$/i),
    ).not.toHaveAccessibleErrorMessage();

    await user.click(screen.getByRole("textbox", { name: /^name$/i }));

    expect(
      screen.getByRole("textbox", { name: /^name$/i }),
    ).not.toHaveAccessibleErrorMessage();

    await user.click(screen.getByRole("spinbutton", { name: /^age$/i }));

    expect(
      screen.getByRole("textbox", { name: /^name$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("spinbutton", { name: /^age$/i }),
    ).not.toHaveAccessibleErrorMessage();

    await user.click(screen.getByRole("textbox", { name: /^e-mail$/i }));

    expect(
      screen.getByRole("spinbutton", { name: /^age$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("textbox", { name: /^e-mail$/i }),
    ).not.toHaveAccessibleErrorMessage();

    await user.click(screen.getByRole("radio", { name: /^mr$/i }));

    expect(
      screen.getByRole("textbox", { name: /^e-mail$/i }),
    ).toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("group", { name: /^select title$/i }),
    ).not.toHaveAccessibleErrorMessage();

    await user.click(screen.getByRole("checkbox", { name: /^movies$/i }));

    expect(
      screen.getByRole("group", { name: /^select title$/i }),
    ).not.toHaveAccessibleErrorMessage();

    expect(
      screen.getByRole("group", { name: /^select your hobbies$/i }),
    ).not.toHaveAccessibleErrorMessage();

    await user.click(screen.getByLabelText(/^avatar$/i));

    expect(
      screen.getByRole("group", { name: /^select your hobbies$/i }),
    ).not.toHaveAccessibleErrorMessage();
  });

  it("Expect a validated form to have its values submitted", async () => {
    const name = "Paul Smith";
    const age = "30";
    const email = "abc@mail.com";

    const { user } = renderFn();

    await user.type(screen.getByRole("textbox", { name: /^name$/i }), name);
    await user.type(screen.getByRole("spinbutton", { name: /^age$/i }), age);
    await user.type(screen.getByRole("textbox", { name: /^e-mail$/i }), email);
    await user.click(screen.getByRole("radio", { name: /^mr$/i }));
    await user.click(screen.getByRole("checkbox", { name: /^movies$/i }));
    await user.click(screen.getByRole("checkbox", { name: /^cycling$/i }));
    await user.click(screen.getByRole("checkbox", { name: /^running$/i }));
    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    expect(await screen.findByLabelText(/^form values$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^form values$/i)).toHaveTextContent(
      `Name is Mr ${name}`,
    );

    expect(screen.getByLabelText(/^form values$/i)).toHaveTextContent(
      `Age is ${age}`,
    );

    expect(screen.getByLabelText(/^form values$/i)).toHaveTextContent(
      `E-mail address is ${email}`,
    );

    expect(screen.getByLabelText(/^form values$/i)).toHaveTextContent(
      `Hobbies are movies, cycling, running`,
    );
  });
});
