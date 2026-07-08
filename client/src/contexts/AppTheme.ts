import { createContext } from "react";
import type { AppThemeHandler } from "@appTypes/appTheme";

type AppThemeValue = AppThemeHandler;

export const AppThemeContext = createContext<AppThemeValue | null>(null);
