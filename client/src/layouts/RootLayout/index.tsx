import * as React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import Metadata from "@components/Metadata";
import Loader from "@components/Loader";
import ErrorAlert from "@components/ErrorAlert";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import PageBreadcrumbs from "./components/PageBreadcrumbs";
import { type RootLayoutProps } from "@types";

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
        columnGap: { sm: 5 },
      }}
    >
      <Metadata {...metaProps} />
      <Header onClick={() => setNavBarIsOpen(true)} />
      <Navbar
        isOpen={navBarIsOpen}
        onToggleNav={() => setNavBarIsOpen(!navBarIsOpen)}
        onCloseNav={() => setNavBarIsOpen(false)}
      />
      <Box component="main" py={4} flexGrow={{ sm: 1 }}>
        {content}
      </Box>
    </Container>
  );
};

export default RootLayout;
