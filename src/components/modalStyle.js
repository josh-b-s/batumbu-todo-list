export const modalStyle = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        zIndex: 1000,
    },
    content: {
        position: "static",
        inset: "auto",
        border: "none",
        background: "transparent",
        padding: 0,
        overflow: "visible",
    },
}