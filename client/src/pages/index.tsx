import * as React from "react";
import { useRouter } from "next/router";

import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";

import RootLayout from "@layouts/RootLayout";
import uiLayout from "@utils/layouts/uiLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { NextPageWithLayout } from "@types";

const Home: NextPageWithLayout = () => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const { query } = useRouter();

  React.useEffect(() => {
    if (query.status && typeof query.status === "string") {
      switch (query.status) {
        case "registered":
          setAlert({
            open: true,
            message: "Your account has already been registered",
          });
          break;

        default:
      }
    }
  }, [query.status]);

  return (
    <>
      <Snackbar
        open={alert.open}
        onClose={handleCloseAlert({ ...alert, open: false }, setAlert)}
        message={alert.message}
      />
      <Typography variant="h1">Dashboard</Typography>
    </>
  );
};

Home.layout = uiLayout(RootLayout, { title: "Dashboard" });

export default Home;
