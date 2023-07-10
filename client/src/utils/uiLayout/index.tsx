import type { MetaInfo } from "@components/Metadata";
import type { PageLayout } from "@types";

type Keys = "children" | "clientHasRendered" | "errorMessage";

interface UILayoutProps extends MetaInfo {
  errorMessage: string | null;
  clientHasRendered: boolean;
  children: React.ReactElement;
}

const uiLayout = (
  UILayout: React.FC<UILayoutProps>,
  uiLayoutProps: Omit<UILayoutProps, Keys>
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
