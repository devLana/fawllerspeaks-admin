import { type MetaInfo } from "@components/Metadata";
import type { PageLayoutFn, RootLayoutProps } from "@types";

const uiLayout = (
  UILayout: React.FC<RootLayoutProps>,
  uiLayoutProps: MetaInfo
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
