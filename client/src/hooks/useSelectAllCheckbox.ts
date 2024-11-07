import * as React from "react";

const useSelectAllCheckbox = (totalSelected: number, totalItems: number) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !(
        totalSelected === 0 || totalSelected === totalItems
      );
    }
  }, [totalSelected, totalItems]);

  return inputRef;
};

export default useSelectAllCheckbox;
