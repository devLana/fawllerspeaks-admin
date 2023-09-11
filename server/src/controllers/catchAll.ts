import type { Response, Request } from "express";

export const catchAll = (_: Request, res: Response) => {
  res.setHeader("content-type", "text/plain");
  res.status(403).send("Forbidden Request");
};
