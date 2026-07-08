import { useCallback, useState } from "react";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";

import { ToastContext } from "@contexts/Toast";
import Up from "@components/SlideTransitions/Up";
import type { SxPropArray } from "@appTypes";
import type { ToastOptions } from "@appTypes/toast";

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ToastOptions>({
    content: null,
    key: undefined,
    autoHideDuration: 6000,
    transition: Up,
  });

  const showToast = useCallback((toastOptions: ToastOptions) => {
    setIsOpen(true);
    setOptions(opts => ({ ...opts, ...toastOptions }));
  }, []);

  const snackbarSxProp: SxPropArray = Array.isArray(options.snackbarSx)
    ? options.snackbarSx
    : [options.snackbarSx];

  const alertSxProp: SxPropArray = Array.isArray(options.alertSx)
    ? options.alertSx
    : [options.alertSx];

  const handleSnackbarClose = (
    _: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") return;
    setIsOpen(false);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Snackbar
        open={isOpen}
        anchorOrigin={options.placement}
        autoHideDuration={options.autoHideDuration}
        onClose={handleSnackbarClose}
        slots={{ transition: options.transition }}
        sx={snackbarSxProp}
        key={options.key}
      >
        <Alert
          variant={options.variant}
          severity={options.severity}
          role={options.role}
          icon={options.icon}
          action={options.action}
          onClose={options.alertCanClose ? () => setIsOpen(false) : undefined}
          sx={[{ width: "100%" }, ...alertSxProp]}
        >
          {options.alertTitle && <AlertTitle>{options.alertTitle}</AlertTitle>}
          {options.content}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
