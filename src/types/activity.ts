export type ActivityStatus = "All" | "TODO" | "IN PROGRESS" | "DONE" | "PENDING" | "DECLINED";
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
}