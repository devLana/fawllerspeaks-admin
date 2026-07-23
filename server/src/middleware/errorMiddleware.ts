import type { Response, Request, NextFunction } from "express";

import type { ApiError } from "@lib/Errors";

export const errorMiddleware = (
  err: ApiError,
  _: Request,
  res: Response,
  __: NextFunction,
): void => {
  const { message, statusCode } = err;
  res.status(statusCode).json({ error: { message } });
};
