import * as React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import Metadata from "@layouts/components/Metadata";
import Loader from "@layouts/components/Loader";
import ErrorAlert from "@layouts/components/ErrorAlert";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import PageBreadcrumbs from "./components/PageBreadcrumbs";
import type { RootLayoutProps } from "types/layouts";

const RootLayout = (props: RootLayoutProps) => {
  const { children, clientHasRendered, errorMessage, ...metaProps } = props;
  const [navBarIsOpen, setNavBarIsOpen] = React.useState(false);

  let content: React.ReactElement;

  if (!clientHasRendered) {
    content = <Loader />;
  } else if (errorMessage) {
    content = <ErrorAlert message={errorMessage} sx={{ mt: 4 }} />;
  } else {
    content = (
      <>
        <PageBreadcrumbs />
        {children}
      </>
    );
  }

  return (
    <Container
      sx={{
        minHeight: "100vh",
        paddingTop: 7,
        pt: { sm: 8 },
        display: { sm: "flex" },
        columnGap: { sm: 3.75 },
      }}
    >
      <Metadata {...metaProps} />
      <Header
        onClick={() => setNavBarIsOpen(true)}
        isLoading={!clientHasRendered}
      />
      <Navbar
        isOpen={navBarIsOpen}
        isLoading={!clientHasRendered}
        onToggleNav={() => setNavBarIsOpen(!navBarIsOpen)}
        onCloseNav={() => setNavBarIsOpen(false)}
      />
      <Box
        component="main"
        aria-live="polite"
        aria-busy={!clientHasRendered}
        sx={{ py: 4, flexGrow: { sm: 1 }, minWidth: { sm: 0 } }}
      >
        {content}
      </Box>
    </Container>
  );
};

export default RootLayout;
