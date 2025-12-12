import {ActivityStatus, Priority} from "./types/activity.ts";

export const STATUS_STYLES: Record<ActivityStatus, { border: string; text: string }> = {
    TODO: {border: "", text: "text-gray-500"},
    "IN PROGRESS": {border: "border-2 border-blue-500", text: "text-blue-500"},
    DONE: {border: "border-2 border-green-500", text: "text-green-500"},
    PENDING: {border: "border-2 border-yellow-500", text: "text-yellow-500"},
    DECLINED: {border: "border-2 border-red-500", text: "text-red-500"},
};

export const PRIORITY_STYLES: Record<Priority, { border: string; bg: string; text: string }> = {
    Low: {border: "border-blue-500", bg: "bg-blue-500", text: "text-blue-800"},
    Medium: {border: "border-yellow-500", bg: "bg-yellow-500", text: "text-yellow-800"},
    High: {border: "border-orange-500", bg: "bg-orange-500", text: "text-orange-800"},
    Urgent: {border: "border-red-500", bg: "bg-red-500", text: "text-red-800"},
};

export const MAX_CHAR_LEN = 50

export const enabledStyle = (enabled: boolean) => {
    return enabled ? "bg-batumbured opacity-80 hover:opacity-100 cursor-pointer" : "bg-gray-500";
}
export const STATUS_LABEL: Record<ActivityStatus, string> = {
    TODO: "Back to Backlog",
    "IN PROGRESS": "Start",
    DONE: "Mark as Done",
    PENDING: "Put on Hold",
    DECLINED: "Decline"
};

export const PRIMARY_NEXT: Record<ActivityStatus, ActivityStatus | null> = {
    TODO: "IN PROGRESS",
    "IN PROGRESS": "DONE",
    DONE: "TODO",
    PENDING: "IN PROGRESS",
    DECLINED: null
};

export const SECONDARY_NEXT: Record<ActivityStatus, ActivityStatus | null> = {
    TODO: "DECLINED",
    "IN PROGRESS": "PENDING",
    DONE: "DECLINED",
    PENDING: "DECLINED",
    DECLINED: null
};

