/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";

import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import {
  Bold,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "@ckeditor/ckeditor5-basic-styles";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import type { EditorConfig } from "@ckeditor/ckeditor5-core";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { FindAndReplace } from "@ckeditor/ckeditor5-find-and-replace";
import {
  FontBackgroundColor,
  FontColor,
  FontSize,
} from "@ckeditor/ckeditor5-font";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { HorizontalLine } from "@ckeditor/ckeditor5-horizontal-line";
import {
  AutoImage,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from "@ckeditor/ckeditor5-image";
import { Indent, IndentBlock } from "@ckeditor/ckeditor5-indent";
import { AutoLink, Link, LinkImage } from "@ckeditor/ckeditor5-link";
import { List, ListProperties, TodoList } from "@ckeditor/ckeditor5-list";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office";
import { RemoveFormat } from "@ckeditor/ckeditor5-remove-format";
import { SelectAll } from "@ckeditor/ckeditor5-select-all";
import { ShowBlocks } from "@ckeditor/ckeditor5-show-blocks";
import {
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
} from "@ckeditor/ckeditor5-special-characters";
import {
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
} from "@ckeditor/ckeditor5-table";
import { TextTransformation } from "@ckeditor/ckeditor5-typing";
import { AccessibilityHelp } from "@ckeditor/ckeditor5-ui";
import { Undo } from "@ckeditor/ckeditor5-undo";
import { SimpleUploadAdapter } from "@ckeditor/ckeditor5-upload";

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
  public static override builtinPlugins = [
    AccessibilityHelp,
    Alignment,
    AutoImage,
    AutoLink,
    Autoformat,
    BlockQuote,
    Bold,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontSize,
    Heading,
    HorizontalLine,
    Image,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SelectAll,
    ShowBlocks,
    SimpleUploadAdapter,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    Undo,
  ];

  public static override defaultConfig: EditorConfig = {
    toolbar: {
      items: [
        "accessibilityHelp",
        "|",
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        {
          label: "Basic text styles",
          icon: "bold",
          items: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
          ],
        },
        {
          label: "Font styles",
          icon: "text",
          items: ["fontSize", "fontColor", "fontBackgroundColor"],
        },
        "|",
        {
          label: "Indentation",
          icon: "pilcrow",
          items: ["outdent", "indent"],
        },
        "alignment",
        "|",
        {
          label: "Embed content",
          icon: "plus",
          items: ["link", "imageInsert", "blockQuote", "insertTable"],
        },
        {
          label: "Insert lists",
          icon: "dragIndicator",
          items: ["numberedList", "bulletedList", "todoList"],
        },
        "horizontalLine",
        "specialCharacters",
        "|",
        "findAndReplace",
        "selectAll",
        "showBlocks",
        "|",
        "removeFormat",
      ],
      shouldNotGroupWhenFull: false,
    },
    language: "en",
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        {
          name: "image:inlineDropdown",
          title: "Inline styles",
          items: [
            "imageStyle:alignLeft",
            "imageStyle:inline",
            "imageStyle:alignRight",
          ],
          defaultItem: "imageStyle:alignLeft",
        },
        {
          name: "image:blockDropdown",
          title: "Block styles",
          items: [
            "imageStyle:alignBlockLeft",
            "imageStyle:alignCenter",
            "imageStyle:alignBlockRight",
          ],
          defaultItem: "imageStyle:alignCenter",
        },
        "|",
        "linkImage",
        "resizeImage",
      ],
      insert: { type: "auto" },
    },
    link: { allowedProtocols: ["https?", "tel", "mailto"] },
    list: { properties: { startIndex: true, reversed: true } },
    table: {
      contentToolbar: [
        "toggleTableCaption",
        "|",
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "|",
        "tableCellProperties",
        "tableProperties",
      ],
    },
  };
}

export default Editor;

