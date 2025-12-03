import createUser from "./createUser";
import login from "./login";
import logout from "./logout";
import refreshToken from "./refreshToken";
import registerUser from "./registerUser";
import forgotPassword from "./forgotPassword";
import resetPassword from "./resetPassword";
import generatePassword from "./generatePassword";
import verifyResetToken from "./verifyResetToken";
import verifySession from "./verifySession";

export const authResolvers = {
  createUser,
  login,
  logout,
  refreshToken,
  registerUser,
  forgotPassword,
  resetPassword,
  generatePassword,
  verifyResetToken,
  verifySession,
};
