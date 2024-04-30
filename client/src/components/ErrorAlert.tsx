import { useRouter } from "next/router";

import Box, { type BoxProps } from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import type { SxPropsArray } from "@types";

interface ErrorAlertProps {
  sx?: BoxProps["sx"];
  message: string;
}

const ErrorAlert = ({ message, sx = [] }: ErrorAlertProps) => {
  const { reload } = useRouter();
  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      rowGap={2}
      sx={[...sxProp]}
    >
      <Alert severity="info" color="error">
        {message}
      </Alert>
      <Button onClick={() => reload()} variant="contained" size="large">
        Reload Page
      </Button>
    </Box>
  );
};

export default ErrorAlert;
