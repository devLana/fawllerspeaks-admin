import Layout from "@layouts/Layout";
import uiLayout from "@utils/uiLayout";
import type { NextPageWithLayout } from "@types";

const Home: NextPageWithLayout = () => {
  return <h1>Home page</h1>;
};

Home.layout = uiLayout(Layout, { title: "Dashboard" });

export default Home;
