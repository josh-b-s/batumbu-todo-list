import React, {createContext, useContext, useEffect, useState} from "react";
import type {ActivityItem, ActivityStatus} from "../types/activity"; // adjust path/type
import {useAccount} from "./AccountContext";

interface ActivityContextValue {
    activities: ActivityItem[];
    setActivities: React.Dispatch<React.SetStateAction<ActivityItem[]>>;
    addActivities: () => void;
    removeActivities: (id: string | null) => void;
    updateTitle: (id: string, newTitle: string) => void
    changeStatus: (id: string, newStatus: ActivityStatus) => void;
    openDeleteModal: (id: string) => void
    closeModal: () => void
    showModal: boolean
    pendingDeleteId: string | null;
}

const ActivityContext = createContext<ActivityContextValue | undefined>(undefined);

export function ActivityProvider({children}: { children: React.ReactNode }) {
    const {account} = useAccount();
    const STORAGE_KEY = account ? `batumbu.${account}` : "";

    const [activities, setActivities] = useState<ActivityItem[]>(() => {
        try {
            if (!STORAGE_KEY) return [];
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
        } catch (e) {
            console.error("Failed to parse activities from storage", e);
            return [];
        }
    });

    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const addActivities = () => {
        setActivities((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                title: "",
                status: "TODO",
                subActivities: [],
            },
        ]);
    };

    const removeActivities = (id: string | null) => {
        if (!id) return;
        setActivities((prev) => prev.filter((activity) => activity.id !== id));
    };

    const updateTitle = (id: string, newTitle: string) => {
        setActivities((prev) =>
            prev.map((a) => (a.id === id ? {...a, title: newTitle} : a))
        );
    };

    const changeStatus = (id: string, newStatus: ActivityStatus) => {
        setActivities((prev) =>
            prev.map((a) =>
                a.id === id ? {...a, status: newStatus} : a
            )
        );
    };

    const openDeleteModal = (id: string) => {
        setPendingDeleteId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setPendingDeleteId(null);
        setShowModal(false);
    };

    useEffect(() => {
        if (!STORAGE_KEY) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch (e) {
            console.error("Failed to save activities to localStorage", e);
        }
    }, [activities]);

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
    }, [STORAGE_KEY]);


    const value = {
        activities,
        setActivities,
        addActivities,
        removeActivities,
        updateTitle,
        changeStatus,
        openDeleteModal,
        closeModal,
        showModal,
        pendingDeleteId
    };


    return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivities(): ActivityContextValue {
    const ctx = useContext(ActivityContext);
    if (!ctx) throw new Error("useActivities must be used inside ActivityProvider");
    return ctx;
}
