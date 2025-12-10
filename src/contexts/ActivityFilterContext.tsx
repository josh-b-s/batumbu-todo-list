import React, {createContext, useContext, useState} from "react";
import {ActivityStatus} from "../types/activity.ts";

export interface ActivityFilterContextValue {
    statusFilter: ActivityStatus;
    setStatusFilter: (filter: ActivityStatus) => void;
}

const ActivityFilterContext = createContext<ActivityFilterContextValue | undefined>(undefined);

export function ActivityFilterProvider({children}: { children: React.ReactNode }) {
    const [statusFilter, setStatusFilter] = useState<ActivityStatus>("All")

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
