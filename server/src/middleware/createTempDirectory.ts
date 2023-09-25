import { mkdir } from "node:fs";

import type { Request, Response, NextFunction } from "express";

import { uploadDir } from "@utils";

export const createTempDirectory = (
  _: Request,
  __: Response,
  next: NextFunction
) => {
  mkdir(uploadDir, { recursive: true }, () => {
    next();
  });
};
