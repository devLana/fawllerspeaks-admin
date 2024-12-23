import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import ViewPostWrapper from "./ViewPostWrapper";

const ViewPostLoading = ({ label }: { label: string }) => (
  <ViewPostWrapper ariaBusy={true} label={label}>
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <CircularProgress size="1.9em" aria-label="Loading view post page" />
    </Box>
  </ViewPostWrapper>
);

export default ViewPostLoading;
