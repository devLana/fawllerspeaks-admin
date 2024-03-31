import RootLayout from "@layouts/RootLayout";
import SettingsLayout from "@layouts/SettingsLayout";
import { type MetaInfo } from "@components/Metadata";
import type { PageLayoutFn } from "@types";

export const settingsLayout = (
  pageHeading: string,
  rootLayoutMetaProps: MetaInfo
): PageLayoutFn => {
  return function layout(page, clientHasRendered, errorMessage) {
    return (
      <RootLayout
        clientHasRendered={clientHasRendered}
        errorMessage={errorMessage}
        {...rootLayoutMetaProps}
      >
        <SettingsLayout pageHeading={pageHeading}>{page}</SettingsLayout>
      </RootLayout>
    );
  };
};

export default settingsLayout;
