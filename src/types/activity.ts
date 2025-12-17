export type ActivityStatus = "TODO" | "IN PROGRESS" | "DONE" | "PENDING" | "DECLINED";
export type ActivityFilter = ActivityStatus | "All";
export type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface SubActivity {
    id: string;
    title: string;
    priority?: Priority;
    checked?: boolean;
}

export interface ActivityItem {
    id: string;
    title: string;
    status: ActivityStatus;
    subActivities: SubActivity[];
    description: string;
    creator: string;
}