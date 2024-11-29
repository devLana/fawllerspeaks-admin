import { useRouter } from "next/router";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NextLink from "@components/ui/NextLink";

const PageBreadcrumbs = () => {
  const { pathname, asPath } = useRouter();
  let pathnames: string[];

  if (pathname === "/404" || pathname === "/500") return null;

  if (/\[(?:\.\.\.)?[\w-]+\]/.test(pathname)) {
    if (pathname === "/posts/[[...postsPage]]") return null;

    if (/^\/posts\/(?:edit|view)/.test(pathname)) {
      const asPathStr = asPath.replace(/^\/posts\/(?:edit|view)/, "/posts");
      pathnames = asPathStr.split("/").filter(Boolean);
    } else {
      pathnames = asPath.split("/").filter(Boolean);
    }
  } else {
    pathnames = pathname.split("/").filter(Boolean);
  }

  if (pathnames.length < 2) return null;

  const crumbs = pathnames.map((path, index, pathnamesArr) => {
    const label = path
      .split(/[\s_-]/)
      .map(str => `${str.charAt(0).toUpperCase()}${str.substring(1)}`)
      .join(" ");

    if (index === pathnamesArr.length - 1) {
      return <Typography key={path}>{label}</Typography>;
    }

    const href = `/${pathnamesArr.slice(0, index + 1).join("/")}`;

    return (
      <NextLink key={href} href={href}>
        {label}
      </NextLink>
    );
  });

  return (
    <Breadcrumbs
      separator={<ChevronRightIcon fontSize="small" />}
      aria-label="Breadcrumb"
      sx={{ mb: 4 }}
    >
      {crumbs}
    </Breadcrumbs>
  );
};

export default PageBreadcrumbs;
