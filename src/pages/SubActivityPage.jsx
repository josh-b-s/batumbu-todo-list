// src/pages/SubActivityPage.jsx
import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../components/Header.jsx";
import NoActivties from "../components/NoActivities.jsx";
import {modalStyle} from "../components/modalStyle.js";


/**
 * SubActivityPage - page wrapper. owns account and passes activityId to ActivityBody.
 */
export default function SubActivityPage() {
    const LOGIN_KEY = "batumbu.login";
    const navigate = useNavigate();
    const {id: activityId} = useParams();

    const [account, setAccount] = useState(() => {
        try {
            const raw = localStorage.getItem(LOGIN_KEY);
            return raw ? JSON.parse(raw) : "";
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
            <Header setAccount={setAccount} STORAGE_KEY={LOGIN_KEY}/>
            <ActivityBody account={account} activityId={activityId}/>
        </>
    );
}

/**
 * ActivityBody - manages activities list and subActivities for one activity (activityId)
 */
function ActivityBody({account, activityId}) {
    const navigate = useNavigate();
    const STORAGE_KEY = `batumbu.${account}`;

    const [activities, setActivities] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Failed to parse activities from storage", e);
            return [];
        }
    });

    // UI state
    const [showModal, setShowModal] = useState(false);
    const [pendingDeleteSubId, setPendingDeleteSubId] = useState(null);

    // find the activity this page is for
    const activity = activities.find((a) => a.id === activityId) ?? null;
    const subActivities = activity?.subActivities ?? [];

    // persist activities whenever activities change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch (e) {
            console.error("Failed to save activities to localStorage", e);
        }
    }, [activities, STORAGE_KEY]);

    // add empty subActivity to current activity
    const addSubActivity = () => {
        if (!activity) return;
        const newSub = {id: crypto.randomUUID(), title: "", priority: "Low", checked: false};
        const next = activities.map((a) => (a.id === activityId ? {
            ...a,
            subActivities: [...(a.subActivities ?? []), newSub]
        } : a));
        setActivities(next);
    };

    // remove subActivity by subId (not removing whole activity)
    const removeSubActivity = (subId) => {
        if (!activity) return;
        const next = activities.map((a) =>
            a.id === activityId ? {...a, subActivities: (a.subActivities ?? []).filter((s) => s.id !== subId)} : a
        );
        setActivities(next);
        closeModal();
    };

    const openDeleteModal = (subId) => {
        setPendingDeleteSubId(subId);
        setShowModal(true);
    };

    const closeModal = () => {
        setPendingDeleteSubId(null);
        setShowModal(false);
    };

    const updateSubTitle = (subId, newTitle) => {
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

    const togglePriority = (subId) => {
        if (!activity) return;
        const NEXT = {
            Low: "Medium",
            Medium: "High",
            High: "Urgent",
            Urgent: "Low"
        };
        const next = activities.map((a) =>
            a.id === activityId
                ? {
                    ...a,
                    subActivities: (a.subActivities ?? []).map((s) => (s.id === subId ? {
                        ...s,
                        priority: NEXT[s.priority] ?? "Low"
                    } : s))
                }
                : a
        );
        setActivities(next);
    };

    const toggleChecked = (subId) => {
        if (!activity) return;
        const next = activities.map((a) =>
            a.id === activityId
                ? {
                    ...a,
                    subActivities: (a.subActivities ?? []).map((s) => (s.id === subId ? {
                        ...s,
                        checked: !s.checked
                    } : s))
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


    return (
        <div className="mt-10 mx-48">
            <ActivityHeader addSubActivity={addSubActivity} onBack={() => navigate(-1)}
                            activityTitle={activity?.title} enabled={activity.subActivities.length < 10} />
            <div className="mt-8">
                {subActivities.length <= 0 && <NoActivties/>}
                {subActivities.length > 0 && (
                    <ActivityList
                        activities={subActivities}
                        onDelete={openDeleteModal}
                        onChangeTitle={updateSubTitle}
                        onTogglePriority={togglePriority}
                        onToggleChecked={toggleChecked}
                    />
                )}

                <Modal isOpen={showModal} onRequestClose={closeModal} shouldCloseOnOverlayClick={true}
                       style={modalStyle}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <p className="text-center font-bold text-2xl">
                            Apakah mau delete
                            "{(subActivities.find((s) => s.id === pendingDeleteSubId)?.title || "Aktivitas Baru")}"?
                        </p>

                        <div className="flex justify-center space-x-6 mt-6">
                            <button
                                className="bg-batumbured rounded-xl text-white font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2"
                                onClick={() => removeSubActivity(pendingDeleteSubId)}
                            >
                                Delete
                            </button>

                            <button
                                className="bg-gray-300 rounded-xl font-bold opacity-80 hover:opacity-100 cursor-pointer px-6 py-2"
                                onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

/**
 * ActivityHeader for subActivity page
 */
function ActivityHeader({addSubActivity, onBack, activityTitle, enabled}) {
    const color = enabled ? "bg-batumbured" : "bg-gray-500";

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="text-5xl opacity-70 hover:opacity-100 cursor-pointer">
                    ←
                </button>
                <h2 className="text-4xl font-bold">{activityTitle || "Aktivitas Baru"}</h2>
            </div>

            <button
                className={`${color} rounded-full w-12 h-12 text-white font-bold opacity-80 hover:opacity-100 text-2xl cursor-pointer`}
                onClick={enabled && addSubActivity}
            >
                +
            </button>
        </div>
    );
}

/**
 * ActivityList renders subActivities (simple list)
 * activities here are subActivities (id, title, priority)
 */
function ActivityList({activities, onDelete, onChangeTitle, onTogglePriority, onToggleChecked}) {
    return (
        <>
            {activities.map((activity) => (
                <SubActivity
                    key={activity.id}
                    sub={activity}
                    onDelete={onDelete}
                    onChangeTitle={onChangeTitle}
                    onTogglePriority={onTogglePriority}
                    onToggleChecked={onToggleChecked}
                />
            ))}
        </>
    );
}

/**
 * SubActivity item row
 */
// SubActivity item row — change style when checked
function SubActivity({sub, onDelete, onChangeTitle, onTogglePriority, onToggleChecked}) {
    const {id, title, priority = "Low", checked} = sub;
    const styles = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Low;

    // classes applied to the title when checked vs unchecked
    const titleClasses = checked
        ? "font-bold line-through text-gray-400 opacity-70 placeholder-gray-400"
        : "font-bold text-gray-900";

    return (
        <div
            className={`bg-white mb-2 rounded-xl p-4 flex justify-between items-center w-full border-2 ${styles.border} space-x-5`}>
            <div className="flex items-center gap-3 flex-1">
                <input
                    id={`chk-${id}`}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleChecked(id)}
                    className="h-5 w-5"
                />

                <input
                    className={`${titleClasses} placeholder-black focus:placeholder:opacity-0 flex-1 bg-transparent border-0`}
                    value={title}
                    onChange={(e) => onChangeTitle(id, e.target.value)}
                    placeholder="Aktivitas Baru"
                />
            </div>

            <div className="space-x-2 flex items-center">
                <button
                    onClick={() => onTogglePriority(id)}
                    className={`${styles.bg} ${styles.text} rounded-xl font-bold opacity-90 hover:opacity-100 cursor-pointer px-4 py-1`}
                    aria-label={`Toggle priority (current ${priority})`}
                >
                    {priority}
                </button>

                <button
                    className="text-gray-500 cursor-pointer hover:text-gray-900 hover:underline"
                    onClick={() => onDelete(id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

const PRIORITY_STYLES = {
    Low: {border: "border-blue-500", bg: "bg-blue-500", text: "text-blue-800"},
    Medium: {border: "border-yellow-500", bg: "bg-yellow-500", text: "text-yellow-800"},
    High: {border: "border-orange-500", bg: "bg-orange-500", text: "text-orange-800"},
    Urgent: {border: "border-red-500", bg: "bg-red-500", text: "text-red-800"},
};
