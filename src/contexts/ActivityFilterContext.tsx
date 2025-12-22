import React, {createContext, useContext, useState} from "react";
import {ActivityFilter} from "../types/activity.ts";

export interface ActivityFilterContextValue {
    statusFilter: ActivityFilter;
    setStatusFilter: (filter: ActivityFilter) => void;
}

export const ActivityFilterContext = createContext<ActivityFilterContextValue | undefined>(undefined);

export function ActivityFilterProvider({children}: { children: React.ReactNode }) {
    const [statusFilter, setStatusFilter] = useState<ActivityFilter>("All")

    return (
        <ActivityFilterContext.Provider value={{statusFilter, setStatusFilter}}>
            {children}
        </ActivityFilterContext.Provider>
    );
}

export function useActivityFilter(): ActivityFilterContextValue {
    const ctx = useContext(ActivityFilterContext);
    if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
    return ctx;
}
