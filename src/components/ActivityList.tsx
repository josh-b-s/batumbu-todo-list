import React, {JSX} from "react";
import Activity from "./Activity.tsx"
import {ActivityItem, ActivityStatus} from "../contexts/ActivityContext.tsx";

interface ActivityListProps {
    activities: ActivityItem[];
    onChangeTitle: (id: string, newTitle: string) => void;
    onChangeStatus: (id: string, newStatus: ActivityStatus) => void;
}

export default function ActivityList({
                                         activities,
                                         onChangeTitle,
                                         onChangeStatus,
                                     }: ActivityListProps): JSX.Element {
    return (<> {activities.map((activity) => (
        <Activity key={activity.id} activity={activity} onChangeTitle={onChangeTitle}
                  onChangeStatus={onChangeStatus}/>))} </>);
}