import { createContext } from "react";
import type { ToastOptions } from "@appTypes/toast";

type ToastHandler = (toastOptions: ToastOptions) => void;

export const ToastContext = createContext<ToastHandler | null>(null);
