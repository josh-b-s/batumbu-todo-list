export type ActivityStatus = "All" | "TODO" | "IN PROGRESS" | "DONE" | "PENDING" | "DECLINED";

export interface SubActivity {
    id: string;
    title: string;
    checked?: boolean;
    priority?: "Low" | "Medium" | "High" | "Urgent";
}

export interface ActivityItem {
    id: string;
    title: string;
    status: ActivityStatus;
    subActivities: SubActivity[];
}