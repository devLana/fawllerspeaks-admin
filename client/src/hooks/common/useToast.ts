import { useContext } from "react";
import { ToastContext } from "@contexts/Toast";

export const useToast = () => {
  const value = useContext(ToastContext);

  if (!value) {
    throw new ReferenceError("Toast context provider not available");
  }

  return value;
};
