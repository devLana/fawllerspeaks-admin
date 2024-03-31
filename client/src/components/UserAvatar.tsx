import Avatar, { type AvatarProps } from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import PersonIcon from "@mui/icons-material/Person";
import type { Theme } from "@mui/material/styles";

import useGetUserInfo from "@hooks/useGetUserInfo";
import NextLink from "./NextLink";
import type { SxPropsArray } from "@types";

interface UserAvatarProps {
  sx?: AvatarProps["sx"];
  renderWithLink?: boolean;
}

const UserAvatar = ({ renderWithLink = false, sx = [] }: UserAvatarProps) => {
  const userInfo = useGetUserInfo();
  const sxProp: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  if (!userInfo) {
    return (
      <Skeleton variant="circular" aria-label="Authenticating user profile">
        <Avatar sx={[{ bgcolor: "text.disabled" }, ...sxProp]}>
          <PersonIcon />
        </Avatar>
      </Skeleton>
    );
  }

  const { firstName, lastName, image } = userInfo;

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

  const bgcolor = (theme: Theme) => {
    return theme.appTheme.themeMode === "sunny"
      ? "secondary.light"
      : "secondary.dark";
  };

  return renderWithLink ? (
    <NextLink
      fontStyle="normal"
      href="/settings/me"
      aria-label={`${firstName} ${lastName} profile page`}
    >
      <Avatar
        sx={[{ bgcolor, color: "primary.main", fontSize: 17 }, ...sxProp]}
      >
        {initials}
      </Avatar>
    </NextLink>
  ) : (
    <Avatar
      aria-label={`${firstName} ${lastName} initials`}
      sx={[{ bgcolor, color: "primary.main", fontSize: 17 }, ...sxProp]}
    >
      {initials}
    </Avatar>
  );
};

export default UserAvatar;
