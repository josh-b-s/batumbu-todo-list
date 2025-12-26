import React from "react";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SimpleMenuBar from "./SimpleMenuBar";
import {useActivities} from "../contexts/ActivityContext";
import {useSubActivities} from "../contexts/SubActivityContext";
import {secondaryBgColor} from "../consts.ts";

export default function SubActivityDescBox({activityId}: { activityId: string }) {
    const {activity} = useSubActivities();
    const {changeDescription} = useActivities();

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                code: false,
                codeBlock: false,
                blockquote: false,
                strike: false,
                horizontalRule: false,
                hardBreak: false,
            }),
        ],
        editorProps: {
            attributes: {
                class: "p-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:pl-5 [&_ol]:list-decimal",
            },
        },

        content: activity?.description || "<p></p>",
        onUpdate: ({editor}) => {
            changeDescription(activityId, editor.getHTML());
        },
    });

    return (
        <div className={`${secondaryBgColor} rounded-xl p-3 mb-2`}>
            <p className="text-gray-500 font-bold mb-2">Deskripsi</p>
            <SimpleMenuBar editor={editor}/>
            <EditorContent editor={editor}/>
        </div>
    );
}
