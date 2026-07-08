import type { NextPage } from "next";

import Typography from "@mui/material/Typography";

import AuthRootLayout from "@layouts/AuthRootLayout";
import type { MetadataProps } from "@appTypes";

const authPageLayout = <P extends object = object>(
  Page: NextPage<P>,
  pageMetadata: MetadataProps & { pageTitle: string },
) => {
  const AuthPageLayout = (pageProps: P) => {
    const { pageTitle, ...metadata } = pageMetadata;

    return (
      <AuthRootLayout {...metadata}>
        <Typography variant="h1" id="page-title">
          {pageTitle}
        </Typography>
        <Page {...pageProps} />
      </AuthRootLayout>
    );
  };

  return AuthPageLayout;
};

export default authPageLayout;
