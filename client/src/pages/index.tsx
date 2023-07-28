import Typography from "@mui/material/Typography";

import RootLayout from "@layouts/RootLayout";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";

const Home: NextPageWithLayout = () => {
  return <Typography variant="h1">Home page</Typography>;
};

Home.layout = uiLayout(RootLayout, { title: "Dashboard" });

export default Home;
