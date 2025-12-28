import React from "react";
import SubActivityDescBox from "./SubActivityDescBox.tsx";
import {JSX} from "react";
import {useActivities} from "../contexts/ActivityContext.tsx";
import DueDatePicker from "./DueDatePicker.tsx";
import {useSubActivities} from "../contexts/SubActivityContext.tsx";
import {secondaryBgColor} from "../consts.ts";

export default function ActivityDetails({activityId}: { activityId: string }): JSX.Element {
    const {activity} = useSubActivities();
    const { changeDueDate } = useActivities();
    return (
        <div className={secondaryBgColor + " rounded-xl p-4 space-y-3 mb-3"}>
            <SubActivityDescBox activityId={activityId}/>
            <p className={"mb-2"}>Due Date</p>
            <DueDatePicker
                value={activity?.dueDate ?? null}
                onChange={(d) => changeDueDate(activity?.id ?? '', d)}
            />
        </div>
    )
}