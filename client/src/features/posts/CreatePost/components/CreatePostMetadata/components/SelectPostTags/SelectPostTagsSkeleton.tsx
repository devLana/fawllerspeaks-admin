import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const SelectPostTagsSkeleton = () => (
  <Box
    aria-busy="true"
    mb={2.5}
    display="flex"
    columnGap={1.5}
    alignItems="flex-start"
  >
    <Skeleton variant="rounded" width="auto" sx={{ flexGrow: 1 }}>
      <TextField />
    </Skeleton>
    <Skeleton
      variant="circular"
      sx={theme => ({
        [theme.breakpoints.down("sm")]: { display: "none" },
        [theme.breakpoints.up("sm")]: { mt: 0.625, lineHeight: 0 },
      })}
    >
      <HelpOutlineIcon fontSize="small" />
    </Skeleton>
  </Box>
);

export default SelectPostTagsSkeleton;