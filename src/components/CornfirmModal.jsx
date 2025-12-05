import React from "react";
import {Box, Modal} from "@mui/material";

/**
 * ConfirmModal
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - title: string (main message; can include quotes/placeholders)
 * - onConfirm: () => void
 * - confirmLabel: string (default "Confirm")
 * - cancelLabel: string (default "Cancel")
 * - confirmClassName: string (optional; Tailwind classes for confirm button)
 * - cancelClassName: string (optional; Tailwind classes for cancel button)
 * - children: ReactNode (optional extra content below title)
 */
export default function ConfirmModal({
                                         open,
                                         onClose,
                                         title,
                                         onConfirm,
                                         confirmLabel = "Confirm",
                                         cancelLabel = "Cancel",
                                         confirmClassName = "bg-batumbured rounded-xl text-white font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2",
                                         cancelClassName = "bg-gray-300 rounded-xl font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2",
                                         children = null,
                                     }) {
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
                    width: "100%",
                    maxWidth: 480,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    outline: "none",
                }}
                className="bg-white rounded-xl p-6 w-full max-w-md"
            >
                <p id="confirm-modal-title" className="text-center font-bold text-2xl">
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
