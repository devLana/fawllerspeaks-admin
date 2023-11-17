import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import NextLink from "@components/NextLink";
import type { Status } from "@apiTypes";

const ResetPasswordSuccess = ({ status }: { status: Status | null }) => (
  <Card variant="outlined" sx={{ maxWidth: "28rem" }} role="presentation">
    <CardContent>
      <Alert
        iconMapping={{ success: <CheckCircleOutlineIcon fontSize="inherit" /> }}
        severity={status === "SUCCESS" ? "success" : "info"}
      >
        Password Reset Successful
      </Alert>
    </CardContent>
    <CardContent>
      <Typography gutterBottom>Your password has been reset.</Typography>
      <Typography>
        You can head over to the&nbsp;
        <NextLink underline="always" href="/login">
          login page
        </NextLink>
        &nbsp; to login with your new password
      </Typography>
    </CardContent>
  </Card>
);

export default ResetPasswordSuccess;
