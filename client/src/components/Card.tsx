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
      maxWidth={{ maxWidth, sm: smMaxWidth }}
      p={{ sm: "2rem" }}
      borderRadius={{ sm: 1 }}
      boxShadow={{ sm: 2 }}
      border={{ sm: 1 }}
      borderColor={{ sm: "action.disabledBackground" }}
      sx={[...sxProp]}
    >
      {children}
    </Box>
  );
};

export default Card;
