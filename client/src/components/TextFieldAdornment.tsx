import InputAdornment, {
  type InputAdornmentProps,
} from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import IconButton, { type IconButtonProps } from "@mui/material/IconButton";

import type { MuiIconType } from "@types";

interface TextFieldAdornmentProps {
  color?: IconButtonProps["color"];
  position: InputAdornmentProps["position"];
  title: string;
  iconEdge?: IconButtonProps["edge"];
  Icon: MuiIconType;
  onClick: () => void;
}

const TextFieldAdornment = ({
  color = "secondary",
  position,
  title,
  iconEdge = false,
  Icon,
  onClick,
}: TextFieldAdornmentProps) => {
  return (
    <InputAdornment position={position}>
      <Tooltip title={title}>
        <IconButton
          edge={iconEdge}
          color={color}
          size="small"
          onClick={onClick}
          onMouseDown={e => e.preventDefault()}
        >
          <Icon fontSize="small" />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );
};

export default TextFieldAdornment;
