import Typography from "@mui/material/Typography";

const EditPostTagDescription = ({ name }: { name: string }) => (
  <>
    Edit post tag&nbsp;
    <Typography variant="caption" fontSize="1em" fontWeight="bold">
      {name}
    </Typography>
  </>
);

export default EditPostTagDescription;
