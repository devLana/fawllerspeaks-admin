import { createContext } from "react";

interface Auth {
  jwt: string;
  handleAuthHeader: (jwt: string) => void;
}

export const AuthContext = createContext<Auth | null>(null);
