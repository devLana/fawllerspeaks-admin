import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { DialogContext } from "@contexts/Dialog";
import Up from "@components/SlideTransitions/Up";
import type { DialogOptions } from "@appTypes/dialog";

const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    content: null,
    cancelText: "Cancel",
    confirmText: "Confirm",
    onConfirm: () => undefined,
  });

  const handleClose = () => setIsOpen(false);

  const handleConfirm = () => {
    setIsLoading(true);

    (async () => {
      await options.onConfirm(function () {
        setIsLoading(false);
        handleClose();
      });
    })();
  };

  const showDialog = (dialogOptions: DialogOptions) => {
    setIsOpen(true);
    setOptions({ ...options, ...dialogOptions });
  };

  return (
    <DialogContext.Provider value={showDialog}>
      {children}
      <Dialog
        open={isOpen}
        onClose={isLoading ? undefined : handleClose}
        role={options.role}
        aria-labelledby={options.title ? "dialog-title" : undefined}
        aria-describedby={options.ariaDescribedBy}
        slots={{ transition: Up }}
        transitionDuration={{ enter: 220, exit: 100 }}
        sx={{
          '&>div[class^="MuiBackdrop-root"]': { backdropFilter: "blur(4px)" },
        }}
      >
        {options.title && (
          <DialogTitle id="dialog-title">{options.title}</DialogTitle>
        )}
        <DialogContent dividers={options.contentDividers}>
          {options.content}
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={handleClose}>
            {options.cancelText}
          </Button>
          <Button
            variant="outlined"
            loading={isLoading}
            color={options.showConfirmAsError ? "error" : undefined}
            onClick={handleConfirm}
          >
            {options.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};

export default DialogProvider;
