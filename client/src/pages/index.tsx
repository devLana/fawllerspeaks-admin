import * as React from "react";
import { useRouter } from "next/router";

import Typography from "@mui/material/Typography";

import AlertToast from "@components/AlertToast";
import RootLayout from "@layouts/RootLayout";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";

const Home: NextPageWithLayout = () => {
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    if (router.isReady) {
      if (router.query.status && !Array.isArray(router.query.status)) {
        switch (router.query.status) {
          case "registered":
            setStatusMessage("Your account has already been registered");
            break;

          default:
            setStatusMessage(null);
        }
      }
    }
  }, [router.isReady, router.query.status]);

  return (
    <>
      {statusMessage && (
        <AlertToast
          horizontal="center"
          vertical="top"
          isOpen={!!statusMessage}
          onClose={() => setStatusMessage(null)}
          direction="down"
          severity="info"
          content={statusMessage}
        />
      )}
      <Typography variant="h1">Home page</Typography>{" "}
    </>
  );
};

Home.layout = uiLayout(RootLayout, { title: "Dashboard" });

export default Home;
