import Box from "@mui/material/Box";

const PostContentView = ({ content }: { content: string }) => (
  <Box
    aria-label="post content"
    component="section"
    dangerouslySetInnerHTML={{ __html: content }}
    sx={({ appTheme, shape, typography, spacing, transitions }) => ({
      "--ck-image-style-spacing": spacing(3),
      "--ck-inline-image-style-spacing": spacing(1.5),
      "--ck-todo-list-checkmark-size": spacing(2),
      "--borderRadius": `${shape.borderRadius}px`,

      "& *,& *::before,& *::after": { m: 0, p: 0 },

      "& h2": { ...typography.h2, "&:not(:first-of-type)": { mt: 6 }, mb: 3.5 },
      "& h3": { ...typography.h3, mt: 7, mb: 2.5 },
      "& h4": { ...typography.h4, mt: 7, mb: 2.5 },
      "& h5": { ...typography.h5, mt: 7, mb: 2.5 },
      "& p": { ...typography.body1, "&:not(:last-child)": { mb: 3 } },

      "& blockquote": {
        "&:not(:last-child)": { mb: 3 },
        overflow: "hidden",
        px: 2,
        py: 1.25,
        borderLeft: "4px solid",
        borderLeftColor: "primary.main",
        bgcolor: "action.selected",
        borderTopRightRadius: "var(--borderRadius)",
        borderBottomRightRadius: "var(--borderRadius)",
      },

      "& .text-tiny": { fontSize: ".7em" },
      "& .text-small": { fontSize: ".85em" },
      "& .text-big": { fontSize: "1.5em" },
      "& .text-huge": { fontSize: "2em" },
      "& hr": { bgcolor: "divider", height: "3px", my: 4, border: 0 },

      "& a": {
        color: "primary.main",
        fontWeight: "bold",
        fontStyle: "oblique",
        textDecoration: "underline",
        transition: transitions.create("color"),
        "&:hover": {
          color:
            appTheme.themeMode === "sunny" ? "primary.dark" : "primary.light",
        },
      },

      "& figure>figcaption": {
        mt: 1,
        display: "table-caption",
        captionSide: "bottom",
        wordBreak: "break-word",
        color: "text.secondary",
        fontSize: ".75em",
        outlineOffset: "-1px",
      },

      "& img": { borderRadius: 1, maxWidth: "100%", height: "auto" },

      "& .image": {
        clear: "both",
        display: "table",
        textAlign: "center",
        m: `${spacing(1.85)} auto`,
        minWidth: 50,
      },

      "& .image img": { display: "block", minWidth: "100%" },
      "& .image.image_resized": { maxWidth: "100%", display: "block" },
      "& .image.image_resized img": { width: "100%" },

      "& .image-inline": {
        maxWidth: "100%",
        display: "inline-flex",
        alignItems: "flex-start",
      },

      "& .image-inline picture": { display: "flex" },

      "& .image-inline picture,& .image-inline img": {
        flexGrow: 1,
        flexShrink: 1,
        maxWidth: "100%",
      },

      "& .image-style-block-align-left,& .image-style-block-align-right": {
        maxWidth: "calc(100% - var(--ck-image-style-spacing))",
      },

      "& .image-style-block-align-right": { mr: 0, ml: "auto" },
      "& .image-style-block-align-left": { ml: 0, mr: "auto" },

      "& .image-style-side": {
        float: "right",
        ml: "var(--ck-image-style-spacing)",
        maxWidth: "50%",
      },

      "& .image-style-align-center": { mx: "auto" },

      "& .image-style-align-left,& .image-style-align-right": {
        mb: 1,
        clear: "none",
      },

      "& .image-style-align-left": {
        float: "left",
        mr: "var(--ck-image-style-spacing)",
      },

      "& .image-style-align-right": {
        float: "right",
        ml: "var(--ck-image-style-spacing)",
      },

      "& p+.image-style-align-left,& p+.image-style-align-right,& p+.image-style-side":
        { mt: 0 },

      "& .image-inline.image-style-align-left,& .image-inline.image-style-align-right":
        { my: "var(--ck-inline-image-style-spacing)" },

      "& .image-inline.image-style-align-left": {
        mr: "var(--ck-inline-image-style-spacing)",
      },

      "& .image-inline.image-style-align-right": {
        ml: "var(--ck-inline-image-style-spacing)",
      },

      "& .image.image_resized>figcaption": { display: "block" },
      "& .table .ck-table-resized": { tableLayout: "fixed" },
      "& .table>figcaption": { textAlign: "center" },

      "& .table table": {
        overflow: "hidden",
        borderCollapse: "collapse",
        borderSpacing: 0,
        width: "100%",
        height: "100%",
        border: "1px double hsl(0, 0%, 70%)",
      },

      "& .table": { m: `${spacing(2)} auto`, display: "table" },

      "& .table td,& .table th": {
        overflowWrap: "break-word",
        position: "relative",
        p: 1,
        minWidth: "2em",
        border: "1px solid",
        borderColor: "text.secondary",
      },

      "& .table table th": {
        fontWeight: "bold",
        bgcolor: "action.disabledBackground",
      },

      '&[dir="ltr"] .table th': { texAlign: "left" },
      "& ol": { listStyleType: "decimal", pl: 2.25 },
      "& ol ol": { listStyleType: "lower-latin" },
      "& ol ol ol": { listStyleType: "lower-roman" },
      "& ol ol ol ol": { listStyleType: "upper-latin" },
      "& ol ol ol ol ol": { listStyleType: "upper-roman" },
      "& ul:not(.todo-list)": { listStyleType: "disc", pl: 2.25 },
      "& ul ul": { listStyleType: "circle" },
      "& ul ul ul": { listStyleType: "square" },
      "& ul ul ul ul": { listStyleType: "square" },
      "& .todo-list": { listStyle: "none", pl: 0.25 },
      "& .todo-list li": { position: "relative", mb: 0.625 },
      "& .todo-list li .todo-list": { mt: 0.625 },

      "& .todo-list .todo-list__label>input": {
        WebkitAppearance: "none",
        display: "inline-block",
        position: "relative",
        width: "var(--ck-todo-list-checkmark-size)",
        height: "var(--ck-todo-list-checkmark-size)",
        verticalAlign: "middle",
        mr: 2,
      },

      "& .todo-list .todo-list__label>input::before": {
        display: "block",
        position: "absolute",
        content: '""',
        width: "100%",
        height: "100%",
        border: "1px solid",
        borderColor: "text.disabled",
        borderRadius: 1,
        transition: transitions.create("box-shadow", {
          easing: transitions.easing.easeInOut,
          duration: transitions.duration.short,
        }),
      },

      "& .todo-list .todo-list__label>input::after": {
        display: "block",
        position: "absolute",
        boxSizing: "content-box",
        pointerEvents: "none",
        content: '""',
        left: "calc( var(--ck-todo-list-checkmark-size) / 3 )",
        top: "calc( var(--ck-todo-list-checkmark-size) / 5.3 )",
        width: "calc( var(--ck-todo-list-checkmark-size) / 5.3 )",
        height: "calc( var(--ck-todo-list-checkmark-size) / 2.6 )",
        borderStyle: "solid",
        borderColor: "transparent",
        borderWidth:
          "0 calc( var(--ck-todo-list-checkmark-size) / 8 ) calc( var(--ck-todo-list-checkmark-size) / 8 ) 0",
        transform: "rotate(45deg)",
      },

      "& .todo-list .todo-list__label>input[checked]::before": {
        bgcolor: "primary.main",
        borderColor: "primary.main",
      },

      "& .todo-list .todo-list__label>input[checked]::after": {
        borderColor: "secondary.dark",
      },

      "& .todo-list .todo-list__label .todo-list__label__description": {
        verticalAlign: "middle",
      },

      "& .todo-list .todo-list__label.todo-list__label_without-description input[type=checkbox]":
        { position: "absolute" },
    })}
  />
);

export default PostContentView;
