import NextLink from "@components/ui/NextLink";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const UnregisteredUserAlert = ({ children }: { children: React.ReactNode }) => (
  <Card variant="outlined" sx={{ maxWidth: "28rem" }} role="presentation">
    <CardContent>
      <Alert severity="info">Unregistered Account</Alert>
    </CardContent>
    <CardContent>
      <Typography gutterBottom>{children}</Typography>
      <Typography gutterBottom>
        You can head over to the{" "}
        <NextLink underline="always" href="/login">
          login page
        </NextLink>
        &nbsp; to login with the password sent to your inbox and then proceed to
        register your account.
      </Typography>
      <Typography>
        For further assistance, you can send an enquiry to&nbsp;
        <Link underline="always" href="mailto:info@fawllerspeaks.com">
          info@fawllerspeaks.com
        </Link>
      </Typography>
    </CardContent>
  </Card>
);

export default UnregisteredUserAlert;
