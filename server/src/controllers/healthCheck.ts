import type { Response, Request } from "express";

export const healthCheck = (_: Request, res: Response) => {
  res.setHeader("content-type", "text/plain");
  res.status(200).send("Ok");
};
