import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

export const settingsLinks = [
  {
    to: "/settings/password",
    Icon: VpnKeyOutlinedIcon,
    label: "Change password",
  },
  {
    to: "/settings/me",
    Icon: PersonOutlineOutlinedIcon,
    label: "Profile",
  },
  {
    to: "/settings/personalization",
    Icon: TuneRoundedIcon,
    label: "Personalization",
  },
] as const;
