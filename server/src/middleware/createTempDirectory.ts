import { mkdir } from "node:fs";

import type { Request, Response, NextFunction } from "express";

import { UPLOAD_DIR } from "@utils";

export const createTempDirectory = (
  _: Request,
  __: Response,
  next: NextFunction
) => {
  mkdir(UPLOAD_DIR, { recursive: true }, () => {
    next();
  });
};
