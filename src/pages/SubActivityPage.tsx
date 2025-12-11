import React, {JSX, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../components/Header";
import NoActivities from "../components/NoActivities";
import PriorityDropdown from "../components/PriorityDropdown";
import ConfirmModal from "../components/ConfirmModal";
import {useAccount} from "../contexts/AccountContext.tsx";
import {Priority, SubActivity} from "../types/activity.ts";
import {useActivities} from "../contexts/ActivityContext.tsx";
import {SubActivityProvider, useSubActivities} from "../contexts/SubActivityContext.tsx";


export default function SubActivityPage(): JSX.Element {
    const navigate = useNavigate();
    const {id: activityId} = useParams<{ id: string }>();
    const {account} = useAccount()

    useEffect(() => {
        if (!account) navigate("/");
    }, [account, navigate]);

    return (
        <SubActivityProvider activityId={activityId ?? ""}>
            <Header/>
            <ActivityBody activityId={activityId ?? ""}/>
        </SubActivityProvider>
    );
}

function ActivityBody({
                          activityId,
                      }: {
    activityId: string;
}): JSX.Element {
    const navigate = useNavigate();
    const {activities} = useActivities();
    const {
        removeSubActivity,
        pendingDeleteSubId,
        closeModal,
        showModal,
        subActivities
    } = useSubActivities()
    const pendingTitle = (subActivities.find((s) => s.id === pendingDeleteSubId)?.title || "Aktivitas Baru").trim();


    useEffect(() => {
        if (activityId && !subActivities) {
            navigate("/activities", {replace: true});
        }
    }, [activityId, subActivities, activities, navigate]);

    return (
        <div className="mt-10 mx-4 sm:mx-20 lg:mx-48">
            <ActivityHeader/>
            <div className="mt-8">
                {subActivities.length <= 0 && <NoActivities/>}
                {subActivities.length > 0 && (
                    <ActivityList
                        activities={subActivities}
                    />
                )}
            </div>
            <ConfirmModal
                open={showModal}
                onClose={closeModal}
                title={`Apakah mau delete "${pendingTitle}"?`}
                onConfirm={() => removeSubActivity(pendingDeleteSubId)}
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
}

function ActivityHeader(): JSX.Element {
    const {
        addSubActivity,
        activity,
        subActivities
    } = useSubActivities()
    const navigate = useNavigate();
    const enabled = subActivities.length < 10;
    const color = enabled ? "bg-batumbured" : "bg-gray-500";

    return (
        <div className="flex justify-between items-center space-x-5">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-5xl opacity-70 hover:opacity-100 cursor-pointer">
                    ←
                </button>
                <h2 className="text-3xl sm:text-4xl font-bold max-w-60">{activity?.title || "Aktivitas Baru"}</h2>
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
                          activities
                      }: {
    activities: SubActivity[];
}): JSX.Element {
    return (
        <>
            {activities.map((activity) => (
                <SubActivity
                    key={activity.id}
                    sub={activity}
                />
            ))}
        </>
    );
}

function SubActivity({
                         sub
                     }: {
    sub: SubActivity
}): JSX.Element {
    const {toggleChecked, updateSubTitle, changePriority, openDeleteModal} = useSubActivities();
    const {id, title = "", priority = "Low", checked = false} = sub;
    const styles = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Low;

    const titleClasses = checked ? "font-bold line-through text-gray-400 opacity-70 placeholder-gray-400" : "font-bold text-gray-900";

    return (
        <div
            className={`bg-white mb-2 rounded-xl p-4 flex justify-between items-center w-full border-2 ${styles.border} space-x-5`}>
            <div className="flex items-center gap-3 flex-1">
                <input id={`chk-${id}`} type="checkbox" checked={checked} onChange={() => toggleChecked(id)}
                       className="h-5 w-5"/>

                <input
                    className={`${titleClasses} placeholder-black focus:placeholder:opacity-0 flex-1 bg-transparent border-0`}
                    value={title}
                    onChange={(e) => updateSubTitle(id, e.target.value)}
                    placeholder="Aktivitas Baru"
                />
            </div>

            <div className="flex items-center">
                <PriorityDropdown value={priority} onChange={(newP) => changePriority(id, newP)}
                                  className={`${styles.bg} rounded-xl mr-2 opacity-80 hover:opacity-100`}/>

                <button className="text-gray-500 cursor-pointer hover:text-gray-900 hover:underline"
                        onClick={() => openDeleteModal(id)}>
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
