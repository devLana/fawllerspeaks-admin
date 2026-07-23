import type { Server } from "node:http";
import { env } from "@lib/env";

export const getServerUrl = (server: Server, pathname: string): string => {
  const info = server.address();

  if (env.NAME === "production" || env.NAME === "demo" || !info) return "";

  if (typeof info === "string") return info;

  return `http://localhost:${String(info.port)}${pathname}`;
};
