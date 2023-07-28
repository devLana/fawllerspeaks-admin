import { useRouter } from "next/router";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NextLink from "@components/NextLink";

const PageBreadcrumbs = () => {
  const { pathname } = useRouter();

  const pathnames = pathname.split("/").filter(Boolean);

  if (pathnames.length < 2) return null;

  const crumbs = pathnames.map((path, index, pathnamesArr) => {
    const href = `/${pathnamesArr.slice(0, index + 1).join("/")}`;
    const label = path
      .split(/[\s_-]/)
      .map(str => {
        const checkFirstCharacter = /[a-z]/i.test(str.charAt(0));

        if (!checkFirstCharacter) return str;

        return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
      })
      .join(" ");

    return index === pathnamesArr.length - 1 ? (
      <Typography key={href}>{label}</Typography>
    ) : (
      <NextLink key={href} href={href}>
        {label}
      </NextLink>
    );
  });

  return (
    <Breadcrumbs
      separator={<ChevronRightIcon fontSize="small" />}
      maxItems={2}
      aria-label="Breadcrumb"
      sx={{ mb: 4 }}
    >
      {crumbs}
    </Breadcrumbs>
  );
};

export default PageBreadcrumbs;
