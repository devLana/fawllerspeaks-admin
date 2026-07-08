import { forwardRef } from "react";
import NextJsLink, { type LinkProps as NextJsLinkProps } from "next/link";
import MuiLink, { type LinkProps as MuiLinkProps } from "@mui/material/Link";

export type NextLinkProps = NextJsLinkProps & Omit<MuiLinkProps, "href">;

interface NextLinkRefProps extends Omit<NextJsLinkProps, "href"> {
  to: NextJsLinkProps["href"];
}

const NextLinkRef = forwardRef<HTMLAnchorElement, NextLinkRefProps>(
  function NextLinkRefBase({ to, ...props }, ref) {
    return <NextJsLink href={to} ref={ref} {...props} />;
  },
);

const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>(
  function NextLinkBase({ href, sx = [], ...props }, ref) {
    const sxProp: NextLinkProps["sx"] = Array.isArray(sx) ? sx : [sx];

    return (
      <MuiLink
        ref={ref}
        component={NextLinkRef}
        to={href}
        underline="none"
        sx={[
          ({ appTheme, palette, transitions }) => ({
            transition: transitions.create("color"),
            ":hover": {
              color:
                appTheme.themeMode === "sunny"
                  ? palette.primary.dark
                  : appTheme.themeMode === "sunset"
                    ? palette.primary.light
                    : palette.primary.light,
            },
          }),
          ...sxProp,
        ]}
        {...props}
      />
    );
  },
);

export default NextLink;
