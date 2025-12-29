import React, {createContext, useContext, useMemo, useState} from "react";
import type {ActivityItem, Priority, SubActivityItem} from "../types/activity"; // your types
import {useActivities} from "./ActivityContext";
import {accounts} from "../types/account.ts";
import {useAccount} from "./AccountContext.tsx"; // Activity context hook

export interface SubActivityContextValue {
    subActivities: SubActivityItem[];
    addSubActivity: () => void;
    removeSubActivity: (id: string | null) => void;
    updateSubTitle: (id: string, title: string) => void;
    changePriority: (id: string, p: Priority) => void;
    toggleChecked: (id: string) => void;
    activity: ActivityItem | null;
    // modal
    showModal: boolean;
    openDeleteModal: (id: string) => void;
    closeModal: () => void;
    pendingDeleteSubId: string | null;
    isEditable: boolean
    isEditableByClient: boolean
}

export const SubActivityContext = createContext<SubActivityContextValue | undefined>(undefined);

export function SubActivityProvider({children, activityId}: { children: React.ReactNode; activityId: string }) {
    const {activities, setActivities} = useActivities();
    const activity = activities.find(a => a.id === activityId) ?? null;
    const subActivities = activity?.subActivities ?? [];

    const [showModal, setShowModal] = useState(false);
    const [pendingDeleteSubId, setPendingDeleteSubId] = useState<string | null>(null);

    const addSubActivity = () => {
        if (!activity) return;
        const newSub: SubActivityItem = {id: crypto.randomUUID(), title: "", priority: "Low", checked: false};
        const next = activities.map(a => a.id === activityId ? {
            ...a,
            subActivities: [...(a.subActivities ?? []), newSub]
        } : a);
        setActivities(next);
    };

    const removeSubActivity = (subId: string | null) => {
        if (!activity) return;
        const next = activities.map(a => a.id === activityId ? {
            ...a,
            subActivities: (a.subActivities ?? []).filter(s => s.id !== subId)
        } : a);
        setActivities(next);
        closeModal();
    };

    const updateSubTitle = (subId: string, title: string) => {
        if (!activity) return;
        const next = activities.map(a => a.id === activityId ? {
            ...a,
            subActivities: (a.subActivities ?? []).map(s => s.id === subId ? {...s, title} : s)
        } : a);
        setActivities(next);
    };

    const changePriority = (subId: string, p: Priority) => {
        if (!activity) return;
        const next = activities.map(a => a.id === activityId ? {
            ...a,
            subActivities: (a.subActivities ?? []).map(s => s.id === subId ? {...s, priority: p} : s)
        } : a);
        setActivities(next);
    };

    const toggleChecked = (subId: string) => {
        if (!activity) return;
        const next = activities.map(a => a.id === activityId ? {
            ...a,
            subActivities: (a.subActivities ?? []).map(s => s.id === subId ? {...s, checked: !s.checked} : s)
        } : a);
        setActivities(next);
    };

    const openDeleteModal = (id: string) => {
        setPendingDeleteSubId(id);
        setShowModal(true);
    };
    const closeModal = () => {
        setPendingDeleteSubId(null);
        setShowModal(false);
    };

    const {account} = useAccount()
    const isEditable = activity?.status != "DONE" && activity?.status != "DECLINED"
    const isEditableByClient = isEditable && account?.role == "engineer";

    const value = useMemo(() => ({
        subActivities,
        addSubActivity,
        removeSubActivity,
        updateSubTitle,
        changePriority,
        toggleChecked,
        showModal,
        openDeleteModal,
        closeModal,
        pendingDeleteSubId,
        activity,
        isEditable,
        isEditableByClient,
    }), [subActivities, showModal, pendingDeleteSubId, activities]);

    return <SubActivityContext.Provider value={value}>{children}</SubActivityContext.Provider>;
}

export function useSubActivities() {
    const ctx = useContext(SubActivityContext);
    if (!ctx) throw new Error("useSubActivities must be used inside SubActivityProvider");
    return ctx;
}
