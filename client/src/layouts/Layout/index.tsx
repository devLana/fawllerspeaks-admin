import * as React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import useCheckAuth from "@hooks/useCheckAuth";
import Metadata, { type MetaInfo } from "@components/Metadata";
import Loader from "@components/Loader";
import ErrorAlert from "@components/ErrorAlert";
import Navbar from "./components/Navbar";
import Header from "./components/Header";

interface LayoutProps extends MetaInfo {
  children: React.ReactElement;
  clientHasRendered: boolean;
  errorMessage: string | null;
}

const Layout = (props: LayoutProps) => {
  const [navBarIsOpen, setNavBarIsOpen] = React.useState(false);

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
        pt: "4rem",
        [theme.breakpoints.up("sm")]: { display: "flex", columnGap: "2rem" },
      })}
    >
      <Metadata {...metaProps} />
      <Header onClick={handleOpenNavbar} />
      <Navbar
        isOpen={navBarIsOpen}
        onToggle={handleToggleNavbar}
        setNavBarIsOpen={setNavBarIsOpen}
      />
      <main>
        <Box>{content}</Box>
      </main>
    </Container>
  );
};

export default Layout;
