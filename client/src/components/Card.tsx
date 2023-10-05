import Box, { type BoxProps } from "@mui/material/Box";
import type { SxPropsArray } from "@types";

interface CardProps {
  children: React.ReactNode;
  sx: BoxProps["sx"];
}

const Card = ({ sx, children }: CardProps) => {
  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  return (
    <Box
      p={{ sm: "2rem" }}
      borderRadius={{ sm: 1 }}
      boxShadow={theme => ({
        sm: theme.appTheme.themeMode === "sunny" ? 3 : 5,
      })}
      sx={[...sxProp]}
    >
      {children}
    </Box>
  );
};

export default Card;
