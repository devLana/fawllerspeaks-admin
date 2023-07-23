import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

interface PasswordAdornmentProps {
  isVisible: boolean;
  onClick: () => void;
}

const PasswordAdornment = ({ isVisible, onClick }: PasswordAdornmentProps) => (
  <InputAdornment position="end">
    <Tooltip title={`${isVisible ? "Hide" : "Show"} password`}>
      <IconButton
        aria-label={`${isVisible ? "Hide" : "Show"} password`}
        onClick={onClick}
        onMouseDown={e => e.preventDefault()}
        edge="end"
      >
        {isVisible ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
      </IconButton>
    </Tooltip>
  </InputAdornment>
);

export default PasswordAdornment;
