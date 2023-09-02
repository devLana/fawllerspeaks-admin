import { request, response } from "express";
import type { GraphQLResolveInfo } from "graphql";

import { db } from "@lib/db";

import type { APIContext } from "@types";

export const info = {} as GraphQLResolveInfo;

export const mockContext: APIContext = {
  db,
  user: null,
  req: request,
  res: response,
};
