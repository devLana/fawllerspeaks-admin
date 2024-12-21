import type { MuiIconType } from "@types";

export interface NavbarLinkItem {
  href: string;
  isPrimary?: true;
  label: string;
  Icon: MuiIconType;
}

export interface NavbarButtonItem {
  label: string;
  Icon: MuiIconType;
}
