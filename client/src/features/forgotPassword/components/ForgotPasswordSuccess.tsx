import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ForgotPasswordSuccess = () => (
  <Card variant="outlined" sx={{ maxWidth: "28rem" }} role="presentation">
    <CardContent>
      <Alert
        icon={<CheckCircleOutlineIcon fontSize="inherit" />}
        severity="success"
      >
        Request Link Sent
      </Alert>
    </CardContent>
    <CardContent>
      <Typography>
        A reset link has been sent to the e-mail address you provided.
      </Typography>
    </CardContent>
  </Card>
);

export default ForgotPasswordSuccess;
