import { createContext } from "react";
import type { DialogOptions } from "@appTypes/dialog";

type DialogHandler = (dialogOptions: DialogOptions) => void;

export const DialogContext = createContext<DialogHandler | null>(null);
