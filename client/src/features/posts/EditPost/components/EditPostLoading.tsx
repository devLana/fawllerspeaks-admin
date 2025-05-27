import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import EditPostWrapper from "./EditPostWrapper";

const EditPostLoading = ({ id }: { id: string }) => (
  <EditPostWrapper ariaBusy={true} id={id}>
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <CircularProgress size="1.9em" aria-label="Loading edit blog post page" />
    </Box>
  </EditPostWrapper>
);

export default EditPostLoading;
