import React,{ useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export default function NewsEditor(props) {
    const [editorState, seteditorState] = useState("");
    const onEditorStateChange = (editorState) => {
        seteditorState(editorState);
    }
    const editorBlur = (editorState) => {
        // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
        props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    }
    
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
                onBlur={()=>{
                    editorBlur(editorState)
                }}
            />
        </div>
    )
}
