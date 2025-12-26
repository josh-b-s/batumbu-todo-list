import type {Editor} from "@tiptap/react";
import {useEditorState} from "@tiptap/react";
import React from "react";

const buttonStyle = "border border-gray-500 rounded-lg px-2 ";

export default function SimpleMenuBar({editor}: { editor: Editor | null }) {
    if (!editor) return null;

    const state = useEditorState({
        editor,
        selector: (ctx) => ({
            isBold: ctx.editor.isActive("bold") ?? false,
            isItalic: ctx.editor.isActive("italic") ?? false,
            isBulletList: ctx.editor.isActive("bulletList") ?? false,
            isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        }),
    });

    return (
        <div className="flex gap-2 mb-2">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`${buttonStyle} ${state.isBold ? "bg-batumbured text-white" : ""}`}
            >
                B
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`${buttonStyle} ${state.isItalic ? "bg-batumbured text-white" : ""}`}
            >
                I
            </button>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`${buttonStyle} ${state.isBulletList ? "bg-batumbured text-white" : ""}`}
            >
                • List
            </button>

            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${buttonStyle} ${state.isOrderedList ? "bg-batumbured text-white" : ""}`}
            >
                1. List
            </button>
        </div>
    );
}
