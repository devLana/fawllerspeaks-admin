import Typography from "@mui/material/Typography";

import Layout from "@layouts/Layout";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";

const Home: NextPageWithLayout = () => {
  return <Typography variant="h1">Home page</Typography>;
};

Home.layout = uiLayout(Layout, { title: "Dashboard" });

export default Home;
