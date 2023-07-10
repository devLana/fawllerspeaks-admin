import Box, { type BoxProps } from "@mui/material/Box";

interface CardProps extends BoxProps {
  children: React.ReactNode;
}

const Card = ({ sx, children, ...props }: CardProps) => (
  <Box
    sx={{
      padding: { sm: "2rem" },
      borderRadius: { sm: 1 },
      boxShadow: theme => ({ sm: theme.appTheme === "sunny" ? 3 : 5 }),
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);

export default Card;
