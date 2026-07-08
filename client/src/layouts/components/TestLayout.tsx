import ErrorAlert from "./ErrorAlert";
import Loader from "./Loader";

interface TestLayoutProps {
  children: React.ReactElement;
  isVerifying: boolean;
  errorMessage: string | null;
}

const TestLayout = (props: TestLayoutProps) => {
  if (props.isVerifying) return <Loader />;

  if (props.errorMessage) return <ErrorAlert message={props.errorMessage} />;

  return <div>{props.children}</div>;
};

export default TestLayout;
