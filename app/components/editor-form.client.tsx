import SunEditor from "suneditor-react";
import { type SunEditorReactProps } from "suneditor-react/dist/types/SunEditorReactProps";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const EditorForm = (props: SunEditorReactProps) => {
  return <SunEditor {...props} />;
};

export { EditorForm };
