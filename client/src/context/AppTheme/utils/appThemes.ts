import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import NightsStayTwoToneIcon from "@mui/icons-material/NightsStayTwoTone";

import type { AppThemeItem } from "@context/AppTheme/types";

export const appThemes: [AppThemeItem, AppThemeItem, AppThemeItem] = [
  { id: "sunny", name: "Sunny", Icon: WbSunnyIcon },
  { id: "sunset", name: "Sunset", Icon: WbTwilightIcon },
  { id: "pitch black", name: "Pitch Black", Icon: NightsStayTwoToneIcon },
];
