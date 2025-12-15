import React, {JSX, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header";
import NoActivities from "../components/NoActivities";
import ConfirmModal from "../components/ConfirmModal";
import StatusDropdown from "../components/StatusDropdown.tsx";
import {useAccount} from "../contexts/AccountContext.tsx";
import {useActivityFilter} from "../contexts/ActivityFilterContext.tsx";
import {useActivities} from "../contexts/ActivityContext.tsx";
import {ActivityItem, ActivityStatus} from "../types/activity.ts";
import {MAX_CHAR_LEN, STATUS_STYLES} from "../consts.ts";

interface ActivityListProps {
    activities: ActivityItem[];
}

interface ActivityProps {
    activity: ActivityItem;
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
            <ActivityBody/>
        </>
    );
}

function ActivityBody(): JSX.Element {
    const {
        activities,
        removeActivities,
        showModal,
        closeModal,
        pendingDeleteId,
        addActivities
    } = useActivities()
    const pendingActivity =
        activities.find((a) => a.id === pendingDeleteId) ?? null;
    const pendingTitle =
        (pendingActivity?.title.trim() || "") || "Aktivitas Baru";
    const {statusFilter} = useActivityFilter();

    const filteredActivities = () => {
        if (statusFilter === "All") return activities;
        return activities.filter((a) => a.status === statusFilter);
    }

    return (
        <div className="mt-10 mx-4 sm:mx-20 lg:mx-48">
            <ActivityHeader/>

            <hr className="mt-4 border-gray-400 sm:border-0"/>

            <div className="mt-4">
                {filteredActivities().length <= 0 && <NoActivities/>}

                {filteredActivities().length > 0 && (
                    <ActivityList
                        activities={filteredActivities()}
                    />
                )}
                <button
                    className="bg-batumbured rounded-xl w-full py-2 text-white font-bold opacity-80 hover:opacity-100 text-2xl cursor-pointer block sm:hidden"
                    onClick={addActivities}
                >
                    + Tambah
                </button>

            </div>
            <ConfirmModal
                open={showModal}
                onClose={closeModal}
                title={`Apakah mau delete "${pendingTitle}"?`}
                onConfirm={() => removeActivities(pendingDeleteId)}
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
}

function ActivityHeader(): JSX.Element {
    const {statusFilter, setStatusFilter} = useActivityFilter();
    const {addActivities} = useActivities();
    return (
        <div className="flex justify-between space-x-5">
            <h2 className="text-3xl sm:text-4xl font-bold">Aktivitas</h2>
            <div className="flex items-center space-x-2">
                <StatusDropdown value={statusFilter} onChange={(newStatus) => setStatusFilter(newStatus)}
                                className={`bg-batumbured rounded-3xl opacity-80 hover:opacity-100`} filter={true}/>

                <button
                    className="bg-batumbured rounded-full min-w-12 min-h-12 text-white font-bold opacity-80 hover:opacity-100 text-2xl cursor-pointer hidden sm:block"
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
                      }: ActivityListProps): JSX.Element {
    return (
        <>
            {activities.map((activity) => (
                <Activity
                    key={activity.id}
                    activity={activity}
                />
            ))}
        </>
    );
}

function Activity({
                      activity,
                  }: ActivityProps): JSX.Element {
    const navigate = useNavigate();
    const {id, title, status} = activity;
    const styles = STATUS_STYLES[status] ?? STATUS_STYLES.TODO;
    const {changeTitle, changeStatus, openDeleteModal} = useActivities()


    return (
        <div
            className={`bg-white mb-2 rounded-xl p-4 flex justify-between items-center w-full cursor-pointer ${styles.border}`}
            onClick={() => navigate(`/activities/${id}`)}
            role="group"
        >
            <div className="flex flex-col gap-2 w-150 min-w-0 mr-5">
                <p className={`font-bold text-left ${styles.text}`}>
                    {status}
                </p>

                <input
                    className={`truncate font-bold placeholder-black focus:placeholder-transparent w-full`}
                    value={title}
                    onChange={(e) => changeTitle(id, e.target.value.length > MAX_CHAR_LEN ? title : e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Aktivitas Baru"
                />
            </div>

            <div className="space-x-2 flex items-center">
                <button
                    className="text-gray-500 cursor-pointer hover:text-gray-900 hover:underline"
                    onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(id);
                    }}
                >
                    Delete
                </button>

                <StatusDropdown value={status} onChange={(newStatus) => changeStatus(id, newStatus as ActivityStatus)}
                                className={`bg-batumbured rounded-xl mr-2 opacity-80 hover:opacity-100`}/>

            </div>
        </div>
    );
}

