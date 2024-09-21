import type { PageLayoutFn } from "@types";
import type { MetaDataProps, RootLayoutProps } from "types/layouts";

const uiLayout = (
  UILayout: React.FC<RootLayoutProps>,
  uiLayoutProps: MetaDataProps
): PageLayoutFn => {
  return function layout(page, clientHasRendered, errorMessage) {
    return (
      <UILayout
        clientHasRendered={clientHasRendered}
        errorMessage={errorMessage}
        {...uiLayoutProps}
      >
        {page}
      </UILayout>
    );
  };
};

export default uiLayout;
