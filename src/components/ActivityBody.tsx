// src/components/ActivityBody.tsx
import React, {JSX} from "react";
import { useNavigate } from "react-router-dom";
import { useActivities } from "../contexts/ActivityContext.tsx";
import NoActivities from "./NoActivities";
import ConfirmModal from "./ConfirmModal";
import ActivityList from "./ActivityList"; 

export default function ActivityBody(): JSX.Element {
    const navigate = useNavigate();
    const {
        activities,
        addActivity,
        removeActivity,
        updateTitle,
        changeStatus,
        statusFilter,
        setStatusFilter,
    } = useActivities();

    const [showModal, setShowModal] = React.useState(false);
    const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

    const openDeleteModal = (id: string) => {
        setPendingDeleteId(id);
        setShowModal(true);
    };
    const closeModal = () => {
        setPendingDeleteId(null);
        setShowModal(false);
    };
    const confirmDelete = () => {
        if (pendingDeleteId) removeActivity(pendingDeleteId);
        closeModal();
    };

    const pendingTitle = activities.find((a) => a.id === pendingDeleteId)?.title ?? "Aktivitas Baru";

    return (
        <div className="mt-10 mx-4 sm:mx-20 lg:mx-48">
            <div className="flex justify-between space-x-5">
                <h2 className="text-3xl sm:text-4xl font-bold">Aktivitas</h2>
                <div className="flex items-center space-x-2">
                    {/* Status filter uses context setStatusFilter */}
                    <button className="bg-batumbured rounded-full w-12 h-12 text-white" onClick={addActivity}>
                        +
                    </button>
                </div>
            </div>

            <div className="mt-8">
                {activities.length <= 0 ? <NoActivities /> : (
                    <ActivityList
                        activities={activities}
                        onDelete={(id) => openDeleteModal(id)}
                        onChangeTitle={(id, title) => updateTitle(id, title)}
                        onChangeStatus={(id, st) => changeStatus(id, st)}
                    />
                )}
            </div>

            <ConfirmModal
                open={showModal}
                onClose={closeModal}
                title={`Apakah mau delete "${pendingTitle}"?`}
                onConfirm={confirmDelete}
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
}
