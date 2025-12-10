import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ActivityItem } from "../types/activity"; // adjust path/type
import { useAccount } from "./AccountContext";

interface ActivityContextValue {
    activities: ActivityItem[];
    setActivities: React.Dispatch<React.SetStateAction<ActivityItem[]>>;
    reload: () => void;
}

const ActivityContext = createContext<ActivityContextValue | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
    const { account, ready } = useAccount();
    const STORAGE_KEY = account ? `batumbu.${account}` : null;

    // local state — initialize once when account is known
    const [activities, setActivities] = useState<ActivityItem[]>(() => {
        // This initialiser runs on first render; if account is null we return [].
        try {
            if (!STORAGE_KEY) return [];
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
        } catch (e) {
            console.error("Failed to parse activities from storage", e);
            return [];
        }
    });

    // persist whenever activities or STORAGE_KEY changes
    useEffect(() => {
        if (!STORAGE_KEY) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch (e) {
            console.error("Failed to save activities to localStorage", e);
        }
    }, [STORAGE_KEY, activities]);

    // If account changes (e.g. logout/login) we should reload activities for the new account
    useEffect(() => {
        if (!STORAGE_KEY) {
            setActivities([]);
            return;
        }
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            setActivities(raw ? (JSON.parse(raw) as ActivityItem[]) : []);
        } catch (e) {
            console.error("Failed to load activities after account change", e);
            setActivities([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [STORAGE_KEY, ready]); // run when account (STORAGE_KEY) changes and when rehydrate finished

    const reload = () => {
        if (!STORAGE_KEY) return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            setActivities(raw ? (JSON.parse(raw) as ActivityItem[]) : []);
        } catch (e) {
            console.error("Failed to reload activities", e);
        }
    };

    const value = useMemo(() => ({ activities, setActivities, reload }), [activities]);

    return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivities(): ActivityContextValue {
    const ctx = useContext(ActivityContext);
    if (!ctx) throw new Error("useActivities must be used inside ActivityProvider");
    return ctx;
}
