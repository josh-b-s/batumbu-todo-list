import React, {JSX} from "react";
import {Box, Modal} from "@mui/material";

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    title: React.ReactNode;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmClassName?: string;
    cancelClassName?: string;
    children?: React.ReactNode;
}

/**
 * ConfirmModal
 *
 * Reusable confirmation modal used across the app.
 */
export default function ConfirmModal({
                                         open,
                                         onClose,
                                         title,
                                         onConfirm,
                                         confirmLabel = "Confirm",
                                         cancelLabel = "Cancel",
                                         confirmClassName =
                                         "bg-batumbured rounded-xl text-white font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2",
                                         cancelClassName =
                                         "bg-gray-300 rounded-xl font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2",
                                         children = null,
                                     }: ConfirmModalProps): JSX.Element {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-desc"
            closeAfterTransition
            slotProps={{
                backdrop: {
                    sx: {bgcolor: "rgba(0,0,0,0.5)"},
                },
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: 500,
                    minWidth: 0,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    outline: "none",
                    width: "calc(100% - 24px)"
                }}
                className="bg-white rounded-xl p-6"
            >
                <p id="confirm-modal-title" className="text-center font-bold text-2xl truncate whitespace-normal">
                    {title}
                </p>

                {children}

                <div className="flex justify-center space-x-6 mt-6">
                    <button className={confirmClassName} onClick={onConfirm}>
                        {confirmLabel}
                    </button>

                    <button className={cancelClassName} onClick={onClose}>
                        {cancelLabel}
                    </button>
                </div>
            </Box>
        </Modal>
    );
}
