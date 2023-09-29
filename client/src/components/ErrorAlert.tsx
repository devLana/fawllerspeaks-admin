import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const ErrorAlert = ({ message }: { message: string }) => {
  const { reload } = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        rowGap: 2,
      }}
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
