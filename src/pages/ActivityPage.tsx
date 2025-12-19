import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivityList from "../components/ActivityList.tsx";
import AddActivityButton from "../components/AddActivityButton.tsx";
import AddActivityButtonMobile from "../components/AddActivityButtonMobile.tsx";
import AddActivityModal from "../components/AddActivityModal.tsx";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import NoActivities from "../components/NoActivities";
import StatusDropdown from "../components/StatusDropdown.tsx";
import { MAX_TITLE_CHAR_LEN, STATUS_STYLES } from "../consts.ts";
import { useAccount } from "../contexts/AccountContext.tsx";
import { useActivities } from "../contexts/ActivityContext.tsx";
import { useActivityFilter } from "../contexts/ActivityFilterContext.tsx";
import { accounts } from "../types/account.ts";
import { ActivityItem, ActivityStatus } from "../types/activity.ts";

export default function ActivityPage() {
  const navigate = useNavigate();
  const { account } = useAccount();
  useEffect(() => {
    if (!account) navigate("/");
  }, [account, navigate]);

  const {
    activities,
    removeActivities,
    showDeleteModal,
    closeDeleteModal,
    pendingDeleteId,
  } = useActivities();
  const pendingActivity =
    activities.find((a) => a.id === pendingDeleteId) ?? null;
  const pendingTitle = pendingActivity?.title.trim() || "" || "Aktivitas Baru";

  return (
    <>
      <Header />
      <ActivityBody />
      <ConfirmModal
        open={showDeleteModal}
        onClose={closeDeleteModal}
        title={`Apakah mau delete "${pendingTitle}"?`}
        onConfirm={() => removeActivities(pendingDeleteId)}
        confirmLabel="Delete"
      />
      <AddActivityModal />
    </>
  );
}

function ActivityBody() {
  const { activities, addActivities } = useActivities();

  const { statusFilter } = useActivityFilter();

  const filteredActivities = () => {
    if (statusFilter === "All") return activities;
    return activities.filter((a) => a.status === statusFilter);
  };
  const noActivities = filteredActivities().length <= 0;
  const { account } = useAccount();
  const { openAddModal } = useActivities();

  return (
    <div className="mt-10 mx-4 sm:mx-20 lg:mx-48">
      <ActivityHeader />

      <hr className="mt-4 border-gray-400 sm:border-0" />

      <div className="mt-4">
        {noActivities && <NoActivities />}
        {!noActivities && (
          <ActivityList
            activities={filteredActivities()}
            ActivityElement={Activity}
          />
        )}

        <AddActivityButtonMobile
          onClick={() =>
            accounts[account]?.role == "engineer"
              ? addActivities()
              : openAddModal()
          }
        />
      </div>
    </div>
  );
}

function ActivityHeader() {
  const { statusFilter, setStatusFilter } = useActivityFilter();
  const { addActivities, openAddModal } = useActivities();
  const { account } = useAccount();

  return (
    <div className="flex justify-between space-x-5">
      <h2 className="text-3xl sm:text-4xl font-bold">Aktivitas</h2>
      <div className="flex items-center space-x-2">
        <StatusDropdown
          value={statusFilter}
          onChange={(newStatus) => setStatusFilter(newStatus)}
          className={`bg-batumbured rounded-3xl opacity-80 hover:opacity-100`}
          filter={true}
        />

        <AddActivityButton
          onClick={() =>
            accounts[account]?.role == "engineer"
              ? addActivities()
              : openAddModal()
          }
        />
      </div>
    </div>
  );
}

function Activity({ activity }: { activity: ActivityItem }) {
  const navigate = useNavigate();
  const { id, title, status, creator } = activity;
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.TODO;
  const { changeTitle, changeStatus, openDeleteModal, isEditableByClient } =
    useActivities();

  return (
    <div
      className={`bg-white mb-2 gap-3 rounded-xl p-4 flex justify-between items-center w-full cursor-pointer ${styles.border}`}
      onClick={() => navigate(`/activities/${id}`)}
      role="group"
    >
      <div className="flex items-center space-x-2">
        <div className="flex flex-col min-w-0">
          <p className={`font-bold text-left ${styles.text}`}>{status}</p>

          <input
            className={`truncate font-bold placeholder-black focus:placeholder-transparent field-sizing-content focus:p-1 `}
            value={title}
            onChange={(e) =>
              changeTitle(
                id,
                e.target.value.length > MAX_TITLE_CHAR_LEN
                  ? title
                  : e.target.value
              )
            }
            onClick={(e) => e.stopPropagation()}
            placeholder="Aktivitas Baru"
          />
        </div>
        <p className={`text-gray-500`}>by {creator}</p>
      </div>
      <div className="space-x-2 flex items-center">
        <button
          className={`${
            isEditableByClient ? "block" : "hidden"
          } text-gray-500 cursor-pointer hover:text-gray-900 hover:underline`}
          onClick={(e) => {
            e.stopPropagation();
            openDeleteModal(id);
          }}
        >
          Delete
        </button>

        <StatusDropdown
          value={status}
          onChange={(newStatus) =>
            changeStatus(id, newStatus as ActivityStatus)
          }
          className={`${
            isEditableByClient ? "block" : "hidden"
          } bg-batumbured rounded-xl mr-2 opacity-80 hover:opacity-100`}
        />
      </div>
    </div>
  );
}
