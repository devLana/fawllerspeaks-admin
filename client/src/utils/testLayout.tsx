import TestLayout from "@layouts/TestLayout";
import type { PageLayout } from "@types";

const testLayout: PageLayout = (page, clientHasRendered, errorMessage) => (
  <TestLayout clientHasRendered={clientHasRendered} errorMessage={errorMessage}>
    {page}
  </TestLayout>
);

export default testLayout;
