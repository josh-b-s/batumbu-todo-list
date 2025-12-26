import type {Editor} from "@tiptap/react";
import React from "react";

export default function SimpleMenuBar({editor}: { editor: Editor | null }) {
    if (!editor) return null;

    return (
        <div className="flex gap-2 mb-2">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={buttonStyle + (editor.isActive("bold") ? " bg-batumbured" : "")}
            >
                B
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={buttonStyle + (editor.isActive("italic") ? " bg-batumbured" : "")}
            >
                I
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonStyle + (editor.isActive("bulletList") ? " bg-batumbured" : "")}
            >
                • List
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonStyle + (editor.isActive("orderedList") ? " bg-batumbured" : "")}
            >
                1. List
            </button>
        </div>
    );
}

const buttonStyle = "border border-white rounded-lg px-2 ";