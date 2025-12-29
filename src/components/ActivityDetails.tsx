import React, {JSX} from "react";
import SubActivityDescBox from "./SubActivityDescBox.tsx";
import {useActivities} from "../contexts/ActivityContext.tsx";
import DueDatePicker from "./DueDatePicker.tsx";
import {useSubActivities} from "../contexts/SubActivityContext.tsx";
import {secondaryBgColor} from "../consts.ts";
import ActivityDropdown from "./ActivityDropdown.tsx";
import {useAccount} from "../contexts/AccountContext.tsx";
import CommentSection from "./CommentSection.tsx";

export default function ActivityDetails(): JSX.Element {
    const {activity} = useSubActivities();
    const {changeDueDate, changeAssignee} = useActivities();
    const {getEngineerChoices} = useAccount();
    const {account} = useAccount();
    return (
        <div className={secondaryBgColor + " rounded-xl p-4 space-y-3 mb-3"}>
            <SubActivityDescBox/>
            <p className={"mb-2"}>Due Date</p>
            <DueDatePicker
                value={activity?.dueDate ?? null}
                onChange={(d) => changeDueDate(activity?.id ?? '', d)}
                disabled={activity?.creator.name != account?.name}
            />
            <p className={"mb-2"}>Assignee</p>
            <ActivityDropdown choices={getEngineerChoices()} className={"border border-gray-500 w-full rounded-2xl"}
                              onChange={(newA) => {
                                  changeAssignee(activity?.id!, newA)
                              }} value={activity?.assignee?.name} hasEmptyChoice
                              disabled={activity?.creator.name != account?.name}/>
            <CommentSection/>
        </div>
    )
}