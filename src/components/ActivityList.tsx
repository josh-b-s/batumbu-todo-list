import React from "react";

interface HasId {
    id: string;
}

interface ActivityListProps<T extends HasId> {
    activities: T[];
    ActivityElement: React.ComponentType<{ activity: T }>;
}

export default function ActivityList<T extends HasId>({
                                                          activities,
                                                          ActivityElement,
                                                      }: ActivityListProps<T>) {
    return (
        <>
            {activities.map((activity) => (
                <ActivityElement key={activity.id} activity={activity} />
            ))}
        </>
    );
}
