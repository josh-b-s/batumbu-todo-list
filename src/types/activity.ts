import {User, UserComment} from "./account.ts";

export type ActivityStatus = "TODO" | "IN PROGRESS" | "DONE" | "PENDING" | "DECLINED";
export type ActivityFilter = ActivityStatus | "All";
export type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface SubActivityItem {
    id: string;
    title: string;
    priority?: Priority;
    checked?: boolean;
}

export interface ActivityItem {
    id: string;
    title: string;
    status: ActivityStatus;
    subActivities: SubActivityItem[];
    description: string;
    creator: User;
    assignee: User | null;
    creationDate: Date;
    dueDate: Date | null;
    comments: UserComment[];
}

export const statusDropdownChoices = [{label: "TODO", value: "TODO"}, {
    label: "IN PROGRESS",
    value: "IN PROGRESS"
}, {label: "DONE", value: "DONE"}, {label: "PENDING", value: "PENDING"}, {label: "DECLINED", value: "DECLINED"}]

export const priorityDropdownChoices = [{label: "Low", value: "Low"}, {
    label: "Medium",
    value: "Medium"
}, {label: "High", value: "High"}, {label: "Urgent", value: "Urgent"}]
