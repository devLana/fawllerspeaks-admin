import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const TagMenu = ({ name }: { name: string }) => {
  return (
    <IconButton
      size="small"
      aria-label={`${name} post tag menu`}
      sx={{
        opacity: 0,
        transition: ({ transitions }) =>
          transitions.create("opacity", {
            easing: transitions.easing.easeInOut,
          }),
      }}
    >
      <MoreVertIcon />
    </IconButton>
  );
};
export default TagMenu;
