import NotificationType from "../../__types__/subscriber/notificationType"

export default class DuplexMessage {
    type!: NotificationType;
    payload: any;
    continuationToken?: string;
}
