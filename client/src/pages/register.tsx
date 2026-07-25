import Typography from "@mui/material/Typography";

import useRegisterUserStatusAlert from "@hooks/auth/registerUser/useRegisterUserStatusAlert";
import Card from "@features/auth/components/Card";
import RegisterUserForm from "@features/auth/registerUser/RegisterUserForm";
import registerUserLayout from "@utils/layouts/registerUserLayout";

export const RegisterUser = () => {
  useRegisterUserStatusAlert();

  return (
    <>
      <Typography align="center" variant="h1" id="page-title">
        Register Your Account
      </Typography>
      <Card maxWidth="22.5rem" smMaxWidth="43rem" sx={{ width: "100%" }}>
        <RegisterUserForm />
      </Card>
    </>
  );
};

export default registerUserLayout(RegisterUser, {
  title: "Register Your FawllerSpeaks Admin Account",
});
