import { GraphQLError } from "graphql";
import { ValidationError } from "joi";
import bcrypt from "bcrypt";

import { LoginValidationError } from "@typeResolvers/auth/LoginValidationError";
import { SessionData } from "@typeResolvers/auth/SessionData";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { loginValidator as schema } from "@validators/auth/login";
import generateErrorsObject from "@utils/generateErrorsObject";
import signTokens from "@utils/auth/signTokens";
import { setAuthCookie } from "@utils/auth/cookies";
import type { Login, DBUser } from "types/auth/login";

const login: Login = async (_, args, { db, req, res }) => {
  try {
    const MSG = "Invalid email or password";
    const ip = req.ip || null;
    const userAgent = req.headers["user-agent"] || null;

    const input = await schema.validateAsync(args, { abortEarly: false });

    const { rows } = await db.query<DBUser>(
      `SELECT
        id,
        user_id,
        first_name,
        last_name,
        image,
        email,
        password,
        is_registered,
        date_created
      FROM users
      WHERE lower(email) = $1`,
      [input.email.toLowerCase()]
    );

    if (rows.length === 0) return new ErrorResponse("ForbiddenError", MSG);

    const [{ user_id, password, ...row }] = rows;

    const match = await bcrypt.compare(input.password, password);

    if (!match) return new ErrorResponse("ForbiddenError", MSG);

    const { refreshTokenHash, refreshToken, accessToken } = await signTokens(
      user_id
    );

    await db.query(
      `INSERT INTO sessions (refresh_token, user_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)`,
      [refreshTokenHash, row.id, ip, userAgent]
    );

    setAuthCookie(res, refreshToken);

    const user = {
      id: user_id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      image: row.image,
      isRegistered: row.is_registered,
      dateCreated: row.date_created,
    };

    return new SessionData(user, accessToken);
  } catch (err) {
    if (err instanceof ValidationError) {
      const { emailError, passwordError } = generateErrorsObject(err.details);
      return new LoginValidationError(emailError, passwordError);
    }

    // log any system errors

    throw new GraphQLError("Unable to login. Please try again later");
  }
};

export default login;
