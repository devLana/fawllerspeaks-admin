// import Image from "next/image";

import Avatar, { type AvatarProps } from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

import NextLink from "@components/NextLink";

interface UserAvatarProps {
  sx?: AvatarProps["sx"];
  renderWithLink?: boolean;
  user: { firstName: string; lastName: string; image: string | null } | null;
}

type Keys = ((theme: never) => unknown) | Record<string, unknown>;
type SxPropsArray = NonNullable<Exclude<AvatarProps["sx"], Keys>>;

const UserAvatar = (props: UserAvatarProps) => {
  const { user, renderWithLink = false, sx = [] } = props;
  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  if (!user) {
    return (
      <Avatar
        sx={[{ bgcolor: "text.disabled" }, ...sxProp]}
        role="img"
        aria-label="Unknown user avatar"
      >
        <PersonIcon />
      </Avatar>
    );
  }

  const { firstName, lastName, image } = user;

  if (image) {
    return renderWithLink ? (
      <NextLink
        href="/settings/me"
        aria-label={`${firstName} ${lastName} profile page`}
      >
        <Avatar
          // component={Image}
          src={image}
          alt={`${firstName} ${lastName} avatar`}
          sx={[...sxProp]}
        />
      </NextLink>
    ) : (
      <Avatar
        // component={Image}
        src={image}
        alt={`${firstName} ${lastName} avatar`}
        sx={[...sxProp]}
      />
    );
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return renderWithLink ? (
    <NextLink
      href="/settings/me"
      sx={{ fontStyle: "normal" }}
      aria-label={`${firstName} ${lastName} profile page`}
    >
      <Avatar
        sx={[
          ({ appTheme }) => ({
            bgcolor:
              appTheme === "sunny" ? "secondary.light" : "secondary.dark",
            color: "primary.main",
            fontSize: 17,
          }),
          ...sxProp,
        ]}
      >
        {initials}
      </Avatar>
    </NextLink>
  ) : (
    <Avatar
      aria-label={`${firstName} ${lastName} initials`}
      sx={[
        ({ appTheme }) => ({
          bgcolor: appTheme === "sunny" ? "secondary.light" : "secondary.dark",
          color: "primary.main",
          fontSize: 17,
        }),
        ...sxProp,
      ]}
    >
      {initials}
    </Avatar>
  );
};

export default UserAvatar;