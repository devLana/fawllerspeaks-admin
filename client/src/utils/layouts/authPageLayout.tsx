import type { NextPage } from "next";

import AuthRootLayout from "@layouts/AuthRootLayout";
import type { MetadataProps } from "@appTypes";

const authPageLayout = <P extends object = object>(
  Page: NextPage<P>,
  metadata: MetadataProps
) => {
  const AuthPageLayout = (pageProps: P) => (
    <AuthRootLayout {...metadata}>
      <Page {...pageProps} />
    </AuthRootLayout>
  );

  return AuthPageLayout;
};

export default authPageLayout;
