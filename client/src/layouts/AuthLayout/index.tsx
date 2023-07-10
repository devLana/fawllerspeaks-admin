import Container from "@mui/material/Container";

import useCheckAuth from "@hooks/useCheckAuth";
import Loader from "@components/Loader";
import Metadata, { type MetaInfo } from "@components/Metadata";
import ErrorAlert from "@features/auth/components/ErrorAlert";
import AuthLayoutThemeButton from "./components/AuthLayoutThemeButton";

interface AuthLayoutProps extends MetaInfo {
  clientHasRendered: boolean;
  errorMessage: string | null;
  children: React.ReactElement;
}

const AuthLayout = (props: AuthLayoutProps) => {
  useCheckAuth();

  const { children, clientHasRendered, errorMessage, ...metaProps } = props;
  let content: React.ReactElement;

  if (!clientHasRendered) {
    content = <Loader />;
  } else if (errorMessage) {
    content = <ErrorAlert message={errorMessage} />;
  } else {
    content = (
      <>
        <AuthLayoutThemeButton />
        {children}
      </>
    );
  }

  return (
    <Container
      sx={{
        minHeight: "100vh",
        pt: "9rem",
        pb: "4rem",
        display: "flex",
        flexDirection: "column",
        rowGap: "1.5rem",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Metadata {...metaProps} />
      {content}
    </Container>
  );
};

export default AuthLayout;
