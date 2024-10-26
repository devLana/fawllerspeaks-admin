import Container from "@mui/material/Container";

import Loader from "@layouts/components/Loader";
import Metadata from "@layouts/components/Metadata";
import ErrorAlert from "@layouts/components/ErrorAlert";
import AuthLayoutThemeButton from "./components/AuthLayoutThemeButton";
import type { RootLayoutProps } from "types/layouts";

const AuthRootLayout = (props: RootLayoutProps) => {
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
      aria-live="polite"
      aria-busy={!clientHasRendered}
      sx={{
        minHeight: "100vh",
        pt: "7rem",
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

export default AuthRootLayout;
