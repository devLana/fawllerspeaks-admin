import * as React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import useCheckAuth from "@hooks/useCheckAuth";
import Metadata, { type MetaInfo } from "@components/Metadata";
import Loader from "@components/Loader";
import ErrorAlert from "@features/auth/components/ErrorAlert";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import transition from "./transition";

interface LayoutProps extends MetaInfo {
  children: React.ReactElement;
  clientHasRendered: boolean;
  errorMessage: string | null;
}

const drawerWidth = "13.75rem";
const smDrawerWidth = "4.0625rem";

const Layout = (props: LayoutProps) => {
  const [sideBarIsOpen, setSideBarIsOpen] = React.useState(false);

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

  const handleOpenSidebar = () => setSideBarIsOpen(true);
  const handleToggleSidebar = () => setSideBarIsOpen(!sideBarIsOpen);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: "5rem",
        pb: "4rem",
        width: {
          sm: `calc(100% - ${sideBarIsOpen ? drawerWidth : smDrawerWidth})`,
        },
        ml: { sm: sideBarIsOpen ? drawerWidth : smDrawerWidth },
        transition: theme => ({
          sm: transition(theme, sideBarIsOpen, ["width", "margin-left"]),
        }),
      }}
    >
      <Metadata {...metaProps} />
      <Navbar
        isOpen={sideBarIsOpen}
        smDrawerWidth={smDrawerWidth}
        drawerWidth={drawerWidth}
        onClick={handleOpenSidebar}
      />
      <Sidebar
        smDrawerWidth={smDrawerWidth}
        drawerWidth={drawerWidth}
        isOpen={sideBarIsOpen}
        onToggle={handleToggleSidebar}
        setSideBarIsOpen={setSideBarIsOpen}
      />
      <main>
        <Container>{content}</Container>
      </main>
    </Box>
  );
};

export default Layout;
