import * as React from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";

import type CustomEditor from "ckeditor5-custom-build";

const useCKEditor = (id: string, contentHasError: boolean) => {
  const ckEditorRef = React.useRef<CustomEditor | null>(null);
  const mq = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  const topOffset = mq ? 64 : 56;

  React.useEffect(() => {
    if (ckEditorRef.current) {
      ckEditorRef.current.ui.viewportOffset = { top: topOffset };
    }
  }, [topOffset]);

  React.useEffect(() => {
    if (ckEditorRef.current) {
      const { view } = ckEditorRef.current.editing;

      view.change(writer => {
        const editableRoot = view.document.getRoot();

        if (editableRoot) {
          writer.setAttribute("aria-invalid", contentHasError, editableRoot);

          if (contentHasError) {
            writer.setAttribute("aria-errormessage", id, editableRoot);
            writer.setAttribute("aria-describedby", id, editableRoot);
          } else {
            writer.removeAttribute("aria-errormessage", editableRoot);
            writer.removeAttribute("aria-describedby", editableRoot);
          }
        }
      });
    }
  }, [contentHasError, id]);

  return { ckEditorRef, topOffset };
};

export default useCKEditor;
