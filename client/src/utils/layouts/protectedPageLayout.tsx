import type { NextPage } from "next";

import DialogProvider from "@providers/Dialog";
import SessionProvider from "@providers/Session";
import RootLayout from "@layouts/RootLayout";
import type { PageLayoutFn, MetadataProps } from "@appTypes";

const protectedPageLayout = <P extends object = object>(
  Page: NextPage<P>,
  pageMetadata: MetadataProps,
) => {
  return function ProtectedPageLayout(pageProps: P) {
    const layout: PageLayoutFn = (page, isVerifying, errorMessage) => (
      <RootLayout
        isVerifying={isVerifying}
        errorMessage={errorMessage}
        {...pageMetadata}
      >
        {page}
      </RootLayout>
    );

    return (
      <DialogProvider>
        <SessionProvider layout={layout} page={<Page {...pageProps} />} />;
      </DialogProvider>
    );
  };
};

export default protectedPageLayout;
