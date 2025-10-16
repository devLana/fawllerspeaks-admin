import type { Server } from "node:http";
import { env } from "../../lib/env";

const getServerUrl = (server: Server, pathname: string): string => {
  const info = server.address();

  if (env.NAME === "production" || !info) return "";

  if (typeof info === "string") return info;

  if (env.NAME === "demo") return `${info.address}${info.port}${pathname}`;

  return `http://localhost:${info.port}${pathname}`;
};

export default getServerUrl;
