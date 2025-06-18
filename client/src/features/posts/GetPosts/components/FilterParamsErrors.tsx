import AlertTitle from "@mui/material/AlertTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import type { FiltersErrors, RuntimeError } from "types/posts/getPosts";

interface FilterParamsErrorsProps {
  paramsErrors: FiltersErrors | RuntimeError;
}

const FilterParamsErrors = ({ paramsErrors }: FilterParamsErrorsProps) => {
  if (paramsErrors.errorType === "RuntimeError") {
    return `There was an error validating the provided search parameters. Please try again later`;
  }

  const { sort, status } = paramsErrors;

  return (
    <>
      <AlertTitle>
        It seems some of the search filters provided are invalid
      </AlertTitle>
      <List disablePadding sx={{ ml: 2.5 }}>
        {sort && (
          <ListItem disableGutters disablePadding>
            <ListItemText primary={`sort: ${sort}`} />
          </ListItem>
        )}
        {status && (
          <ListItem disableGutters disablePadding>
            <ListItemText primary={`status: ${status}`} />
          </ListItem>
        )}
      </List>
    </>
  );
};

export default FilterParamsErrors;
