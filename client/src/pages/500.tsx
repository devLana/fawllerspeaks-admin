import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import useErrorPageData from "@hooks/useErrorPageData";
import NextLink from "@components/NextLink";
import ErrorPageLayout from "@layouts/components/ErrorPageLayout";
import uiLayout from "@layouts/utils/uiLayout";
import type { NextPageWithLayout } from "@types";

const ServerError: NextPageWithLayout = () => {
  const { href, label } = useErrorPageData();

  return (
    <Box textAlign="center" maxWidth={700} mx="auto">
      <Typography variant="h1" gutterBottom>
        500 - Internal server error
      </Typography>
      <Typography mb={3}>
        Something has gone wrong! An error has occurred and you cant perform
        that action. Please try again later.
      </Typography>
      <NextLink href={href}>{label}</NextLink>
    </Box>
  );
};

ServerError.layout = uiLayout(ErrorPageLayout, {
  title: "500: A Server Error Has Occurred",
});

export default ServerError;
