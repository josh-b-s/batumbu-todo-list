import React, {JSX, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../components/Header";
import NoActivities from "../components/NoActivities";
import PriorityDropdown from "../components/PriorityDropdown";
import ConfirmModal from "../components/ConfirmModal";

type Priority = "Low" | "Medium" | "High" | "Urgent";

interface SubItem {
    id: string;
    title: string;
    priority?: Priority;
    checked?: boolean;
}

interface ActivityItem {
    id: string;
    title?: string;
    status?: string;
    subActivities?: SubItem[];
}

export default function SubActivityPage(): JSX.Element {
    const LOGIN_KEY = "batumbu.login";
    const navigate = useNavigate();
    const {id: activityId} = useParams<{ id: string }>();

    const [account, setAccount] = useState<string>(() => {
        try {
            const raw = localStorage.getItem(LOGIN_KEY);
            return raw ? (JSON.parse(raw) as string) : "";
        } catch (e) {
            console.error("Failed to parse login from storage", e);
            return "";
        }
    });

    useEffect(() => {
        if (!account) navigate("/");
    }, [account, navigate]);

    return (
        <>
            <Header setAccount={setAccount} LOGIN_KEY={LOGIN_KEY}/>
            <ActivityBody account={account} activityId={activityId ?? ""}/>
        </>
    );
}

function ActivityBody({
                          account,
                          activityId,
                      }: {
    account: string;
    activityId: string;
}): JSX.Element {
    const navigate = useNavigate();
    const STORAGE_KEY = `batumbu.${account}`;

    const [activities, setActivities] = useState<ActivityItem[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
        } catch (e) {
            console.error("Failed to parse activities from storage", e);
            return [];
        }
    });

    const [showModal, setShowModal] = useState<boolean>(false);
    const [pendingDeleteSubId, setPendingDeleteSubId] = useState<string | null>(null);

    const activity = activities.find((a) => a.id === activityId) ?? null;
    const subActivities = activity?.subActivities ?? [];

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch (e) {
            console.error("Failed to save activities to localStorage", e);
        }
    }, [activities, STORAGE_KEY]);

    const addSubActivity = (): void => {
        if (!activity) return;
        const newSub: SubItem = {id: crypto.randomUUID(), title: "", priority: "Low", checked: false};
        const next = activities.map((a) =>
            a.id === activityId ? {...a, subActivities: [...(a.subActivities ?? []), newSub]} : a
        );
        setActivities(next);
    };

    const removeSubActivity = (subId: string | null): void => {
        if (!activity || !subId) return;
        const next = activities.map((a) =>
            a.id === activityId ? {...a, subActivities: (a.subActivities ?? []).filter((s) => s.id !== subId)} : a
        );
        setActivities(next);
        closeModal();
    };

    const openDeleteModal = (subId: string): void => {
        setPendingDeleteSubId(subId);
        setShowModal(true);
    };

    const closeModal = (): void => {
        setPendingDeleteSubId(null);
        setShowModal(false);
    };

    const updateSubTitle = (subId: string, newTitle: string): void => {
        if (!activity) return;
        const next = activities.map((a) =>
            a.id === activityId
                ? {
                    ...a,
                    subActivities: (a.subActivities ?? []).map((s) => (s.id === subId ? {...s, title: newTitle} : s))
                }
                : a
        );
        setActivities(next);
    };

    const changePriority = (subId: string, newPriority: Priority): void => {
        if (!activity) return;
        const next = activities.map((a) =>
            a.id === activityId
                ? {
                    ...a,
                    subActivities: (a.subActivities ?? []).map((s) => (s.id === subId ? {...s, priority: newPriority} : s))
                }
                : a
        );
        setActivities(next);
    };

    const toggleChecked = (subId: string): void => {
        if (!activity) return;
        const next = activities.map((a) =>
            a.id === activityId
                ? {
                    ...a,
                    subActivities: (a.subActivities ?? []).map((s) => (s.id === subId ? {...s, checked: !s.checked} : s))
                }
                : a
        );
        setActivities(next);
    };

    useEffect(() => {
        if (activityId && !activity) {
            navigate("/activities", {replace: true});
        }
    }, [activityId, activity, activities, navigate]);

    const pendingTitle = (subActivities.find((s) => s.id === pendingDeleteSubId)?.title || "Aktivitas Baru").trim();

    return (
        <div className="mt-10 mx-4 sm:mx-20 lg:mx-48">
            <ActivityHeader
                addSubActivity={addSubActivity}
                onBack={() => navigate(-1)}
                activityTitle={activity?.title}
                enabled={(activity?.subActivities?.length ?? 0) < 10}
            />
            <div className="mt-8">
                {subActivities.length <= 0 && <NoActivities/>}
                {subActivities.length > 0 && (
                    <ActivityList
                        activities={subActivities}
                        onDelete={openDeleteModal}
                        onChangeTitle={updateSubTitle}
                        onchangePriority={changePriority}
                        onToggleChecked={toggleChecked}
                    />
                )}

                <ConfirmModal
                    open={showModal}
                    onClose={closeModal}
                    title={`Apakah mau delete "${pendingTitle}"?`}
                    onConfirm={() => removeSubActivity(pendingDeleteSubId)}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                />
            </div>
        </div>
    );
}

