import { useContext } from "react";
import { DialogContext } from "@contexts/Dialog";

export const useDialog = () => {
  const value = useContext(DialogContext);

  if (!value) {
    throw new ReferenceError("Dialog context provider not available");
  }

  return value;
};
