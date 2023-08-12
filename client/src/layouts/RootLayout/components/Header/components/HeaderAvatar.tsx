import { gql, useApolloClient } from "@apollo/client";

import { useSession } from "@context/SessionContext";
import UserAvatar from "@components/UserAvatar";

interface User {
  firstName: string;
  lastName: string;
  image: string | null;
}

const HeaderAvatar = () => {
  const client = useApolloClient();
  const { userId } = useSession();

  const user = client.readFragment<User>({
    id: userId ?? "",
    fragment: gql`
      fragment GetHeaderUser on User {
        firstName
        lastName
        image
      }
    `,
  });

  return <UserAvatar user={user} renderWithLink />;
};

export default HeaderAvatar;
