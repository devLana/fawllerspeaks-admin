import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface TooltipHintProps {
  children: React.ReactElement;
  hint: string;
  childHasError?: boolean;
}

const TooltipHint = (props: TooltipHintProps) => {
  const { children, hint, childHasError = false } = props;

  return (
    <Box mb={childHasError ? 1.5 : 2.5} display="flex" columnGap={1.5}>
      {children}
      <Tooltip
        disableFocusListener
        title={hint}
        placement="bottom-end"
        sx={theme => ({
          mt: 0.375,
          [theme.breakpoints.down("sm")]: { display: "none" },
        })}
      >
        <HelpOutlineIcon fontSize="small" />
      </Tooltip>
    </Box>
  );
};

export default TooltipHint;
