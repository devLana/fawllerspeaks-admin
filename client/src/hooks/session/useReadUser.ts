import { useApolloClient } from "@apollo/client/react";
import { CACHE_USER } from "@queries/session/cacheUser";

interface User {
  id: string;
  email: string;
  isRegistered: boolean;
  firstName: string;
  lastName: string;
  image: string | null;
}

export const useReadUser = (): { me: User } | null => {
  const client = useApolloClient();
  const user = client.readQuery<{ me: User }>({ query: CACHE_USER });
  return user;
};
