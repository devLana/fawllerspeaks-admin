import * as React from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";

import { useAuthHeader } from "@context/AuthHeader";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomEditor from "ckeditor5-custom-build";

interface CKEditorComponentProps {
  data: string;
  onChange: (newData: string) => void;
}

const CKEditorComponent = ({ data, onChange }: CKEditorComponentProps) => {
  const ckEditorRef = React.useRef<CustomEditor | null>(null);

  const mq = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const { jwt } = useAuthHeader();

  React.useEffect(() => {
    if (ckEditorRef.current) {
      ckEditorRef.current.ui.viewportOffset = { top: mq ? 64 : 56 };
    }
  }, [mq]);

  return (
    <Box
      mb={4}
      sx={({ shape, typography, palette, shadows, spacing }) => ({
        "--ck-color-toolbar-background": palette.background.default,
        "--ck-color-base-background": palette.background.default,
        "--ck-color-toolbar-border": palette.divider,
        "--ck-color-text": palette.text.primary,
        "--ck-color-button-on-color": palette.text.primary,
        "--ck-color-button-default-hover-background": palette.action.hover,
        "--ck-color-button-default-active-background": palette.action.active,
        "--ck-color-button-on-background": palette.action.active,
        "--ck-color-button-on-hover-background": palette.action.active,
        "--ck-color-button-on-active-background": palette.action.active,
        "--ck-focus-ring": `1px solid ${palette.action.selected}`,
        "--ck-focus-outer-shadow": shadows[4],
        "--ck-spacing-small": spacing(0.75),
        "--ck-color-dropdown-panel-border": palette.text.disabled,
        "--ck-color-dropdown-panel-background": palette.background.default,
        "--ck-drop-shadow": shadows[5],
        "--ck-color-list-background": palette.background.default,
        "--ck-color-list-button-hover-background": palette.action.hover,
        "--ck-color-list-button-on-background": palette.action.active,
        "--ck-color-list-button-on-background-focus": palette.action.active,
        "--ck-color-input-disabled-text": palette.text.secondary,
        "--ck-color-input-border": palette.text.disabled,
        "--ck-color-labeled-field-label-background": palette.background.default,
        "--ck-color-split-button-hover-background": palette.action.selected,
        "--ck-color-split-button-hover-border": palette.divider,
        "--ck-image-insert-insert-by-url-width": 0,
        "--ck-color-focus-outer-shadow": palette.background.default,
        "--ck-color-base-border": palette.text.disabled,
        "--ck-color-focus-border": palette.text.primary,
        "--ck-color-link-selected-background": palette.action.selected,

        "&>.ck-editor>.ck-editor__top": { mb: 1 },

        "&>.ck-editor>.ck-editor__top>.ck-sticky-panel>.ck.ck-sticky-panel__content":
          { borderColor: "divider", borderRadius: 1, borderWidth: 1 },

        "&>.ck-editor>.ck-editor__top>.ck-sticky-panel .ck.ck-toolbar": {
          borderRadius: 1,
        },

        "&>.ck-editor>.ck-editor__top>.ck-sticky-panel>.ck.ck-sticky-panel__content_sticky,&>.ck-editor>.ck-editor__top>.ck-sticky-panel>.ck.ck-sticky-panel__content_sticky>.ck.ck-toolbar":
          { borderRadius: 0 },

        "&>.ck.ck-editor .ck.ck-sticky-panel__content .ck.ck-button": {
          cursor: "pointer",
        },

        "&>.ck.ck-editor .ck-sticky-panel__content>.ck-toolbar>.ck-toolbar__items>.ck-button,&>.ck.ck-editor .ck.ck-sticky-panel__content>.ck-toolbar>.ck-toolbar__items .ck-dropdown>.ck-dropdown__button,&>.ck.ck-editor .ck.ck-toolbar__nested-toolbar-dropdown .ck-toolbar__items>.ck-button,&>.ck-editor .ck.ck-toolbar>.ck.ck-toolbar__items .ck-button-save,&>.ck-editor .ck.ck-toolbar>.ck.ck-toolbar__items .ck-button-cancel,&>.ck.ck-editor .ck.ck-color-selector .ck-color-grid>.ck-color-grid__tile,&>.ck.ck-editor .ck-insert-table-dropdown__grid>.ck.ck-button.ck-insert-table-dropdown-grid-box,&>.ck.ck-editor .ck-toolbar__items>.ck-list-styles-dropdown .ck-list-properties>.ck-list-styles-list>.ck-button,&>.ck.ck-editor .ck-toolbar__items .ck.ck-character-grid__tiles>.ck-character-grid__tile,&>.ck-editor .ck.ck-toolbar__items~.ck-dropdown.ck-toolbar__grouped-dropdown>.ck-button,&>.ck-editor .ck.ck-toolbar__items~.ck-dropdown.ck-toolbar__grouped-dropdown .ck-toolbar__items>.ck-button":
          { borderRadius: 1 },

        "&>.ck.ck-editor .ck.ck-toolbar__items .ck.ck-disabled": {
          color: "text.disabled",
          cursor: "not-allowed",
        },

        "&>.ck-editor .ck.ck-toolbar__items>.ck.ck-heading-dropdown>.ck-button":
          { columnGap: 1.25 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-heading-dropdown .ck-button__label":
          { width: "auto" },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-heading-dropdown .ck-icon": {
          ml: 0,
        },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-dropdown:not(.ck-toolbar__nested-toolbar-dropdown) .ck-dropdown__panel":
          { py: 0.75, borderRadius: 1 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown>.ck-dropdown__panel,&>.ck-editor .ck.ck-toolbar__items~.ck-dropdown.ck-toolbar__grouped-dropdown>.ck-dropdown__panel":
          { borderRadius: 1 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-heading-dropdown .ck-list__item,&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck-font-size-dropdown .ck-list__item":
          { minWidth: 0 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-heading-dropdown .ck-heading_paragraph":
          { fontSize: 16 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-heading-dropdown .ck-heading_heading2":
          { fontSize: 20 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-heading-dropdown .ck-heading_heading3":
          { fontSize: 18 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-heading-dropdown .ck-heading_heading4":
          { fontSize: 16 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-heading-dropdown .ck-heading_heading5":
          { fontSize: 14 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck-font-size-dropdown .text-tiny":
          { fontSize: 12 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck-font-size-dropdown .text-small":
          { fontSize: 13 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck-font-size-dropdown .text-default":
          { fontSize: 16 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck-font-size-dropdown .text-big":
          { fontSize: 18 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck-font-size-dropdown .text-huge":
          { fontSize: 20 },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck.ck-input":
          {
            borderWidth: 2,
            borderRadius: 1,
            bgcolor: "transparent",
            color: "text.primary",
          },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck.ck-input::placeholder":
          { color: "text.disabled" },

        "&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck.ck-input_focused,&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck.ck-input:focus":
          { borderColor: "primary.main", color: "text.primary" },

        "&>.ck-editor .ck.ck-toolbar__items .ck.ck-splitbutton>.ck-button:first-of-type":
          {
            borderTopLeftRadius: `${shape.borderRadius}px`,
            borderBottomLeftRadius: `${shape.borderRadius}px`,
          },

        "&>.ck-editor .ck.ck-toolbar__items .ck.ck-splitbutton>.ck-button:last-of-type":
          {
            borderTopRightRadius: `${shape.borderRadius}px`,
            borderBottomRightRadius: `${shape.borderRadius}px`,
          },

        "&>.ck-editor .ck.ck-toolbar__items .ck-color-ui-dropdown .ck-color-selector .ck-color-picker,&>.ck-editor .ck.ck-toolbar__items .ck-insert-table-dropdown__grid,&>.ck-editor .ck.ck-toolbar__items .ck-list-properties>.ck-list-styles-list":
          { pt: 0 },

        "&>.ck-editor .ck.ck-toolbar__items .ck-color-ui-dropdown .ck-color-selector .ck-color-selector_action-bar,&>.ck-editor .ck.ck-toolbar__items>.ck-toolbar__nested-toolbar-dropdown .ck-collapsible>.ck-collapsible__children,&>.ck-editor .ck.ck-toolbar__items .ck-list-properties>.ck-list-styles-list[aria-label^=Bulleted],&>.ck-editor .ck-toolbar__items .ck-dropdown>[data-cke-tooltip-text='Special characters']+.ck-dropdown__panel .ck-character-info":
          { pb: 0 },

        "&>.ck-editor .ck-toolbar__items .ck-dropdown>[data-cke-tooltip-text='Special characters']+.ck-dropdown__panel .ck-form__header":
          { py: 0 },

        "&>.ck-editor>.ck-editor__main>.ck.ck-content": {
          minHeight: 400,
          borderColor: "divider",
          borderRadius: 1,
        },

        "&>.ck-editor>.ck-editor__main>.ck-content:hover": {
          borderColor: "action.disabled",
        },

        "&:focus-within>.ck-editor>.ck-editor__top>.ck-sticky-panel>.ck-sticky-panel__content,&>.ck-editor>.ck-editor__main>.ck-content.ck-focused":
          { borderColor: "primary.main" },

        "&>.ck-editor>.ck-editor__main>.ck-content h2": {
          fontSize: typography.h2.fontSize,
          fontWeight: typography.h2.fontWeight,
          lineHeight: typography.h2.lineHeight,
        },

        "&>.ck-editor>.ck-editor__main>.ck-content h3": {
          fontSize: typography.h3.fontSize,
          fontWeight: typography.h3.fontWeight,
          lineHeight: typography.h3.lineHeight,
        },

        "&>.ck-editor>.ck-editor__main>.ck-content h4": {
          fontSize: typography.h4.fontSize,
          fontWeight: typography.h4.fontWeight,
          lineHeight: typography.h4.lineHeight,
        },

        "&>.ck-editor>.ck-editor__main>.ck-content p": {
          fontSize: typography.body1.fontSize,
          fontWeight: typography.body1.fontWeight,
        },

        "&>.ck-editor>.ck-editor__main>.ck-content blockquote": {
          borderLeftColor: "primary.main",
          bgcolor: "action.selected",
          borderTopRightRadius: `${shape.borderRadius}px`,
          borderBottomRightRadius: `${shape.borderRadius}px`,
        },

        "&>.ck-editor>.ck-editor__main>.ck-content .text-big": {
          fontSize: "1.5em",
        },

        "&>.ck-editor>.ck-editor__main>.ck-content .text-huge": {
          fontSize: "2em",
        },

        "&>.ck-editor>.ck-editor__main>.ck-content hr": {
          bgcolor: "divider",
          height: "3px",
        },

        "&>.ck-editor>.ck-editor__main>.ck-content figcaption:not(.ck-editor__nested-editable_focused)":
          { bgcolor: "transparent", color: "text.secondary" },

        "&>.ck-editor>.ck-editor__main>.ck-content img": { borderRadius: 1 },

        "&>.ck-editor>.ck-editor__main>.ck-content a": {
          color: "primary.main",
          textDecoration: "none",
        },

        "&>.ck-editor>.ck-editor__main>.ck-content a:not(.ck-link_selected):hover":
          { textDecoration: "underline" },

        "&>.ck-editor>.ck-editor__main>.ck-content .table>figcaption": {
          captionSide: "bottom",
        },

        "&>.ck-editor>.ck-editor__main>.ck-content .todo-list__label input[type=checkbox]::before":
          { borderColor: "text.secondary" },
      })}
    >
      <CKEditor
        editor={CustomEditor}
        data={data}
        onBlur={(_, editorRef) => onChange(editorRef.getData())}
        onReady={editorRef => {
          ckEditorRef.current = editorRef;
        }}
        onError={() => {
          ckEditorRef.current = null;
        }}
        config={{
          ui: { viewportOffset: { top: mq ? 64 : 56 } },
          link: {
            decorators: {
              openInNewTab: {
                mode: "automatic",
                attributes: { target: "_blank", rel: "noopener noreferrer" },
                callback(url) {
                  if (!url) return true;

                  if (url.includes("fawllerspeaks.com")) return false;

                  const regex = /^(https?:\/\/)?(w{3}\.)?[\w.-]+\.[a-z]{2,4}/i;
                  if (url.startsWith("//") || regex.test(url)) return true;

                  return false;
                },
              },
            },
          },
          simpleUpload: {
            uploadUrl: "", // TODO
            headers: { Authorization: `Bearer ${jwt}` },
            // withCredentials: true,
          },
        }}
      />
    </Box>
  );
};

export default CKEditorComponent;
