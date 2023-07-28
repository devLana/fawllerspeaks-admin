import { type MetaInfo } from "@components/Metadata";
import type { PageLayout, RootLayoutProps } from "@types";

const uiLayout = (
  UILayout: React.FC<RootLayoutProps>,
  uiLayoutProps: MetaInfo
): PageLayout => {
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
