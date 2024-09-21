import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import useErrorPageData from "@hooks/useErrorPageData";
import NextLink from "@components/NextLink";
import ErrorPageLayout from "@layouts/components/ErrorPageLayout";
import uiLayout from "@utils/layouts/uiLayout";
import type { NextPageWithLayout } from "@types";

const NotFound: NextPageWithLayout = () => {
  const { href, label } = useErrorPageData();

  return (
    <Box sx={{ textAlign: "center", maxWidth: 700, mx: "auto" }}>
      <Typography variant="h1" gutterBottom>
        404 - Page not found
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Sorry! We could not find the page you are looking for.
      </Typography>
      <NextLink href={href}>{label}</NextLink>
    </Box>
  );
};

NotFound.layout = uiLayout(ErrorPageLayout, {
  title: "404: This Page Could Not Be Found",
});

export default NotFound;
