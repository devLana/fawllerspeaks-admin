import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const EditPostPreviewSkeleton = () => (
  <section
    aria-live="polite"
    aria-busy="false"
    aria-label="Preview edited post"
  >
    <Box
      sx={{
        mb: 4.5,
        display: "flex",
        columnGap: 2,
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <Skeleton variant="circular" width={38} height={38} />
      <Skeleton variant="rounded" width={120} height={35} />
    </Box>
    <Box
      sx={{
        display: { md: "grid" },
        gridTemplateColumns: { md: "1.2fr 2fr" },
        gridTemplateRows: { md: "auto auto" },
        columnGap: { md: 4 },
        rowGap: { md: 5 },
      }}
    >
      <Box
        component="aside"
        sx={({ breakpoints: { down } }) => ({
          [down("md")]: {
            pb: 5,
            mb: 5,
            borderBottom: "1px solid",
            borderBottomColor: "divider",
          },
          p: { md: 2 },
          border: { md: "1px solid" },
          borderColor: { md: "divider" },
          borderRadius: { md: 1 },
          gridArea: { md: "1 / 1 / 3 / 2" },
          alignSelf: { md: "start" },
        })}
      >
        <Skeleton
          variant="text"
          width={210}
          sx={{ fontSize: "1.5em", mb: 0.5 }}
        />
        <Skeleton variant="rounded" height={50} sx={{ mb: 4 }} />
        <Skeleton
          variant="text"
          width={210}
          sx={{ fontSize: "1.5em", mb: 0.5 }}
        />
        <Skeleton variant="rounded" height={100} />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.25,
            mt: 3,
            pt: { md: 3 },
            borderTop: { md: "1px solid" },
            borderColor: { md: "divider" },
          }}
        >
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="rounded" width={180} height={32} />
          <Skeleton variant="rounded" width={100} height={32} />
          <Skeleton variant="rounded" width={150} height={32} />
          <Skeleton variant="rounded" width={70} height={32} />
          <Skeleton variant="rounded" width={150} height={32} />
        </Box>
      </Box>
      <Box
        component="article"
        sx={({ breakpoints: { down } }) => ({
          [down("md")]: { mb: 5 },
          pb: 5,
          borderBottom: "1px solid",
          borderColor: "divider",
          gridArea: { md: "1 / 2 / 2 / 3" },
        })}
      >
        <Skeleton variant="text" sx={{ fontSize: "2.5em", mb: 2 }} />
        <Skeleton
          variant="rounded"
          sx={{
            height: { xs: 200, sm: 250, md: 300 },
            maxWidth: 700,
            mb: 3,
            mx: "auto",
          }}
        />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width={200} sx={{ mb: 3 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width={200} sx={{ mb: 3 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width={200} sx={{ mb: 3 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width={200} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Skeleton variant="rounded" height={37} width={145} />
      </Box>
    </Box>
  </section>
);

export default EditPostPreviewSkeleton;
