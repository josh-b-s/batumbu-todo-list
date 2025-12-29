import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../components/Header";
import NoActivities from "../components/NoActivities";
import ConfirmModal from "../components/ConfirmModal";
import {useAccount} from "../contexts/AccountContext.tsx";
import {Priority, priorityDropdownChoices, SubActivityItem} from "../types/activity.ts";
import {useActivities} from "../contexts/ActivityContext.tsx";
import {SubActivityProvider, useSubActivities} from "../contexts/SubActivityContext.tsx";
import {MAX_TITLE_CHAR_LEN, placeholderColor, PRIORITY_STYLES, secondaryBgColor} from "../consts.ts";
import AddActivityButtonMobile from "../components/AddActivityButtonMobile.tsx";
import AddActivityButton from "../components/AddActivityButton.tsx";
import ActivityDropdown from "../components/ActivityDropdown.tsx";
import {FaArrowLeft} from "react-icons/fa";
import ActivityDetails from "../components/ActivityDetails.tsx";


export default function SubActivityPage() {
    const navigate = useNavigate();
    const {id: activityId} = useParams<{ id: string }>();
    const {account} = useAccount()

    useEffect(() => {
        if (!account) navigate("/");
    }, [account, navigate]);


    return (
        <SubActivityProvider activityId={activityId ?? ""}>
            <Header/>
            <SubActivityBody/>
        </SubActivityProvider>
    );
}

function SubActivityBody() {
    const navigate = useNavigate();
    const {activities} = useActivities();
    const {
        subActivities,
        addSubActivity,
        isEditableByClient,
        removeSubActivity,
        pendingDeleteSubId,
        closeModal,
        showModal,
        activity
    } = useSubActivities()
    const enabled = subActivities.length < 10 && isEditableByClient;
    const noActivities = subActivities.length <= 0
    const pendingTitle = (subActivities.find((s) => s.id === pendingDeleteSubId)?.title || "Aktivitas Baru").trim();


    useEffect(() => {
        if (activity?.id && !subActivities) {
            navigate("/activities", {replace: true});
        }
    }, [activity?.id, subActivities, activities, navigate]);

    return (
        <div className="mt-10 mx-4 sm:mx-20 lg:mx-48">
            <ActivityHeader/>

            <hr className="mt-4 border-gray-400 sm:border-0"/>

            <div className="mt-4">
                <ActivityDetails/>
                {noActivities && <NoActivities/>}
                {!noActivities && subActivities.map((activity) => (
                    <SubActivity key={activity.id} activity={activity}/>
                ))}
                <AddActivityButtonMobile onClick={addSubActivity} enabled={enabled}/>
            </div>
            <ConfirmModal
                open={showModal}
                onClose={closeModal}
                title={`Apakah mau delete "${pendingTitle}"?`}
                onConfirm={() => removeSubActivity(pendingDeleteSubId)}
                confirmLabel="Delete"
            />
        </div>
    );
}

function ActivityHeader() {
    const {
        addSubActivity,
        activity,
        subActivities,
        isEditableByClient,
    } = useSubActivities()
    const navigate = useNavigate();
    const enabled = subActivities.length < 10 && isEditableByClient;

    return (
        <div className="flex justify-between items-center space-x-5">
            <div className="flex items-center gap-4 min-w-0">
                <FaArrowLeft onClick={() => navigate(-1)}
                             className="text-3xl opacity-70 hover:opacity-100 cursor-pointer"/>
                <h2 className="text-3xl sm:text-4xl font-bold truncate">{activity?.title || "Aktivitas Baru"}</h2>
            </div>

            <AddActivityButton onClick={addSubActivity} enabled={enabled}/>
        </div>
    );
}

function SubActivity({
                         activity
                     }: {
    activity: SubActivityItem
}) {
    const {
        toggleChecked,
        updateSubTitle,
        changePriority,
        openDeleteModal,
        isEditableByClient
    } = useSubActivities();
    const {id, title = "", priority = "Low", checked = false} = activity;
    const styles = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Low;
    const titleClasses = checked ? "line-through opacity-50" : "";


    return (
        <div
            className={secondaryBgColor + ` mb-2 rounded-xl p-4 flex justify-between items-center w-full border-2 ${styles.border} space-x-5`}>
            <div className="flex items-center gap-3">
                <input id={`chk-${id}`} type="checkbox" checked={checked} onChange={() => toggleChecked(id)}
                       className="h-5 w-5"
                       disabled={!isEditableByClient}
                />

                <input
                    className={`${titleClasses} ${placeholderColor} font-bold truncate flex-1 bg-transparent field-sizing-content focus:p-1`}
                    value={title}
                    onChange={(e) => updateSubTitle(id, e.target.value.length > MAX_TITLE_CHAR_LEN ? title : e.target.value)}
                    placeholder="Aktivitas Baru"
                    disabled={!isEditableByClient}
                />
            </div>

            <div className="flex items-center">
                <ActivityDropdown value={priority} onChange={(newP) => changePriority(id, newP as Priority)}
                                  className={`${styles.bg} rounded-xl mr-2`}
                                  disabled={!isEditableByClient}
                                  choices={priorityDropdownChoices}/>

                <button
                    className={`${isEditableByClient ? "block" : "hidden"} not-hover:opacity-50 cursor-pointer hover:underline`}
                    onClick={() => openDeleteModal(id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

