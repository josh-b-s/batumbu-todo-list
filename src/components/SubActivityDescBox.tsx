import React, {useEffect, useState} from "react";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SimpleMenuBar from "./SimpleMenuBar";
import {useActivities} from "../contexts/ActivityContext";
import {useSubActivities} from "../contexts/SubActivityContext";
import {secondaryBgColor} from "../consts.ts";

export default function SubActivityDescBox({activityId}: { activityId: string }) {
    const {activity} = useSubActivities();
    const {changeDescription} = useActivities();

    const [draft, setDraft] = useState<string>(activity?.description ?? "<p></p>");
    const [editing, setEditing] = useState<boolean>(false);

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
                class:
                    "p-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:pl-5 [&_ol]:list-decimal border border-gray-500 rounded-xl",
            },
        },
        content: activity?.description ?? "<p></p>",
        editable: editing,
        onUpdate: ({editor}) => {
            if (editing) {
                setDraft(editor.getHTML());
            }
        },
    });

    useEffect(() => {
        const content = activity?.description ?? "<p></p>";
        setDraft(content);
        if (!editing && editor) {
            editor.commands.setContent(content);
        }
    }, [activity?.description, editor]);

    useEffect(() => {
        if (!editor) return;
        editor.setEditable(editing);
        if (editing) {
            editor.chain().focus().run();
        } else {
            editor.commands.setContent(draft);
        }
    }, [editing, editor, draft]);

    const onEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing(true);
    };

    const onCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        const original = activity?.description ?? "<p></p>";
        setDraft(original);
        if (editor) editor.commands.setContent(original);
        setEditing(false);
    };

    const onSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        changeDescription(activityId, draft);
        setEditing(false);
    };

    return (
        <div className={`${secondaryBgColor} rounded-xl p-3 mb-2`}>
            <div className="flex items-center justify-between mb-2">
                <p>Deskripsi</p>

                <div className="flex items-center gap-2">
                    {!editing ? (
                        <button
                            onClick={onEdit}
                            className="bg-batumbured rounded-md text-white font-bold px-3 py-1"
                            type="button"
                            key={"edit"}
                        >
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onSave}
                                className="bg-green-600 rounded-md text-white font-bold px-3 py-1"
                                type="button"
                            >
                                Save
                            </button>
                            <button
                                onClick={onCancel}
                                className="bg-batumbured text-white rounded-md font-bold px-3 py-1"
                                type="button"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            {editing && <SimpleMenuBar editor={editor}/>}

            <EditorContent editor={editor}/>
        </div>
    );
}
