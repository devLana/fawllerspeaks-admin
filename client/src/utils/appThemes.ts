import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import NightsStayTwoToneIcon from "@mui/icons-material/NightsStayTwoTone";

import type { ThemeMode, CapitalizeThemeMode, MuiIconType } from "@types";

export interface AppThemeItem {
  id: ThemeMode;
  name: CapitalizeThemeMode;
  Icon: MuiIconType;
}

export const themes: [AppThemeItem, AppThemeItem, AppThemeItem] = [
  { id: "sunny", name: "Sunny", Icon: WbSunnyIcon },
  { id: "sunset", name: "Sunset", Icon: WbTwilightIcon },
  { id: "pitch black", name: "Pitch Black", Icon: NightsStayTwoToneIcon },
];

export const normalizedThemes: Record<ThemeMode, AppThemeItem> = {
  sunny: themes[0],
  sunset: themes[1],
  "pitch black": themes[2],
};
