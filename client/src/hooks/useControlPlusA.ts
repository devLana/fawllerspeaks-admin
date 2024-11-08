import * as React from "react";

const useControlPlusA = (shouldNotSelect: boolean, callback: VoidFunction) => {
  React.useEffect(() => {
    const handleControlPlusA = (e: KeyboardEvent) => {
      if (shouldNotSelect && e.ctrlKey && (e.key === "A" || e.key === "a")) {
        callback();
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "A" || e.key === "a")) e.preventDefault();
    };

    window.addEventListener("keyup", handleControlPlusA);
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keyup", handleControlPlusA);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [shouldNotSelect, callback]);
};

export default useControlPlusA;
