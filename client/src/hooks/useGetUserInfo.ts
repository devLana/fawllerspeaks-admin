import { gql, useApolloClient, type TypedDocumentNode } from "@apollo/client";
import { useSession } from "@context/Session";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
}

const GET_USER_INFO: TypedDocumentNode<User> = gql`
  fragment GetCacheUser on User {
    id
    email
    firstName
    lastName
    image
  }
`;

const useGetUserInfo = () => {
  const client = useApolloClient();
  const { userId } = useSession();

  const user = client.readFragment({
    id: userId ?? "",
    fragment: GET_USER_INFO,
  });

  return user;
};

export default useGetUserInfo;
