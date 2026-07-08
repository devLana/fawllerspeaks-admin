import type { NextPage } from "next";

import DialogProvider from "@providers/Dialog";
import SessionProvider from "@providers/Session";
import RootLayout from "@layouts/RootLayout";
import SettingsLayout from "@layouts/SettingsLayout";
import type { PageLayoutFn, MetadataProps } from "@appTypes";

export const settingsPageLayout = <P extends object = object>(
  Page: NextPage<P>,
  pageHeading: string,
  metadataProps: MetadataProps,
) => {
  return function ProtectedPageLayout(pageProps: P) {
    const layout: PageLayoutFn = (page, isVerifying, errorMessage) => (
      <RootLayout
        isVerifying={isVerifying}
        errorMessage={errorMessage}
        {...metadataProps}
      >
        <SettingsLayout pageHeading={pageHeading}>{page}</SettingsLayout>
      </RootLayout>
    );

    return (
      <DialogProvider>
        <SessionProvider layout={layout} page={<Page {...pageProps} />} />;
      </DialogProvider>
    );
  };
};

export default settingsPageLayout;
