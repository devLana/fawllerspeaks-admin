import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import NextLink from "@components/NextLink";

interface PaginationLinkProps {
  href: string | undefined;
  children: React.ReactNode;
  ml?: string;
}

const PaginationLink = ({ children, href, ml }: PaginationLinkProps) => {
  const { query: queryParams } = useRouter();
  const { q, "post-tag": postTag, status, sort } = queryParams;

  const query = {
    ...(typeof q === "string" && { q }),
    ...(typeof postTag === "string" && { "post-tag": postTag }),
    ...(typeof status === "string" && { status }),
    ...(typeof sort === "string" && { sort }),
  };

  const styles = { display: "inline-flex", alignItems: "center", columnGap: 1 };

  if (href) {
    return (
      <NextLink ml={ml} href={{ pathname: href, query }} {...styles}>
        {children}
      </NextLink>
    );
  }

  return (
    <Button
      variant="text"
      disabled
      sx={{ ml, ...styles, font: "inherit", fontStyle: "oblique" }}
    >
      {children}
    </Button>
  );
};

export default PaginationLink;
