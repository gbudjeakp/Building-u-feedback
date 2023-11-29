import { useState } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor,useCurrentEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addFeedback } from "../features/Feedbacks/feedbackSlice";
import { Button, Text } from "@mantine/core";

function TextEditor({ isMentor, feedbackrequestId}) {
  const [feedback, setFeedback] = useState("");
  const dispatch = useDispatch();

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: feedback,
    onUpdate({ editor }) {
      setFeedback(editor?.getText() || '');
    }
  });


  const handleSubmit = () => {
    editor.commands.insertContent(feedback)
    dispatch(addFeedback(feedbackrequestId, feedback));
    editor.commands.setContent("");
    console.log(feedback);
  };

  return (
    <>
    {isMentor && (
     <div>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
      <Button
        style={{ color: "black", marginTop: "20px" }}
        color="#F9EB02"
        onClick={handleSubmit}
      >
        Submit Feedback
      </Button>
     </div>
    )}
    </>
  );
}

export default TextEditor;
