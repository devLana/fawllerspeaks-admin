import type { SnackbarCloseReason } from "@mui/material/Snackbar";
import type { StateSetterFn } from "@types";

export const handleCloseAlert = <T>(
  value: T,
  setter: StateSetterFn<NoInfer<T>>
) => {
  return (_: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setter(value);
  };
};
