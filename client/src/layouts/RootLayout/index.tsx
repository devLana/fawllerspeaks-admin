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

  const handleOpenNavbar = () => setNavBarIsOpen(true);
  const handleCloseNavbar = () => setNavBarIsOpen(false);
  const handleToggleNavbar = () => setNavBarIsOpen(!navBarIsOpen);

  return (
    <Container
      sx={{
        minHeight: "100vh",
        paddingTop: "56px",
        pt: { sm: "64px" },
        display: { sm: "flex" },
        columnGap: { sm: 4 },
      }}
    >
      <Metadata {...metaProps} />
      <Header onClick={handleOpenNavbar} />
      <Navbar
        isOpen={navBarIsOpen}
        onToggleNav={handleToggleNavbar}
        onCloseNav={handleCloseNavbar}
      />
      <Box component="main" py={4} flexGrow={{ sm: 1 }}>
        {content}
      </Box>
    </Container>
  );
};

export default RootLayout;
