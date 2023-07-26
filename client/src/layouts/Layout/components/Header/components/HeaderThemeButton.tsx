import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { useAppTheme } from "@context/MUIThemeContext";
import { themes } from "@utils/appThemes";
import { DEFAULT_THEME } from "@utils/constants";

const HeaderThemeButton = () => {
  const { appTheme } = useTheme();
  const handleAppTheme = useAppTheme();

  const currIndex = themes.findIndex(theme => theme.id === appTheme);
  const nextIndex = currIndex === themes.length - 1 ? 0 : currIndex + 1;
  const { Icon } = themes[currIndex];
  const { id } = themes[nextIndex];

  const handleClick = () => {
    handleAppTheme(id);
    localStorage.setItem(DEFAULT_THEME, id);
  };

  return (
    <IconButton
      onClick={handleClick}
      aria-label="Change app theme"
      color="primary"
    >
      <Icon />
    </IconButton>
  );
};

export default HeaderThemeButton;
