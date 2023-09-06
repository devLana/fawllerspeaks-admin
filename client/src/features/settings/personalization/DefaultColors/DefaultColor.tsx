import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { ThemeColors } from "@types";

interface DefaultColorProps {
  label: string;
  hexCode: ThemeColors;
  onClick: (key: "color", value: ThemeColors) => void;
}

const DefaultColor = ({ hexCode, label, onClick }: DefaultColorProps) => (
  <Button
    key={label}
    onClick={() => onClick("color", hexCode)}
    variant="outlined"
    sx={{
      fontSize: "16px",
      justifyContent: "flex-start",
      flexGrow: 1,
      columnGap: 1.5,
      borderColor: hexCode,
      color: hexCode,
      "&:hover": { borderColor: hexCode },
    }}
  >
    <Box component="span" bgcolor={hexCode} p={2.2} borderRadius="50%" />
    {label}
  </Button>
);

export default DefaultColor;
