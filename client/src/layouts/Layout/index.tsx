import * as React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import useCheckAuth from "@hooks/useCheckAuth";
import Metadata, { type MetaInfo } from "@components/Metadata";
import Loader from "@components/Loader";
import ErrorAlert from "@components/ErrorAlert";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import transition from "./utils/transition";

interface LayoutProps extends MetaInfo {
  children: React.ReactElement;
  clientHasRendered: boolean;
  errorMessage: string | null;
}

const drawerWidth = "13.75rem";
const smDrawerWidth = "4.0625rem";

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
    <Box
      sx={{
        minHeight: "100vh",
        pt: "5rem",
        pb: "4rem",
        width: {
          sm: `calc(100% - ${navBarIsOpen ? drawerWidth : smDrawerWidth})`,
        },
        ml: { sm: navBarIsOpen ? drawerWidth : smDrawerWidth },
        transition: theme => ({
          sm: transition(theme, navBarIsOpen, ["width", "margin-left"]),
        }),
      }}
    >
      <Metadata {...metaProps} />
      <Header
        isOpen={navBarIsOpen}
        smDrawerWidth={smDrawerWidth}
        drawerWidth={drawerWidth}
        onClick={handleOpenNavbar}
      />
      <Navbar
        smDrawerWidth={smDrawerWidth}
        drawerWidth={drawerWidth}
        isOpen={navBarIsOpen}
        onToggle={handleToggleNavbar}
        setNavBarIsOpen={setNavBarIsOpen}
      />
      <main>
        <Container>{content}</Container>
      </main>
    </Box>
  );
};

export default Layout;
