import TestLayout from "@layouts/TestLayout";
import type { PageLayoutFn } from "@types";

const testLayout: PageLayoutFn = (page, clientHasRendered, errorMessage) => (
  <TestLayout clientHasRendered={clientHasRendered} errorMessage={errorMessage}>
    {page}
  </TestLayout>
);

export default testLayout;
