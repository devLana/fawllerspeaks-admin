import Box from "@mui/material/Box";
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

  return (
    <Box
      aria-busy={addAriaBusy ? false : undefined}
      sx={{
        mb: 2.5,
        display: "flex",
        columnGap: 1.5,
        alignItems: "flex-start",
      }}
    >
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
