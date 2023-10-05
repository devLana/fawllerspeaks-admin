import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { ThemeColors } from "@types";

interface DefaultColorProps {
  onClick: (key: "color", value: ThemeColors) => void;
  themeColor: ThemeColors;
  light: "#7dd1f3" | "#ccc";
  dark: "#149cd2" | "#6a6a6a";
  label: "Blue" | "Gray";
}

const DefaultColor = (props: DefaultColorProps) => {
  const { onClick, dark, label, light, themeColor } = props;

  return (
    <Button
      onClick={() => onClick("color", themeColor)}
      variant="outlined"
      sx={({ appTheme: { themeMode } }) => ({
        borderColor: themeMode === "sunny" ? dark : light,
        "&:hover": { borderColor: themeMode === "sunny" ? dark : light },
        color: themeMode === "sunny" ? dark : light,
        fontSize: "16px",
        justifyContent: "flex-start",
        flexGrow: 1,
        columnGap: 4,
      })}
    >
      <Box
        component="span"
        p={2.2}
        borderRadius="50%"
        bgcolor={({ appTheme: { themeMode } }) => {
          return themeMode === "sunny" ? dark : light;
        }}
      />
      {label}
    </Button>
  );
};

export default DefaultColor;
