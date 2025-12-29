import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../components/Header";
import NoActivities from "../components/NoActivities";
import ConfirmModal from "../components/ConfirmModal";
import {useAccount} from "../contexts/AccountContext.tsx";
import {useActivityFilter} from "../contexts/ActivityFilterContext.tsx";
import {useActivities} from "../contexts/ActivityContext.tsx";
import {ActivityFilter, ActivityItem, ActivityStatus, statusDropdownChoices} from "../types/activity.ts";
import {MAX_TITLE_CHAR_LEN, placeholderColor, secondaryBgColor, STATUS_STYLES} from "../consts.ts";
import AddActivityModal from "../components/AddActivityModal.tsx";
import AddActivityButtonMobile from "../components/AddActivityButtonMobile.tsx";
import AddActivityButton from "../components/AddActivityButton.tsx";
import ActivityDropdown from "../components/ActivityDropdown.tsx";
import {formatDate} from "../helpers/formatDate.ts";
import {FaRegCalendar, FaRegCalendarCheck} from "react-icons/fa";
import {BiSolidComment} from "react-icons/bi";
import {IoPerson} from "react-icons/io5";

export default function ActivityPage() {
    const navigate = useNavigate();
    const {account} = useAccount()
    useEffect(() => {
        if (!account) navigate("/");
    }, [account, navigate]);

    const {
        activities,
        removeActivities,
        showDeleteModal,
        closeDeleteModal,
        pendingDeleteId,
    } = useActivities()
    const pendingActivity =
        activities.find((a) => a.id === pendingDeleteId) ?? null;
    const pendingTitle =
        (pendingActivity?.title.trim() || "") || "Aktivitas Baru";

    return (
        <>
            <Header/>
            <ActivityBody/>
            <ConfirmModal
                open={showDeleteModal}
                onClose={closeDeleteModal}
                title={`Apakah mau delete "${pendingTitle}"?`}
                onConfirm={() => removeActivities(pendingDeleteId)}
                confirmLabel="Delete"
            />
            <AddActivityModal/>
        </>
    );
}

function ActivityBody() {
    const {
        activities,
        addActivities
    } = useActivities()

    const {statusFilter} = useActivityFilter();

    const filteredActivities = () => {
        console.log(statusFilter);
        if (statusFilter === "All") return activities;
        console.log(activities.filter((a) => a.status === statusFilter));
        return activities.filter((a) => a.status === statusFilter);
    }
    const noActivities = filteredActivities().length <= 0
    const {account} = useAccount();
    const {openAddModal} = useActivities();

    return (
        <div className="mt-10 mx-4 sm:mx-20 lg:mx-48">
            <ActivityHeader/>

            <hr className="mt-4 border-gray-400 sm:border-0"/>

            <div className="mt-4">
                {noActivities && <NoActivities/>}
                {!noActivities && filteredActivities().map((activity) => (
                    <Activity key={activity.id} activity={activity}/>
                ))}

                <AddActivityButtonMobile
                    onClick={() => account?.role == "engineer" ? addActivities() : openAddModal()}/>
            </div>
        </div>
    );
}

function ActivityHeader() {
    const {statusFilter, setStatusFilter} = useActivityFilter();
    const {addActivities, openAddModal} = useActivities();
    const {account} = useAccount();

    return (
        <div className="flex justify-between space-x-5">
            <h2 className="text-3xl sm:text-4xl font-bold">Aktivitas</h2>
            <div className="flex items-center space-x-2">
                <ActivityDropdown value={statusFilter}
                                  onChange={(newStatus) => setStatusFilter(newStatus as ActivityFilter)}
                                  className={`bg-batumbured rounded-3xl opacity-80 hover:opacity-100`} filter={true}
                                  choices={statusDropdownChoices}/>

                <AddActivityButton
                    onClick={() => account?.role == "engineer" ? addActivities() : openAddModal()}/>
            </div>

        </div>
    );
}


function Activity({activity,}: { activity: ActivityItem }) {
    const navigate = useNavigate();
    const {id, title, status, creationDate, dueDate, assignee, comments} = activity;
    const styles = STATUS_STYLES[status] ?? STATUS_STYLES.TODO;
    const {changeTitle, changeStatus, openDeleteModal, isEditableByClient} = useActivities()


    return (
        <div
            className={`${secondaryBgColor} mb-2 gap-3 rounded-xl p-4 flex justify-between items-center w-full cursor-pointer ${styles.border}`}
            onClick={() => navigate(`/activities/${id}`)}
            role="group"
        >
            <div className="flex flex-col min-w-0 gap-2">
                <p className={`text-xs text-left ${styles.text}`}>
                    {status}
                </p>

                <input
                    className={placeholderColor + `truncate font-bold field-sizing-content self-start w-auto max-w-full`}
                    value={title}
                    onChange={(e) => changeTitle(id, e.target.value.length > MAX_TITLE_CHAR_LEN ? title : e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Aktivitas Baru"
                />


                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <FaRegCalendarCheck size={"0.75em"}/>
                        <p className={`text-xs`}>
                            {formatDate(creationDate)}
                        </p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <FaRegCalendar size={"0.75em"}/>
                        <p className={`text-xs`}>
                            {dueDate ? formatDate(dueDate) : "-"}
                        </p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <BiSolidComment size={"0.75em"}/>
                        <p className={`text-xs`}>
                            {comments.length}
                        </p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <IoPerson size={"0.75em"}/>
                        <p className={`text-xs`}>
                            {assignee?.name ? assignee.name : "-"}
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-x-2 flex items-center">
                <button
                    className={`${isEditableByClient ? "block" : "hidden"} not-hover:opacity-50 cursor-pointer hover:underline`}
                    onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(id);
                    }}
                >
                    Delete
                </button>

                <ActivityDropdown value={status} onChange={(newStatus) => changeStatus(id, newStatus as ActivityStatus)}
                                  className={`${isEditableByClient ? "block" : "hidden"} bg-batumbured rounded-xl mr-2 opacity-80 hover:opacity-100`}
                                  choices={statusDropdownChoices}/>

            </div>
        </div>
    );
}
