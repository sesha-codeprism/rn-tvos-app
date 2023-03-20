import React from "react";


export interface ConflictResolutionData {
    conflictedSubscriptionGroup?: any,
    conflictedSubscriptionItem?: any,
    SeriesId?: string,
    ProgramId?: string,
    isSeries?: boolean,
    isEpisode?: boolean
}


export const ConflictResolutionContext = React.createContext<ConflictResolutionData>({
    conflictedSubscriptionGroup: undefined,
    conflictedSubscriptionItem: undefined,
    SeriesId: undefined,
    ProgramId: undefined,
    isSeries: undefined,
    isEpisode: undefined
});


