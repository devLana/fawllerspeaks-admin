// import Image from "next/image";

import { gql, useApolloClient } from "@apollo/client";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

import { useSession } from "@context/SessionContext";
import NextLink from "@components/NextLink";
import type { AppTheme } from "@types";

interface User {
  firstName: string;
  lastName: string;
  image: string | null;
}

const bgColor = (appTheme: AppTheme) => {
  return appTheme === "sunny" ? "primary.dark" : "primary.light";
};

const HeaderAvatar = () => {
  const client = useApolloClient();
  const { userId } = useSession();

  const user = client.readFragment<User>({
    id: userId ?? "",
    fragment: gql`
      fragment GetAuthUser on User {
        firstName
        lastName
        image
      }
    `,
  });

  if (!user) {
    return (
      <Avatar
        sx={{ bgcolor: ({ appTheme }) => bgColor(appTheme) }}
        role="img"
        aria-label="Unknown user avatar"
      >
        <PersonIcon />
      </Avatar>
    );
  }

  const { firstName, lastName, image } = user;

  if (image) {
    return (
      <NextLink
        href="/profile"
        sx={{ fontStyle: "normal" }}
        aria-label={`${firstName} ${lastName} profile page`}
      >
        <Avatar
          // component={Image}
          src={image}
          alt={`${firstName} ${lastName} avatar`}
        />
      </NextLink>
    );
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <NextLink
      href="/profile"
      sx={{ fontStyle: "normal" }}
      aria-label={`${firstName} ${lastName} profile page`}
    >
      <Avatar
        sx={{ bgcolor: ({ appTheme }) => bgColor(appTheme), fontSize: 17 }}
      >
        {initials}
      </Avatar>
    </NextLink>
  );
};

export default HeaderAvatar;
