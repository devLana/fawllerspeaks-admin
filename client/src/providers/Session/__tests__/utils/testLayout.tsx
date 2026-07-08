import TestLayout from "@layouts/components/TestLayout";
import type { PageLayoutFn } from "@appTypes";

const testLayout: PageLayoutFn = (page, isVerifying, errorMessage) => (
  <TestLayout isVerifying={isVerifying} errorMessage={errorMessage}>
    {page}
  </TestLayout>
);

export default testLayout;
