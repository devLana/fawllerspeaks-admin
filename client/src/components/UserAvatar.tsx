import Avatar, { type AvatarProps } from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

import NextLink from "@components/NextLink";
import type { SxPropsArray } from "@types";

interface UserAvatarProps {
  sx?: AvatarProps["sx"];
  renderWithLink?: boolean;
  user: { firstName: string; lastName: string; image: string | null } | null;
}

const UserAvatar = (props: UserAvatarProps) => {
  const { user, renderWithLink = false, sx = [] } = props;
  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  if (!user) {
    return (
      <Avatar sx={[{ bgcolor: "text.disabled" }, ...sxProp]}>
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
          src={image}
          alt={`${firstName} ${lastName} avatar`}
          sx={[...sxProp]}
        />
      </NextLink>
    ) : (
      <Avatar
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
              appTheme.themeMode === "sunny"
                ? "secondary.light"
                : "secondary.dark",
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
          bgcolor:
            appTheme.themeMode === "sunny"
              ? "secondary.light"
              : "secondary.dark",
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
