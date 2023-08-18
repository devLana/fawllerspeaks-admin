import { gql, useApolloClient } from "@apollo/client";

import { useSession } from "@context/SessionContext";

export interface User {
  firstName: string;
  lastName: string;
  image: string | null;
}

const useGetUserInfo = () => {
  const client = useApolloClient();
  const { userId } = useSession();

  const user = client.readFragment<User>({
    id: userId ?? "",
    fragment: gql`
      fragment GetCacheUser on User {
        firstName
        lastName
        image
      }
    `,
  });

  return user;
};

export default useGetUserInfo;
