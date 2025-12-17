import React from "react";
import {useSubActivities} from "../contexts/SubActivityContext.tsx";
import {useActivities} from "../contexts/ActivityContext.tsx";

export default function SubActivityDescBox({activityId}:{activityId:string}) {
    const {activity} = useSubActivities()
    const {changeDescription} = useActivities();
    return (<div className="bg-white rounded-xl p-3 mb-2">
        <p className="text-gray-500 font-bold">Deskripsi</p>
        <textarea placeholder="Deskripsi di sini"
                  value={activity?.description}
                  onChange={e => changeDescription(activityId, e.target.value)}
                  className="w-full hover:bg-gray-200 rounded-md p-1 field-sizing-content resize-none focus:bg-transparent"/>
    </div>)
}