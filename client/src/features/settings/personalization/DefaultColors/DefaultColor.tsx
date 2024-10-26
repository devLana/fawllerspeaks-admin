import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";

import type { ThemeColors } from "types/appTheme";

interface DefaultColorProps {
  onClick: (key: "color", value: ThemeColors) => void;
  themeColor: ThemeColors;
  light: "#7dd1f3" | "#ccc";
  dark: "#149cd2" | "#6a6a6a";
  label: "Blue" | "Gray";
  isDefaultColor: boolean;
}

const DefaultColor = (props: DefaultColorProps) => {
  const { onClick, dark, label, light, themeColor, isDefaultColor } = props;

  return (
    <Button
      onClick={() => onClick("color", themeColor)}
      variant="outlined"
      sx={({ appTheme: { themeMode } }) => ({
        borderColor: themeMode === "sunny" ? dark : light,
        "&:hover": { borderColor: themeMode === "sunny" ? dark : light },
        color: themeMode === "sunny" ? dark : light,
        fontSize: "1em",
        justifyContent: "flex-start",
        flexGrow: 1,
        columnGap: 4,
      })}
    >
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          width: 40,
          borderRadius: "50%",
          bgcolor({ appTheme: { themeMode } }) {
            return themeMode === "sunny" ? dark : light;
          },
        }}
      >
        {isDefaultColor && (
          <CheckIcon
            sx={{
              color({ appTheme: { themeMode } }) {
                return themeMode === "sunny" ? "primary.light" : "primary.dark";
              },
            }}
          />
        )}
      </Box>
      {label}
    </Button>
  );
};

export default DefaultColor;
