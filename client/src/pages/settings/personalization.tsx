import Theme from "@features/settings/personalization/Theme";
import FontSize from "@features/settings/personalization/FontSize";
import settingsLayout from "@utils/settings/settingsLayout";
import DefaultColors from "@features/settings/personalization/DefaultColors";
import { type NextPageWithLayout } from "@types";

const Personalize: NextPageWithLayout = () => (
  <>
    <Theme />
    <FontSize />
    <DefaultColors />
  </>
);

Personalize.layout = settingsLayout("Customize display settings", {
  title: "Personalization Settings",
});

export default Personalize;
