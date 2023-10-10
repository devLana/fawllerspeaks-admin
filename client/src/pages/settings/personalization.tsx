import { useTheme } from "@mui/material/styles";

import Theme from "@features/settings/personalization/Theme";
import FontSize from "@features/settings/personalization/FontSize";
import DefaultColors from "@features/settings/personalization/DefaultColors";
import settingsLayout from "@utils/settings/settingsLayout";
import { type NextPageWithLayout } from "@types";

const Personalize: NextPageWithLayout = () => {
  const { appTheme } = useTheme();

  return (
    <>
      <Theme appTheme={appTheme} />
      <FontSize appTheme={appTheme} />
      <DefaultColors appTheme={appTheme} />
    </>
  );
};

Personalize.layout = settingsLayout("Customize display settings", {
  title: "Personalization Settings",
});

export default Personalize;
