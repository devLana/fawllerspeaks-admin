import { useContext } from "react";
import { AuthContext } from "@contexts/Auth";

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new ReferenceError("Auth context provider not available");
  }

  return value;
};
