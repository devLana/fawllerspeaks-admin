import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";

import { db } from "@lib/db";
import { verify } from "@lib/tokenPromise";
import {
  ApiError,
  UnauthenticatedError,
  UnauthorizedError,
} from "@utils/Errors";
import { env } from "@lib/env";

export const authenticateUser = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    const error = new UnauthenticatedError("Unable to upload image");
    return next(error);
  }

  try {
    const jwt = req.headers.authorization.substring(7);

    const { sub } = (await verify(jwt, env.ACCESS_TOKEN_SECRET)) as {
      sub: string;
    };

    const { rows } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" from users WHERE user_id = $1`,
      [sub]
    );

    if (rows.length === 0 || !rows[0].isRegistered) {
      const error = new UnauthorizedError("Unable to upload image");
      return next(error);
    }

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
      const error = new UnauthenticatedError("Unable to upload image");
      return next(error);
    }

    const error = new ApiError("Server Error. Please try again later");
    next(error);
  }
};
