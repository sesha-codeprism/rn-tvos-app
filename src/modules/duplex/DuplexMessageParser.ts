import DuplexMessage from "./DuplexMessage";
import { generateGUID } from "../../utils/guid";
import NotificationType from "../../@types/NotificationType";
/**
 * Provides parsing logic for the Duplex Messages
 */
export default class DuplexMessageParser {
    public static createMessage(type: string, payload: any, deviceId?: string): string {
        let message = {
            type: type,
            content: JSON.stringify(payload),
            id: generateGUID(),
            device: deviceId,
        };

        return JSON.stringify(message);
    }

    public static parse(message: string): DuplexMessage | null {
        if (!message) {
            console.warn("trying to parse a null message");
            return null;
        }
        let duplexEvent: { type: string; content?: string; continuationToken?: string } | undefined;
        try {
            try {
                duplexEvent = JSON.parse(message);
            } catch (e) {
                const i = message.indexOf("|");
                if (i > 0) {
                    duplexEvent = {
                        type: message.substring(0, i),
                        content: message.substring(i + 1),
                    };
                }
            }
            if (duplexEvent) {
                let duplexMessage = new DuplexMessage();
                let type = (duplexEvent.type)?.replace(/[^a-zA-Z0-9 ]/g, "");
                duplexMessage.type = NotificationType[type as keyof typeof NotificationType] || duplexEvent.type;
                duplexMessage.continuationToken = duplexEvent.continuationToken;
                if (duplexEvent.content) {
                    try {
                        duplexMessage.payload = JSON.parse(duplexEvent.content);
                    } catch {
                        duplexMessage.payload = duplexEvent.content;
                    }
                }
                return duplexMessage;
            }
            return null;
        } catch (e) {
            console.error(`malformed message received ${message}`);
            return null;
        }
    }
}
