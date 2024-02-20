import * as React from "react";

import { useApolloClient } from "@apollo/client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { useAuthHeader } from "@context/AuthHeader";
import Metadata from "@components/Metadata";
import Loader from "@components/Loader";
import ErrorAlert from "@components/ErrorAlert";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import PageBreadcrumbs from "./components/PageBreadcrumbs";
import { GET_POST_TAGS } from "@features/postTags/GetPostTags/operations/GET_POST_TAGS";
import { type RootLayoutProps } from "@types";

const RootLayout = (props: RootLayoutProps) => {
  const { children, clientHasRendered, errorMessage, ...metaProps } = props;
  const [navBarIsOpen, setNavBarIsOpen] = React.useState(false);

  const client = useApolloClient();

  const { jwt } = useAuthHeader();

  React.useEffect(() => {
    if (jwt) void client.query({ query: GET_POST_TAGS });
  }, [client, jwt]);

  let content: React.ReactElement;

  if (!clientHasRendered) {
    content = <Loader />;
  } else if (errorMessage) {
    content = <ErrorAlert message={errorMessage} />;
  } else {
    content = children;
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
        <PageBreadcrumbs />
        {content}
      </Box>
    </Container>
  );
};

export default RootLayout;
