import type { NextPage } from "next";

import SessionProvider from "@providers/Session";
import AuthRootLayout from "@layouts/AuthRootLayout";
import Loader from "@layouts/components/Loader";
import ErrorAlert from "@layouts/components/ErrorAlert";
import type { PageLayoutFn, MetadataProps } from "@appTypes";

const registerUserLayout = <P extends object = object>(
  Page: NextPage<P>,
  pageMetadata: MetadataProps,
) => {
  return function AuthPageLayout(pageProps: P) {
    const layout: PageLayoutFn = (page, isVerifying, errorMessage) => {
      let content: React.ReactElement;

      if (isVerifying) {
        content = <Loader />;
      } else if (errorMessage) {
        content = <ErrorAlert message={errorMessage} />;
      } else {
        content = page;
      }

      return <AuthRootLayout {...pageMetadata}>{content}</AuthRootLayout>;
    };

    return <SessionProvider layout={layout} page={<Page {...pageProps} />} />;
  };
};

export default registerUserLayout;
