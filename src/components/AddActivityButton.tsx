import React from "react";
import {enabledStyle} from "../consts.ts";

export default function AddActivityButton({
                                              onClick = () => {
                                              }, enabled = true
                                          }) {
    return (
        <button
            className={`${enabledStyle(enabled)} rounded-full min-w-12 min-h-12 text-white font-bold text-2xl hidden sm:block`}
            onClick={onClick}
            disabled={!enabled}
        >
            +
        </button>
    )
}