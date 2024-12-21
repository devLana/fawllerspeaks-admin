import PostAddIcon from "@mui/icons-material/PostAdd";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import type { NavbarButtonItem, NavbarLinkItem } from "types/layouts/navbar";

interface LinkItem extends NavbarLinkItem {
  type: "link";
}

interface ButtonItem extends NavbarButtonItem {
  type: "button";
}

export const navbarItems: (LinkItem | ButtonItem)[] = [
  {
    type: "link",
    href: "/posts/new",
    isPrimary: true,
    label: "New Post",
    Icon: PostAddIcon,
  },
  {
    type: "link",
    href: "/",
    label: "Dashboard",
    Icon: SpaceDashboardOutlinedIcon,
  },
  { type: "link", href: "/posts", label: "Posts", Icon: ListAltIcon },
  {
    type: "link",
    href: "/post-tags",
    label: "Post Tags",
    Icon: StyleOutlinedIcon,
  },
  { type: "link", href: "/posts/bin", label: "Bin", Icon: DeleteOutlinedIcon },
  {
    type: "link",
    href: "/settings",
    label: "Settings",
    Icon: SettingsOutlinedIcon,
  },
  { type: "button", label: "Logout", Icon: ExitToAppRoundedIcon },
];
