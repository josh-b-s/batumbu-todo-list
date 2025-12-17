import React from "react";
import {enabledStyle} from "../consts.ts";

export default function AddActivityButtonMobile({
                                                    onClick = () => {
                                                    }, enabled = true
                                                }) {
    return (
        <button
            className={`${enabledStyle(enabled)} bg-batumbured rounded-xl w-full py-2 text-white font-bold text-2xl block sm:hidden`}
            onClick={onClick}
            disabled={!enabled}
        >
            + Tambah
        </button>
    )
}