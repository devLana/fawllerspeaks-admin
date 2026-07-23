import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";

import { db } from "@services/db";
import { verify } from "@lib/tokenPromise";
import { ApiError, UnauthenticatedError, UnauthorizedError } from "@lib/Errors";
import { env } from "@lib/env";

export const authenticateUser = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    const error = new UnauthenticatedError("Unable to upload image");
    next(error);
    return;
  }

  (async token => {
    try {
      const { sub } = await verify(token, env.ACCESS_TOKEN_SECRET);

      if (!sub) {
        const error = new UnauthenticatedError("Unable to upload image");
        next(error);
        return;
      }

      const { rows } = await db.query<{ is_registered: boolean }>(
        `SELECT is_registered from users WHERE user_id = $1`,
        [sub],
      );

      if (rows.length === 0 || !rows[0].is_registered) {
        const error = new UnauthorizedError("Unable to upload image");
        next(error);
        return;
      }

      next();
    } catch (err) {
      if (
        err instanceof TokenExpiredError ||
        err instanceof JsonWebTokenError
      ) {
        const error = new UnauthenticatedError("Unable to upload image");
        next(error);
        return;
      }

      // log err for debugging purposes

      const error = new ApiError("Server Error. Please try again later");
      next(error);
    }
  })(req.headers.authorization.substring(7));
};