function ActivityHeader({
                            addSubActivity,
                            onBack,
                            activityTitle,
                            enabled,
                        }: {
    addSubActivity: () => void;
    onBack: () => void;
    activityTitle?: string;
    enabled: boolean;
}): JSX.Element {
    const color = enabled ? "bg-batumbured" : "bg-gray-500";

    return (
        <div className="flex justify-between items-center space-x-5">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="text-5xl opacity-70 hover:opacity-100 cursor-pointer">
                    ←
                </button>
                <h2 className="text-3xl sm:text-4xl font-bold max-w-60">{activityTitle || "Aktivitas Baru"}</h2>
            </div>

            <button
                className={`${color} rounded-full min-w-12 min-h-12 text-white font-bold opacity-80 hover:opacity-100 text-2xl cursor-pointer`}
                onClick={enabled ? addSubActivity : undefined}
            >
                +
            </button>
        </div>
    );
}

function ActivityList({
                          activities,
                          onDelete,
                          onChangeTitle,
                          onchangePriority,
                          onToggleChecked,
                      }: {
    activities: SubItem[];
    onDelete: (id: string) => void;
    onChangeTitle: (id: string, newTitle: string) => void;
    onchangePriority: (id: string, newPriority: Priority) => void;
    onToggleChecked: (id: string) => void;
}): JSX.Element {
    return (
        <>
            {activities.map((activity) => (
                <SubActivity
                    key={activity.id}
                    sub={activity}
                    onDelete={onDelete}
                    onChangeTitle={onChangeTitle}
                    onchangePriority={onchangePriority}
                    onToggleChecked={onToggleChecked}
                />
            ))}
        </>
    );
}

function SubActivity({
                         sub,
                         onDelete,
                         onChangeTitle,
                         onchangePriority,
                         onToggleChecked,
                     }: {
    sub: SubItem;
    onDelete: (id: string) => void;
    onChangeTitle: (id: string, newTitle: string) => void;
    onchangePriority: (id: string, newPriority: Priority) => void;
    onToggleChecked: (id: string) => void;
}): JSX.Element {
    const {id, title = "", priority = "Low", checked = false} = sub;
    const styles = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Low;

    const titleClasses = checked ? "font-bold line-through text-gray-400 opacity-70 placeholder-gray-400" : "font-bold text-gray-900";

    return (
        <div
            className={`bg-white mb-2 rounded-xl p-4 flex justify-between items-center w-full border-2 ${styles.border} space-x-5`}>
            <div className="flex items-center gap-3 flex-1">
                <input id={`chk-${id}`} type="checkbox" checked={checked} onChange={() => onToggleChecked(id)}
                       className="h-5 w-5"/>

                <input
                    className={`${titleClasses} placeholder-black focus:placeholder:opacity-0 flex-1 bg-transparent border-0`}
                    value={title}
                    onChange={(e) => onChangeTitle(id, e.target.value)}
                    placeholder="Aktivitas Baru"
                />
            </div>

            <div className="space-x-2 flex items-center">
                <PriorityDropdown value={priority} onChange={(newP) => onchangePriority(id, newP)}
                                  className={`${styles.bg} rounded-xl`}/>

                <button className="text-gray-500 cursor-pointer hover:text-gray-900 hover:underline"
                        onClick={() => onDelete(id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

const PRIORITY_STYLES: Record<Priority, { border: string; bg: string; text: string }> = {
    Low: {border: "border-blue-500", bg: "bg-blue-500", text: "text-blue-800"},
    Medium: {border: "border-yellow-500", bg: "bg-yellow-500", text: "text-yellow-800"},
    High: {border: "border-orange-500", bg: "bg-orange-500", text: "text-orange-800"},
    Urgent: {border: "border-red-500", bg: "bg-red-500", text: "text-red-800"},
};
