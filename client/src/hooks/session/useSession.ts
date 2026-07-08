import { useContext } from "react";
import { SessionContext } from "@contexts/Session";

export const useSession = () => {
  const value = useContext(SessionContext);

  if (!value) {
    throw new ReferenceError("Session context provider not available");
  }

  return value;
};
