import Typography from "@mui/material/Typography";

import useStatusAlert from "@hooks/registerUser/useStatusAlert";
import AuthRootLayout from "@layouts/AuthRootLayout";
import AlertToast from "@features/auth/components/AlertToast";
import Down from "@components/SlideTransitions/Down";
import Card from "@features/auth/components/Card";
import RegisterUserForm from "@features/auth/registerUser/RegisterUserForm";
import uiLayout from "@utils/layouts/uiLayout";
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
      <Typography align="center" variant="h1" id="page-title">
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
