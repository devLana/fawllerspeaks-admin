import * as React from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import useCheckAuth from "@hooks/useCheckAuth";
import Metadata from "@components/Metadata";
import Loader from "@components/Loader";
import ErrorAlert from "@components/ErrorAlert";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import PageBreadcrumbs from "./components/PageBreadcrumbs";
import { type RootLayoutProps } from "@types";

const RootLayout = (props: RootLayoutProps) => {
  const [navBarIsOpen, setNavBarIsOpen] = React.useState(false);
  const { pathname } = useRouter();

  useCheckAuth();

  const { children, clientHasRendered, errorMessage, ...metaProps } = props;
  let content: React.ReactElement;

  if (!clientHasRendered) {
    content = <Loader />;
  } else if (errorMessage) {
    content = <ErrorAlert message={errorMessage} />;
  } else {
    content = children;
  }

  const handleOpenNavbar = () => setNavBarIsOpen(true);
  const handleToggleNavbar = () => setNavBarIsOpen(!navBarIsOpen);

  return (
    <Container
      sx={theme => ({
        minHeight: "100vh",
        pt: "56px",
        [theme.breakpoints.up("sm")]: {
          pt: "64px",
          display: "flex",
          columnGap: 4,
        },
      })}
    >
      <Metadata {...metaProps} />
      <Header onClick={handleOpenNavbar} />
      <Navbar isOpen={navBarIsOpen} onClick={handleToggleNavbar} />
      <Box
        sx={{
          mx: { xs: "auto", sm: 0 },
          py: 4,
          flexGrow: { sm: 1 },
          ...(pathname === "/settings/password" && {
            maxWidth: { xs: 500, md: "none" },
          }),
        }}
      >
        <PageBreadcrumbs />
        <main>{content}</main>
      </Box>
    </Container>
  );
};

export default RootLayout;
