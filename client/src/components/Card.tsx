import Box, { type BoxProps } from "@mui/material/Box";
import type { SxPropsArray } from "@types";

interface CardProps {
  children: React.ReactNode;
  sx?: BoxProps["sx"];
}

const Card = ({ sx, children }: CardProps) => {
  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  return (
    <Box
      sx={[
        theme => ({
          maxWidth: "21.875rem",
          [theme.breakpoints.up("sm")]: {
            maxWidth: "25rem",
            p: "2rem",
            borderRadius: 1,
            boxShadow: theme.appTheme.themeMode === "sunny" ? 3 : 5,
          },
        }),
        ...sxProp,
      ]}
    >
      {children}
    </Box>
  );
};

export default Card;
