import { SessionContext } from "@contexts/Session";
import DialogProvider from "@providers/Dialog";
import { renderUI } from ".";
import {
  handleRefreshToken,
  handleClearRefreshTokenTimer,
  type TestRenderOpts,
} from "../sessionMocks";

export const protectedTestUI = <D extends object, V extends object>(
  ui: React.ReactElement,
  options: TestRenderOpts<D, V> = {},
) => {
  const UI = (
    <DialogProvider>
      <SessionContext.Provider
        value={{ handleRefreshToken, handleClearRefreshTokenTimer }}
      >
        {ui}
      </SessionContext.Provider>
    </DialogProvider>
  );

  return renderUI(UI, options);
};
