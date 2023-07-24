import Loader from "@components/Loader";
import ErrorAlert from "@components/ErrorAlert";

interface TestLayoutProps {
  children: React.ReactElement;
  clientHasRendered: boolean;
  errorMessage: string | null;
}

const TestLayout = (props: TestLayoutProps) => {
  if (!props.clientHasRendered) return <Loader />;

  if (props.errorMessage) return <ErrorAlert message={props.errorMessage} />;

  return <div>{props.children}</div>;
};

export default TestLayout;
