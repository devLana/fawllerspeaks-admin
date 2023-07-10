import * as React from "react";
import NextJsLink, { type LinkProps as NextJsLinkProps } from "next/link";
import MuiLink, { type LinkProps as MuiLinkProps } from "@mui/material/Link";

type NextLinkProps = NextJsLinkProps & Omit<MuiLinkProps, "href">;

interface NextLinkRefProps extends Omit<NextJsLinkProps, "href"> {
  to: NextJsLinkProps["href"];
}

const NextLinkRef = React.forwardRef<HTMLAnchorElement, NextLinkRefProps>(
  function NextLinkRefBase({ to, ...props }, ref) {
    return <NextJsLink href={to} ref={ref} {...props} />;
  }
);

const NextLink = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  function NextLinkBase({ href, ...props }, ref) {
    return <MuiLink ref={ref} component={NextLinkRef} to={href} {...props} />;
  }
);

export default NextLink;
