import React,{ useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export default function NewsEditor(props) {
    const [editorState, seteditorState] = useState("");
    const onEditorStateChange = (editorState) => {
        seteditorState(editorState);
    }
    useEffect(()=>{
        const html = props.content;
        if(html === undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          seteditorState(editorState)
        }
    },[props.content])
    const editorBlur = (editorState) => {
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
