import type { Server } from "node:http";
import { env } from "../../lib/env";

const getServerUrl = (server: Server, pathname: string): string => {
  const info = server.address();
  console.log({ serverInfo: info });

  if (env.NAME === "production" || env.NAME === "demo" || !info) return "";

  if (typeof info === "string") return info;

  return `http://localhost:${info.port}${pathname}`;
};

export default getServerUrl;
