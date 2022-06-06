import { State } from "../../../index";
import NotificationType from "../../../__types__/subscriber/notificationType";

export const selectors = {
    getByNotificationType: (state: State, notificationType: NotificationType) => state.duplex.messages[NotificationType[notificationType as keyof typeof NotificationType]],
    getContinuationToken: (state: State) => state.duplex.continuationToken,
};
