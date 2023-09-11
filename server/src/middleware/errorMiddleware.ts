import type { Response, Request, NextFunction } from "express";

import type { ApiError } from "@utils";

export const errorMiddleware = (
  err: ApiError,
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  const { message, statusCode = 500 } = err;
  res.status(statusCode).json({ message, status: "ERROR" });
};
