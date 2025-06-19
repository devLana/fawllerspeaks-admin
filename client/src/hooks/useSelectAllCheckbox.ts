import * as React from "react";

const useSelectAllCheckbox = (
  totalItemsSelected: number,
  totalItems: number
) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!inputRef.current) return;

    inputRef.current.indeterminate = !(
      totalItemsSelected === 0 || totalItemsSelected === totalItems
    );
  }, [totalItemsSelected, totalItems]);

  return inputRef;
};

export default useSelectAllCheckbox;
