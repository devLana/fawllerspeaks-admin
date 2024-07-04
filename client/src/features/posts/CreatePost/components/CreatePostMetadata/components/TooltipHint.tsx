import Box, { type BoxProps } from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface TooltipHintProps {
  children: React.ReactElement;
  hint: string;
  addAriaBusy?: boolean;
}

const TooltipHint = (props: TooltipHintProps) => {
  const { children, hint, addAriaBusy = false } = props;

  const boxProps: BoxProps = {
    mb: 2.5,
    display: "flex",
    columnGap: 1.5,
    alignItems: "flex-start",
    ...(addAriaBusy ? { "aria-busy": false } : {}),
  };

  return (
    <Box {...boxProps}>
      {children}
      <Tooltip disableFocusListener title={hint} placement="bottom-end">
        <Typography
          variant="caption"
          color="info"
          mt={0.625}
          lineHeight={0}
          sx={theme => ({
            [theme.breakpoints.down("sm")]: { display: "none" },
          })}
        >
          <HelpOutlineIcon fontSize="small" />
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default TooltipHint;
