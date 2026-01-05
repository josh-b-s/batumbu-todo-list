import React, {useState} from "react";
import {useActivities} from "../contexts/ActivityContext";
import {useSubActivities} from "../contexts/SubActivityContext";
import {useAccount} from "../contexts/AccountContext";
import {formatDate} from "../helpers/formatDate";
import {UserComment} from "../types/account";
import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CommentSection() {
    const {activity} = useSubActivities();
    const {setActivities} = useActivities();
    const {account} = useAccount();

    const comments: UserComment[] = activity?.comments ?? [];
    const [isEmptyError, setIsEmptyError] = useState(false);

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
                    "p-3 min-h-[10rem] border border-gray-500 rounded-2xl bg-transparent focus:outline-none",
            },
        },
        content: "",
        onUpdate: () => {
            setIsEmptyError(false);
        },
    });

    const addComment = () => {
        if (!editor || !account) return;

        const html = editor.getHTML().trim();
        const plainText = editor.getText().trim();

        if (!plainText) {
            setIsEmptyError(true);
            return;
        }

        const newComment: UserComment = {
            id: crypto.randomUUID(),
            user: account,
            date: new Date(),
            comment: html,
        };

        setActivities(prev =>
            prev.map(a =>
                a.id === activity?.id
                    ? {...a, comments: [...(a.comments ?? []), newComment]}
                    : a
            )
        );

        editor.commands.clearContent();
    };

    const deleteComment = (commentId: string) => {
        setActivities(prev =>
            prev.map(a =>
                a.id === activity?.id
                    ? {
                        ...a,
                        comments: (a.comments ?? []).filter(
                            c => c.id !== commentId
                        ),
                    }
                    : a
            )
        );
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">
                Komentar ({comments.length})
            </h3>

            <div className="space-y-3">
                {comments.map(c => (
                    <CommentItem
                        key={c.id}
                        comment={c}
                        canDelete={c.user.name === account?.name}
                        onDelete={() => deleteComment(c.id)}
                    />
                ))}
            </div>

            <div className="border border-gray-500 dark:bg-gray-900 dark:text-white rounded-2xl p-4">
                <p className="font-medium mb-2">Tambah Komentar</p>

                <EditorContent editor={editor}/>

                {isEmptyError && (
                    <p className="text-red-500 mt-1">
                        Komentar tidak boleh kosong
                    </p>
                )}

                <button
                    onClick={addComment}
                    className="mt-4 w-full bg-batumbured opacity-80 hover:opacity-100 text-white font-semibold py-2 rounded-xl"
                >
                    Kirim
                </button>
            </div>
        </div>
    );
}

function CommentItem({
                         comment,
                         canDelete,
                         onDelete,
                     }: {
    comment: UserComment;
    canDelete: boolean;
    onDelete: () => void;
}) {
    return (
        <div className="border border-gray-500 rounded-2xl p-3  dark:bg-gray-900 dark:text-white">
            <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                    <span className="font-semibold">
                        {comment.user.name}
                    </span>
                    <span className="text-sm text-slate-400">
                        {formatDate(comment.date)}
                    </span>
                </div>

                {canDelete && (
                    <button
                        onClick={onDelete}
                        className="text-sm opacity-50 hover:opacity-100 hover:underline cursor-pointer !transition-none"
                    >
                        Delete
                    </button>
                )}
            </div>

            <p
                className="mt-2 text-sm"
                dangerouslySetInnerHTML={{__html: comment.comment}}
            />
        </div>
    );
}
