import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { useAppTheme } from "@context/MUIThemeContext";
import { themes } from "@utils/appThemes";

const HeaderThemeButton = () => {
  const { appTheme } = useTheme();
  const handleAppTheme = useAppTheme();

  const currIndex = themes.findIndex(theme => theme.id === appTheme.themeMode);
  const nextIndex = currIndex === themes.length - 1 ? 0 : currIndex + 1;
  const { Icon } = themes[currIndex];
  const { id } = themes[nextIndex];

  return (
    <IconButton
      onClick={() => handleAppTheme("themeMode", id)}
      aria-label="Change app theme"
      color="primary"
    >
      <Icon />
    </IconButton>
  );
};

export default HeaderThemeButton;
