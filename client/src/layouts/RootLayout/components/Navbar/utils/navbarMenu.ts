import PostAddIcon from "@mui/icons-material/PostAdd";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";

export const topLinks = [
  {
    primary: true,
    href: "/posts/new",
    label: "New Post",
    Icon: PostAddIcon,
  },
  {
    primary: false,
    href: "/",
    label: "Dashboard",
    Icon: SpaceDashboardOutlinedIcon,
  },
] as const;

export const postLinks = [
  {
    href: "/posts",
    label: "Posts",
    Icon: ListAltIcon,
  },
  {
    href: "/post-tags",
    label: "Post Tags",
    Icon: StyleOutlinedIcon,
  },
  {
    href: "/posts/bin",
    label: "Bin",
    Icon: DeleteOutlinedIcon,
  },
] as const;

export const otherLinks = [
  {
    type: "link",
    href: "/settings",
    label: "Settings",
    Icon: SettingsOutlinedIcon,
  },
  {
    type: "button",
    label: "Logout",
    Icon: ExitToAppRoundedIcon,
  },
] as const;
