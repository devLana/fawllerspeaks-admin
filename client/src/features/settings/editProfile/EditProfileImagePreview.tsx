import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";

interface EditProfileImagePreviewProps {
  id: string;
  src: string;
  alt: string;
  onClick: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLLabelElement>;
}

const EditProfileImagePreview = (props: EditProfileImagePreviewProps) => {
  const { id, src, alt, onClick, onKeyDown } = props;

  return (
    <div>
      <Avatar
        src={src}
        alt={alt}
        sx={{ width: 200, height: 200, mb: 2, mx: "auto" }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          rowGap: 1,
          columnGap: 2,
        }}
      >
        <Button
          size="small"
          onClick={onClick}
          startIcon={<HideImageOutlinedIcon />}
        >
          Remove Image
        </Button>
        <Button
          variant="outlined"
          size="small"
          component="label"
          htmlFor={id}
          startIcon={<AddPhotoAlternateOutlinedIcon />}
          onKeyDown={onKeyDown}
        >
          Change Image
        </Button>
      </Box>
    </div>
  );
};

export default EditProfileImagePreview;
