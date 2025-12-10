import React, {JSX, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header";
import NoActivities from "../components/NoActivities";
import ConfirmModal from "../components/ConfirmModal";
import StatusDropdown from "../components/StatusDropdown.tsx";
import {useAccount} from "../contexts/AccountContext.tsx";

type ActivityStatus = "All" | "TODO" | "IN PROGRESS" | "DONE" | "PENDING" | "DECLINED";

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
    onChangeFilter: (filter: ActivityStatus) => void;
    filter: ActivityStatus;
}

interface ActivityListProps {
    activities: ActivityItem[];
    onDelete: (id: string) => void;
    onChangeTitle: (id: string, newTitle: string) => void;
    onChangeStatus: (id: string, newStatus: ActivityStatus) => void;
}

interface ActivityProps {
    activity: ActivityItem;
    onDelete: (id: string) => void;
    onChangeTitle: (id: string, newTitle: string) => void;
    onChangeStatus: (id: string, newStatus:ActivityStatus) => void;
}

export default function ActivityPage(): JSX.Element {
    const navigate = useNavigate();
    const {account} = useAccount()

    useEffect(() => {
        if (!account) navigate("/");
    }, [account, navigate]);

    return (
        <>
            <Header/>
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
    const [statusFilter, setStatusFilter] = useState<ActivityStatus>("All")

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

    const changeStatus = (id: string, newStatus: ActivityStatus) => {
        setActivities((prev) =>
            prev.map((a) =>
                a.id === id ? {...a, status: newStatus} : a
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
            <ActivityHeader addActivities={addActivities} onChangeFilter={(newStatus:ActivityStatus) => setStatusFilter(newStatus)} filter={statusFilter} />

            <div className="mt-8">
                {activities.length <= 0 && <NoActivities/>}

                {activities.length > 0 && (
                    <ActivityList
                        activities={activities}
                        onDelete={openDeleteModal}
                        onChangeTitle={updateTitle}
                        onChangeStatus={changeStatus}
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

function ActivityHeader({addActivities, onChangeFilter, filter}: ActivityHeaderProps): JSX.Element {
    return (
        <div className="flex justify-between space-x-5">
            <h2 className="text-3xl sm:text-4xl font-bold">Aktivitas</h2>
            <div className="flex items-center space-x-2">
                <StatusDropdown value={filter} onChange={(newStatus) => onChangeFilter(newStatus)}
                                className={`bg-batumbured rounded-3xl opacity-80 hover:opacity-100`} filter={true}/>

                <button
                    className="bg-batumbured rounded-full min-w-12 min-h-12 text-white font-bold opacity-80 hover:opacity-100 text-2xl cursor-pointer"
                    onClick={addActivities}
                >
                    +
                </button>
            </div>

        </div>
    );
}

function ActivityList({
                          activities,
                          onDelete,
                          onChangeTitle,
                          onChangeStatus,
                      }: ActivityListProps): JSX.Element {
    return (
        <>
            {activities.map((activity) => (
                <Activity
                    key={activity.id}
                    activity={activity}
                    onDelete={onDelete}
                    onChangeTitle={onChangeTitle}
                    onChangeStatus={onChangeStatus}
                />
            ))}
        </>
    );
}

function Activity({
                      activity,
                      onDelete,
                      onChangeTitle,
                      onChangeStatus,
                  }: ActivityProps): JSX.Element {
    const navigate = useNavigate();
    const {id, title, status} = activity;
    const styles = STATUS_STYLES[status] ?? STATUS_STYLES.TODO;

    return (
        <div
            className={`bg-white mb-2 rounded-xl p-4 flex justify-between items-center w-full cursor-pointer ${styles.border}`}
            onClick={() => navigate(`/activities/${id}`)}
            role="group"
        >
            <div className="flex flex-col gap-2">
                <p className={`font-bold text-left ${styles.text}`}>
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

            <div className="space-x-2 flex items-center">
                <button
                    className="text-gray-500 cursor-pointer hover:text-gray-900 hover:underline"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                >
                    Delete
                </button>

                <StatusDropdown value={status} onChange={(newStatus) => onChangeStatus(id, newStatus)}
                                className={`bg-batumbured rounded-xl mr-2 opacity-80 hover:opacity-100`}/>

            </div>
        </div>
    );
}

const STATUS_STYLES: Record<ActivityStatus, { border: string; text: string }> = {
    All: {border: "", text: ""},
    TODO: {border: "", text: "text-gray-500"},
    "IN PROGRESS": {border: "border-2 border-blue-500", text: "text-blue-500"},
    DONE: {border: "border-2 border-green-500", text: "text-green-500"},
    PENDING: {border: "border-2 border-yellow-500", text: "text-yellow-500"},
    DECLINED: {border: "border-2 border-red-500", text: "text-red-500"},
};
