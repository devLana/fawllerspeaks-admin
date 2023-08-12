import { gql, useApolloClient } from "@apollo/client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useSession } from "@context/SessionContext";
import UserAvatar from "@components/UserAvatar";
import settingsLayout from "@utils/settings/settingsLayout";
import NextLink from "@components/NextLink";
import { type NextPageWithLayout } from "@types";

interface User {
  email: string;
  image: string;
  firstName: string;
  lastName: string;
}

const Me: NextPageWithLayout = () => {
  const client = useApolloClient();

  const { userId } = useSession();
  const user = client.readFragment<User>({
    id: userId ?? "",
    fragment: gql`
      fragment GetUserProfile on User {
        image
        firstName
        lastName
      }
    `,
  });

  return (
    <>
      <Box>
        <Stack direction="row" spacing={4} alignItems="center">
          <UserAvatar
            sx={{ width: { xs: 100, md: 150 }, height: { xs: 100, md: 150 } }}
            user={user}
          />
          <Stack>
            <Typography gutterBottom sx={{ wordBreak: "break-word" }}>
              {user?.firstName ?? "Unknown"} {user?.lastName ?? "User"}
            </Typography>
            <NextLink href="/settings/me/edit">Edit Profile</NextLink>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

Me.layout = settingsLayout("My profile", { title: "Admin Profile" });

export default Me;
