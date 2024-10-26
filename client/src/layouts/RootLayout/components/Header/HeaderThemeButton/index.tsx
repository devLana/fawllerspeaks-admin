import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { useAppTheme } from "@context/AppTheme";
import { appThemes as themes } from "@context/AppTheme/helpers/appThemes";

const HeaderThemeButton = () => {
  const { appTheme } = useTheme();
  const handleAppTheme = useAppTheme();

  const currIndex = themes.findIndex(theme => theme.id === appTheme.themeMode);
  const nextIndex = currIndex === themes.length - 1 ? 0 : currIndex + 1;
  const { Icon } = themes[currIndex];
  const { id } = themes[nextIndex];

  return (
    <Tooltip title="Change app theme">
      <IconButton
        onClick={() => handleAppTheme("themeMode", id)}
        color="primary"
      >
        <Icon />
      </IconButton>
    </Tooltip>
  );
};

export default HeaderThemeButton;
