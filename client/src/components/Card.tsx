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
      sx={[
        {
          padding: { sm: "2rem" },
          borderRadius: { sm: 1 },
          boxShadow: theme => ({ sm: theme.appTheme === "sunny" ? 3 : 5 }),
        },
        ...sxProp,
      ]}
    >
      {children}
    </Box>
  );
};

export default Card;
