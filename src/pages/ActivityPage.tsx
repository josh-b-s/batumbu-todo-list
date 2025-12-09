import React, {JSX, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header";
import NoActivities from "../components/NoActivities";
import ConfirmModal from "../components/ConfirmModal";

type ActivityStatus = "TODO" | "IN PROGRESS" | "DONE";

interface SubActivity {
    id: string;
    title: string;
    done: boolean;
}

interface ActivityItem {
    id: string;
    title: string;
    status: ActivityStatus;
    subActivities: SubActivity[];
}

interface ActivityHeaderProps {
    addActivities: () => void;
}

interface ActivityListProps {
    activities: ActivityItem[];
    onDelete: (id: string) => void;
    onChangeTitle: (id: string, newTitle: string) => void;
    onToggleStatus: (id: string) => void;
}

interface ActivityProps {
    activity: ActivityItem;
    onDelete: (id: string) => void;
    onChangeTitle: (id: string, newTitle: string) => void;
    onToggleStatus: (id: string) => void;
}

export default function ActivityPage(): JSX.Element {
    const LOGIN_KEY = "batumbu.login";
    const navigate = useNavigate();

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
            <ActivityBody account={account}/>
        </>
    );
}

function ActivityBody({account}: { account: string }): JSX.Element {
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
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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
        closeModal();
    };

    const openDeleteModal = (id: string) => {
        setPendingDeleteId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setPendingDeleteId(null);
        setShowModal(false);
    };

    const updateTitle = (id: string, newTitle: string) => {
        setActivities((prev) =>
            prev.map((a) => (a.id === id ? {...a, title: newTitle} : a))
        );
    };

    const toggleStatus = (id: string) => {
        const NEXT: Record<ActivityStatus, ActivityStatus> = {
            TODO: "IN PROGRESS",
            "IN PROGRESS": "DONE",
            DONE: "TODO",
        };
        setActivities((prev) =>
            prev.map((a) =>
                a.id === id ? {...a, status: NEXT[a.status]} : a
            )
        );
    };

    const pendingActivity =
        activities.find((a) => a.id === pendingDeleteId) ?? null;

    const pendingTitle =
        (pendingActivity?.title.trim() || "") || "Aktivitas Baru";

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch (e) {
            console.error("Failed to save activities to localStorage", e);
        }
    }, [STORAGE_KEY, activities]);

    return (
        <div className="mt-10 mx-4 sm:mx-20 lg:mx-48">
            <ActivityHeader addActivities={addActivities}/>

            <div className="mt-8">
                {activities.length <= 0 && <NoActivities/>}

                {activities.length > 0 && (
                    <ActivityList
                        activities={activities}
                        onDelete={openDeleteModal}
                        onChangeTitle={updateTitle}
                        onToggleStatus={toggleStatus}
                    />
                )}

                <ConfirmModal
                    open={showModal}
                    onClose={closeModal}
                    title={`Apakah mau delete "${pendingTitle}"?`}
                    onConfirm={() => removeActivities(pendingDeleteId)}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                />
            </div>
        </div>
    );
}

function ActivityHeader({addActivities}: ActivityHeaderProps): JSX.Element {
    return (
        <div className="flex justify-between space-x-5">
            <h2 className="text-3xl sm:text-4xl font-bold">Aktivitas</h2>
            <button
                className="bg-batumbured rounded-full min-w-12 min-h-12 text-white font-bold opacity-80 hover:opacity-100 text-2xl cursor-pointer"
                onClick={addActivities}
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
                          onToggleStatus,
                      }: ActivityListProps): JSX.Element {
    return (
        <>
            {activities.map((activity) => (
                <Activity
                    key={activity.id}
                    activity={activity}
                    onDelete={onDelete}
                    onChangeTitle={onChangeTitle}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </>
    );
}

function Activity({
                      activity,
                      onDelete,
                      onChangeTitle,
                      onToggleStatus,
                  }: ActivityProps): JSX.Element {
    const navigate = useNavigate();
    const {id, title, status} = activity;

    return (
        <div
            className={`bg-white mb-2 rounded-xl p-4 flex justify-between items-center w-full cursor-pointer opacity-80 hover:opacity-100 ${DIV_BORDER[status]}`}
            onClick={() => navigate(`/activities/${id}`)}
            role="group"
        >
            <div className="flex flex-col gap-2">
                <p className={`font-bold text-left ${STATUS_CLASS[status]}`}>
                    {status}
                </p>

                <input
                    className="font-bold placeholder-black focus:placeholder-transparent"
                    value={title}
                    onChange={(e) => onChangeTitle(id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Aktivitas Baru"
                />
            </div>

            <div className="space-x-2">
                <button
                    className="text-gray-500 cursor-pointer hover:text-gray-900 hover:underline"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                >
                    Delete
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(id);
                    }}
                    className="bg-batumbured rounded-xl text-white font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2"
                >
                    {BUTTON_LABEL[status]}
                </button>
            </div>
        </div>
    );
}

const STATUS_CLASS: Record<ActivityStatus, string> = {
    TODO: "text-gray-500",
    "IN PROGRESS": "text-blue-500",
    DONE: "text-green-500",
};

const BUTTON_LABEL: Record<ActivityStatus, string> = {
    TODO: "Start",
    "IN PROGRESS": "Mark as Done",
    DONE: "Back to Backlog",
};

const DIV_BORDER: Record<ActivityStatus, string> = {
    TODO: "",
    "IN PROGRESS": "border-2 border-blue-500",
    DONE: "border-2 border-green-500",
};
