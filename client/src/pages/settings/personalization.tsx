import settingsLayout from "@utils/settingsLayout.tsx";
import { type NextPageWithLayout } from "@types";

const Personalize: NextPageWithLayout = () => {
  return <div />;
};

Personalize.layout = settingsLayout("Customize display settings", {
  title: "Personalization",
});

export default Personalize;