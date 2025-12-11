import React, {JSX} from "react";
import search from "../assets/Search.png";
import {useActivityFilter} from "../contexts/ActivityFilterContext.tsx";

/**
 * Menampilkan tampilan ketika tidak ada aktivitas sama sekali.
 * Berisi ikon pencarian dan teks "Belum ada Aktivitas".
 */
export default function NoActivities(): JSX.Element {
    const {statusFilter} = useActivityFilter()
    const extra = statusFilter == "All" ? "" : statusFilter;

    return (
        <div className="py-5 mb-5">
            <img className="size-50 mx-auto my-7" src={search} alt="No activities found"/>
            <p className="text-2xl text-gray-600 font-medium text-center">{`Belum ada Aktivitas ${extra}`}</p>
        </div>
    );
}
