import type { Server } from "node:http";
import { nodeEnv } from "./nodeEnv";

const getServerUrl = (server: Server, pathname: string): string => {
  const info = server.address();

  if (nodeEnv === "production" || !info) return "";

  if (typeof info === "string") {
    return info;
  }

  return `http://localhost:${info.port}${pathname}`;
};

export default getServerUrl;
