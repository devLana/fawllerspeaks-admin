import { useTheme } from "@mui/material/styles";

import Theme from "@features/settings/personalization/components/Theme";
import FontSize from "@features/settings/personalization/components/FontSize";
import DefaultColors from "@features/settings/personalization/components/DefaultColors";
import settingsLayout from "@utils/layouts/settingsLayout";
import { type NextPageWithLayout } from "@types";

const Personalize: NextPageWithLayout = () => {
  const { appTheme } = useTheme();

  return (
    <>
      <Theme themeMode={appTheme.themeMode} />
      <FontSize fontSize={appTheme.fontSize} />
      <DefaultColors color={appTheme.color} />
    </>
  );
};

Personalize.layout = settingsLayout("Customize display settings", {
  title: "Personalization Settings",
});

export default Personalize;
