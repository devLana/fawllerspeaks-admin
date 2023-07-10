import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import NightsStayTwoToneIcon from "@mui/icons-material/NightsStayTwoTone";

import type { AppTheme, CapitalizeAppTheme, MuiIconType } from "@types";

interface ThemeItem {
  id: AppTheme;
  name: CapitalizeAppTheme;
  Icon: MuiIconType;
}

export const themes: [ThemeItem, ThemeItem, ThemeItem] = [
  { id: "sunny", name: "Sunny", Icon: WbSunnyIcon },
  { id: "sunset", name: "Sunset", Icon: WbTwilightIcon },
  { id: "pitch black", name: "Pitch Black", Icon: NightsStayTwoToneIcon },
];

export const normalizedThemes: Record<AppTheme, ThemeItem> = {
  sunny: themes[0],
  sunset: themes[1],
  "pitch black": themes[2],
};
