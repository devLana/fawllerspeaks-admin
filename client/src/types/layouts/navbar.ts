import type { MuiIconType } from "@appTypes";

export interface NavbarButtonItem {
  label: string;
  Icon: MuiIconType;
}

export interface NavbarLinkItem extends NavbarButtonItem {
  href: string;
  isPrimary?: true;
}
