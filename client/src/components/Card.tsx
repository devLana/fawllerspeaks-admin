import Box, { type BoxProps } from "@mui/material/Box";
import type { SxPropsArray } from "@types";

interface CardProps {
  children: React.ReactNode;
  maxWidth?: string | number;
  smMaxWidth?: string | number;
  sx?: BoxProps["sx"];
}

const Card = ({
  sx = [],
  maxWidth = "21.875rem",
  smMaxWidth = "25rem",
  children,
}: CardProps) => {
  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  return (
    <Box
      sx={[
        theme => ({
          maxWidth,
          [theme.breakpoints.up("sm")]: {
            maxWidth: smMaxWidth,
            p: "2rem",
            borderRadius: 1,
            boxShadow: 1,
            border: 1,
            borderColor: "action.disabledBackground",
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
