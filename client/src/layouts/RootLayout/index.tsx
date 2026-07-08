import { useState } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import Metadata from "@layouts/components/Metadata";
import Loader from "@layouts/components/Loader";
import ErrorAlert from "@layouts/components/ErrorAlert";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import PageBreadcrumbs from "./components/PageBreadcrumbs";
import type { MetadataProps } from "@appTypes";

export interface RootLayoutProps extends MetadataProps {
  errorMessage: string | null;
  isVerifying: boolean;
  children: React.ReactElement;
}

const RootLayout = (props: RootLayoutProps) => {
  const { children, isVerifying, errorMessage, ...metaProps } = props;
  const [navBarIsOpen, setNavBarIsOpen] = useState(false);

  let content: React.ReactElement;

  if (isVerifying) {
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
      <Header onClick={() => setNavBarIsOpen(true)} isLoading={isVerifying} />
      <Navbar
        isOpen={navBarIsOpen}
        isLoading={isVerifying}
        onToggleNav={() => setNavBarIsOpen(!navBarIsOpen)}
        onCloseNav={() => setNavBarIsOpen(false)}
      />
      <Box
        component="main"
        aria-live="polite"
        aria-busy={isVerifying}
        sx={{ py: 4, flexGrow: { sm: 1 }, minWidth: { sm: 0 } }}
      >
        {content}
      </Box>
    </Container>
  );
};

export default RootLayout;
