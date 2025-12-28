import React, {createContext, useContext, useEffect, useState} from "react";
import type {ActivityItem, ActivityStatus} from "../types/activity";
import {accounts} from "../types/account.ts";
import {useAccount} from "./AccountContext.tsx"; // adjust path/type

export interface ActivityContextValue {
    activities: ActivityItem[];
    setActivities: React.Dispatch<React.SetStateAction<ActivityItem[]>>;
    addActivities: (title?: string, description?: string) => void;
    removeActivities: (id: string | null) => void;
    changeTitle: (id: string, newTitle: string) => void;
    changeStatus: (id: string, newStatus: ActivityStatus) => void;
    changeDescription: (id: string, description: string) => void;

    changeDueDate: (id: string, dueDate: Date | null) => void; // ✅ ADD

    openDeleteModal: (id: string) => void;
    closeDeleteModal: () => void;
    showDeleteModal: boolean;
    pendingDeleteId: string | null;
    isEditableByClient: boolean;
    openAddModal: () => void;
    closeAddModal: () => void;
    showAddModal: boolean;
}


export const ActivityContext = createContext<ActivityContextValue | undefined>(undefined);

export function ActivityProvider({children}: { children: React.ReactNode }) {
    const STORAGE_KEY = `batumbu.activities`

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
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    const openAddModal = () => {
        setShowAddModal(true);
    }
    const closeAddModal = () => {
        setShowAddModal(false);
    }

    const addActivities = (title = "", description = "") => {
        setActivities((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                title: title,
                status: "TODO",
                subActivities: [],
                description: description,
                creator: accounts[account],
                assignee: null,
                creationDate: new Date(),
                dueDate: null,
                comments:[]
            },
        ]);
    };

    const removeActivities = (id: string | null) => {
        if (!id) return;
        setActivities((prev) => prev.filter((activity) => activity.id !== id));
        closeDeleteModal()
    };

    const changeTitle = (id: string, newTitle: string) => {
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
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setPendingDeleteId(null);
        setShowDeleteModal(false);
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


    const changeDescription = (id: string, description: string) => {
        setActivities((prev) =>
            prev.map((a) => (a.id === id ? {...a, description: description} : a))
        );
    }

    const changeDueDate = (id: string, dueDate: Date | null) => {
        setActivities(prev =>
            prev.map(a =>
                a.id === id ? { ...a, dueDate } : a
            )
        );
    };


    const {account} = useAccount()
    const isEditableByClient = accounts[account]?.role == "engineer";

    const value = {
        activities,
        setActivities,
        addActivities,
        removeActivities,
        changeTitle,
        changeStatus,
        changeDescription,
        changeDueDate,
        openDeleteModal,
        closeDeleteModal,
        showDeleteModal,
        pendingDeleteId,
        isEditableByClient,
        openAddModal,
        closeAddModal,
        showAddModal,
    };



    return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivities(): ActivityContextValue {
    const ctx = useContext(ActivityContext);
    if (!ctx) throw new Error("useActivities must be used inside ActivityProvider");
    return ctx;
}
