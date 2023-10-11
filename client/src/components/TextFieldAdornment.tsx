import InputAdornment, {
  type InputAdornmentProps,
} from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import type { MuiIconType } from "@types";

interface TextFieldAdornmentProps {
  position: InputAdornmentProps["position"];
  title: string;
  Icon: MuiIconType;
  onClick: () => void;
}

const TextFieldAdornment = (props: TextFieldAdornmentProps) => {
  const { position, title, Icon, onClick } = props;

  return (
    <InputAdornment position={position}>
      <Tooltip title={title}>
        <IconButton onClick={onClick} onMouseDown={e => e.preventDefault()}>
          <Icon />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );
};

export default TextFieldAdornment;
