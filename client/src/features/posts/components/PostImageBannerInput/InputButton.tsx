import Button from "@mui/material/Button";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";

interface PostImageBannerInputButtonProps {
  id: string;
  label: string;
  hasError: boolean;
  hasEnteredDropZone: boolean;
  onDrop: (event: React.DragEvent<HTMLLabelElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLLabelElement>) => void;
  onDragEnter: (event: React.DragEvent<HTMLLabelElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLLabelElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLLabelElement>) => void;
}

const PostImageBannerInputButton = ({
  id,
  label,
  hasError,
  hasEnteredDropZone,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onKeyDown,
}: PostImageBannerInputButtonProps) => (
  <Button
    variant="outlined"
    component="label"
    htmlFor={id}
    role={undefined}
    startIcon={<AddPhotoAlternateOutlinedIcon />}
    onDrop={onDrop}
    onDragOver={onDragOver}
    onDragEnter={onDragEnter}
    onDragLeave={onDragLeave}
    onKeyDown={onKeyDown}
    sx={theme => ({
      color: hasError ? "error.main" : "text.secondary",
      fontSize: "1rem",
      fontWeight: 400,
      width: "100%",
      borderColor: hasError ? "error.main" : "action.active",
      transition: "none",
      "&:hover": {
        color: hasError ? "error.main" : "text.secondary",
        bgcolor: "transparent",
        borderColor: hasError ? "error.main" : "text.primary",
      },
      [theme.breakpoints.down("md")]: {
        py: 1.625,
        pl: 2.25,
        justifyContent: "flex-start",
      },
      [theme.breakpoints.up("md")]: {
        height: 280,
        ...(hasEnteredDropZone && { borderStyle: "dashed" }),
      },
    })}
  >
    {label}
  </Button>
);

export default PostImageBannerInputButton;
