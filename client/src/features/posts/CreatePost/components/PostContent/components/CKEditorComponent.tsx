// import { styled } from "@mui/material/styles";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorComponentProps {
  data: string;
  onChange: (newData: string) => void;
}

// const Editor = styled(CKEditor)({});

const CKEditorComponent = ({ data, onChange }: CKEditorComponentProps) => (
  <>
    <CKEditor
      id="pont-content-editor"
      editor={ClassicEditor}
      data={data}
      onChange={(_event, editor) => {
        console.log(_event);

        const newData = editor.getData();
        onChange(newData);
      }}
      onBlur={(_event, editor) => {}}
      onFocus={(_event, editor) => {}}
      config={{}}
    />
    {/* <Editor
      id="pont-content-editor"
      editor={ClassicEditor}
      data={data}
      onChange={(_event, editor) => {
        console.log(_event);

        const newData = editor.getData();
        onChange(newData);
      }}
      onBlur={(_event, editor) => {}}
      onFocus={(_event, editor) => {}}
      config={{}}
    /> */}
  </>
);

export default CKEditorComponent;
