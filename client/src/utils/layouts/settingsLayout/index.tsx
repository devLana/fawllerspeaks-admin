import RootLayout from "@layouts/RootLayout";
import SettingsLayout from "@layouts/SettingsLayout";
import type { MetaDataProps } from "types/layouts";
import type { PageLayoutFn } from "@types";

export const settingsLayout = (
  pageHeading: string,
  rootLayoutMetaProps: MetaDataProps
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
