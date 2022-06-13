import { createActionCreators, Dispatch } from "../../../utils/redux-util";
import { StateSlice } from "./stateSlice";
import DuplexMessage from "../DuplexMessage";
import {
    State,
} from "../../../index";
import { DuplexMessagesReducerActions, actions as reducerActions } from "./reducer";
import notificationType from "../../../__types__/subscriber/notificationType";
import { actionCreators as pinnedItemsActionCreators } from "../../subscriber/pinnedItems";
import { actionCreators as subscriberDynamicFeedsActionCreators } from "../../subscriber/dynamicFeeds";
import { LibraryId, Library } from "../../../__types__/common/cloud.schemas";
import { actionCreators as profileDataLoadingActionCreators } from "../../subscriber/profiles";
import { actionCreators as subscriptionGroupsActionCreator } from "../../dvr/subscriptionGroups";
import { actionCreators as scheduledSubscriptionGroupsActionCreator } from "../../dvr/scheduled";
import { actionCreators as viewableSubscriptionGroupsActionCreator } from "../../dvr/viewable";
import { actionCreators as easAlertActionCreators } from "../../EASAlert";

/**
 * Action creators
 *
 * Functions that create actions
 *
 * Action creators for reducer actions created automatically
 *
 * This is the place for [thunk action creators](https://github.com/reduxjs/redux-thunk#motivation)
 * with async logic inside
 */
export const actionCreators = {
    ...createActionCreators<StateSlice, DuplexMessagesReducerActions>(reducerActions),
    handleMessage(message: DuplexMessage) {
        return async (dispatch: Dispatch<State>, getState: () => State) => {
            dispatch(this.addMessage(message))
            const continuationToken : string = message.continuationToken!;
            if (continuationToken) {
                dispatch(this.addContinuationToken(continuationToken));
            }

            switch (message.type) {
                case notificationType.pin:
                case notificationType.unpin: {
                    if (message.payload && message.payload.length > 0) {
                        const payload = message.payload[0];
                        if(payload) {
                            dispatch(pinnedItemsActionCreators.setPinnedStatus(payload.id, payload.isPinned));
                            dispatch(subscriberDynamicFeedsActionCreators.reload({ libraryId: <Library>(LibraryId[LibraryId.Pins]), atHome: true , $top: 16, $skip: 0}));
                        }
                    }
                    break;
                }
                case notificationType.ProfileUpdated: {
                    if (message.payload && message.payload.length > 0) {
                        const payload = message.payload[0];
                        if (payload) {
                            // Refresh all profiles
                            dispatch(profileDataLoadingActionCreators.reload());
                        }
                    }
                    break;
                }
                case notificationType.easmessage : {
                    if (message.payload && message.payload.length > 0) {
                        const payload = message.payload;
                        if(payload) {
                            dispatch(easAlertActionCreators.setEASmessage(payload));
                        }
                }
                break;
            }    
            case notificationType.dvrUpdated : {
                if (message.payload) {
                    const payload = message.payload;
                    if(payload) {
                        dispatch(subscriptionGroupsActionCreator.reload({
                            type: "all",
                            state: "viewable-scheduled",
                        }));
                        dispatch(scheduledSubscriptionGroupsActionCreator.reload());
                        dispatch(viewableSubscriptionGroupsActionCreator.reload());
                    }
            }
            break;
        }  
        }
    }
}
}
