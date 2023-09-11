import * as React from "react";
import { useRouter } from "next/router";

import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";

import RootLayout from "@layouts/RootLayout";
import uiLayout from "@utils/uiLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { NextPageWithLayout } from "@types";

const Home: NextPageWithLayout = () => {
  const [statusMessage, setStatusMessage] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      if (router.query.status && !Array.isArray(router.query.status)) {
        switch (router.query.status) {
          case "registered":
            setStatusMessage("Your account has already been registered");
            setIsOpen(true);
            break;

          default:
            setStatusMessage("");
        }
      }
    }
  }, [router.isReady, router.query.status]);

  return (
    <>
      <Snackbar
        open={isOpen}
        onClose={handleCloseAlert<boolean>(false, setIsOpen)}
        message={statusMessage}
      />
      <Typography variant="h1">Home page</Typography>
    </>
  );
};

Home.layout = uiLayout(RootLayout, { title: "Dashboard" });

export default Home;
