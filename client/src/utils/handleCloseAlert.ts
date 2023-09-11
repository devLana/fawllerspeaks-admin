import type { SnackbarCloseReason } from "@mui/material/Snackbar";

export const handleCloseAlert = <T>(
  value: T,
  setter: React.Dispatch<React.SetStateAction<T>>
) => {
  return (_: React.SyntheticEvent | Event, reason: SnackbarCloseReason) => {
    if (reason === "clickaway") return;
    setter(value);
  };
};
