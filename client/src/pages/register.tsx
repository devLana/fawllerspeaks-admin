import Typography from "@mui/material/Typography";

import useStatusAlert from "@features/register/hooks/useStatusAlert";
import AuthRootLayout from "@layouts/AuthRootLayout";
import AlertToast from "@components/AlertToast";
import Down from "@components/SlideTransitions/Down";
import Card from "@components/Card";
import RegisterUserForm from "@features/register/components/RegisterUserForm";
import uiLayout from "@layouts/utils/uiLayout";
import type { NextPageWithLayout } from "@types";

const RegisterUser: NextPageWithLayout = () => {
  const { open, message, handleCloseAlert } = useStatusAlert();

  return (
    <>
      <AlertToast
        horizontal="center"
        vertical="top"
        isOpen={open}
        onClose={handleCloseAlert}
        transition={Down}
        severity="info"
        content={message}
      />
      <Typography align="center" variant="h1">
        Register Your Account
      </Typography>
      <Card maxWidth="22.5rem" smMaxWidth="43rem" sx={{ width: "100%" }}>
        <RegisterUserForm />
      </Card>
    </>
  );
};

RegisterUser.layout = uiLayout(AuthRootLayout, {
  title: "Register Your FawllerSpeaks Admin Account",
});

export default RegisterUser;
