import { config } from "../../config/config";

export const DUPLEX_ALERT_TYPE = "Duplex";
export const MULTICAST_ALERT_TYPE = "Multicast";
let subscriberGeoCode: string;
let subscriberGeoCodePart1: string;
let subscriberGeoCodePart2: string;
let subscriberGeoCodePart3: string;

export const EasAlertShortCode: any = {
    EAN: "EAN",
    EOM: "EOM",
    EAT: "EAT",
};

export interface ILocalizedMessage {
    title: string;
    body: string;
}

export interface IEasMessage {
    id: string;
    alertType: string;
    easGeoCodes: string[];
    startTime: Date;
    endTime: Date;
    defaultMessage: ILocalizedMessage;
    localizedMessages?: _.Dictionary<ILocalizedMessage>;
    audioMulticastIp?: string;
    audioDynamicURL?: string;
    audioPort?: string;
    priority?: number;
    alertShortCode?: string;
}

// Dont change the Ordering as backend use this Order
enum EasProperty {
    Fips,
    NtpEndTime,
    NtpStartTime,
    Priority,
    AudioMulticastIp,
    AudioPort,
    AudioNtpDuration,
    Title1,
    Language1,
    Message1,
    Title2,
    Language2,
    Message2,
    Title3,
    Language3,
    Message3,
    Title4,
    Language4,
    Message4,
    Title5,
    Language5,
    Message5,
    ExtData,
    EventId,
    AlertType,
    AlertShortCode,
    AudioDynamicURL,
}

const { easConfig } = config;
export const easTemplate =
    easConfig && easConfig.template ? easConfig.template : "";

export function getTemplateRegexp(template: string): string {
    return template
        .replace(/[-[\]()\/*+?.,\\^$|#\s]/g, "\\$&") // eslint-disable-line
        .replace(/\{[0-9]+\}/g, "([\\s\\S]*)");
}

export function parseMatch(
    matchArray: RegExpMatchArray,
    propertyToIndexMap: _.Dictionary<EasProperty>
): _.Dictionary<string> {
    let result: _.Dictionary<string> = {};
    // Skip the first match as it will be the full message.
    const arrayLength = matchArray.length;
    for (let i = 1, len = arrayLength; i < len; i++) {
        let match = matchArray[i];
        result[propertyToIndexMap[i - 1]] = match
            ? match.replace(/,,/g, ",")
            : match;
    }

    return result;
}

export function getPropertyToIndexMap(
    template: string
): _.Dictionary<EasProperty> {
    let propertyToIndexMap: _.Dictionary<EasProperty> = {};
    let matches = template.match(/\{[0-9]+\}/g);
    if (matches) {
        matches.forEach((key: string, index: number) => {
            propertyToIndexMap[index] = <any>key.slice(1, -1);
        });
    }

    return propertyToIndexMap;
}

function getDateFromTicks(value: string): any {
    let ntpNumeric = parseInt(value, 10);
    if (!isNaN(ntpNumeric)) {
        // High 32-bits represents seconds, and the low 32-bits are the fractional seconds.
        // Javascript is not able to handle this bitwise operation (>> 32) so using division between 2^32 (4294967296) as a workaround to get the ticks in seconds.
        let ticksInSeconds = ntpNumeric / 4294967296;
        // convert to milliseconds.
        let ticksInMilliseconds = ticksInSeconds * 1000;

        // new date is ticks minus difference from epoch in milliseconds
        return new Date(ticksInMilliseconds - easConfig.epochMillisecondsDiff);
    }

    return null;
}

function getMatchIfFound(reg: RegExp, sourceStr: string): string {
    let matchGroups = reg.exec(sourceStr);
    let resValue = "";
    if (matchGroups && matchGroups.length > 1) {
        // found match
        // 0 is the full match string, 1 is the first match group.
        resValue = matchGroups[1];
    }
    return resValue;
}

function getLocalizedMessage(title: string, body: string): any {
    if (title && body) {
        // truncate the title to 30 characters max else it will not display properly on 1 line.
        return <ILocalizedMessage>{
            title: title.substring(0, easConfig.EAS_TITLE_MAX_LENGTH),
            body: body,
        };
    }

    return null;
}

function getDefaultMessage(values: any): ILocalizedMessage {
    let defaultTitle: string = values[EasProperty.Title1];
    let defaultBody: string = values[EasProperty.Message1];

    //let env = config;
    // if custom title regex is present, use special handling to override raw title (currently, used by SaskTel)
    if (easConfig && easConfig?.customTitleRegex) {
        let titleOverride = getMatchIfFound(
            new RegExp(easConfig?.customTitleRegex),
            defaultTitle
        );
        if (titleOverride) {
            defaultTitle = titleOverride;
        }
    }

    // if custom message body regex is present, use special handling to override raw message body (currently, used by SaskTel)
    if (easConfig && easConfig?.customMessageRegex) {
        let messageBodyOverride = getMatchIfFound(
            new RegExp(easConfig?.customMessageRegex),
            defaultBody
        );
        if (messageBodyOverride) {
            defaultBody = messageBodyOverride;
        }
    }

    return getLocalizedMessage(defaultTitle, defaultBody);
}

function getLocalizedMessagesByLanguage(
    values: _.Dictionary<string>
): _.Dictionary<ILocalizedMessage> {
    let messages: _.Dictionary<ILocalizedMessage> = {};
    function addLanguageIfDefined(
        language: string,
        title: string,
        body: string
    ): void {
        let message = getLocalizedMessage(title, body);
        if (language && message) {
            messages[language.toLowerCase()] = message;
        }
    }

    // process custom title/body
    if (
        easConfig &&
        easConfig?.customMessageRegex &&
        easConfig?.customTitleRegex
    ) {
        let defaultTitle: string = values[EasProperty.Title1];
        let defaultBody: string = values[EasProperty.Message1];

        let titleRegex = new RegExp(easConfig.customTitleRegex, "g");
        let msgBodyRegex = new RegExp(easConfig.customMessageRegex, "g");

        // first match is English
        let enUSTitle: string = getMatchIfFound(titleRegex, defaultTitle);
        let enUSMessageBody: string = getMatchIfFound(
            msgBodyRegex,
            defaultBody
        );

        if (
            enUSTitle &&
            enUSMessageBody &&
            enUSTitle.length > 0 &&
            enUSMessageBody.length > 0
        ) {
            addLanguageIfDefined("en-US", enUSTitle, enUSMessageBody);
        }

        // second match is French
        let frCATitle: string = getMatchIfFound(titleRegex, defaultTitle);
        let frCAMessageBody: string = getMatchIfFound(
            msgBodyRegex,
            defaultBody
        );

        if (
            frCATitle &&
            frCAMessageBody &&
            frCATitle.length > 0 &&
            frCAMessageBody.length > 0
        ) {
            addLanguageIfDefined("fr-CA", frCATitle, frCAMessageBody);
        }
    }

    addLanguageIfDefined(
        values[EasProperty.Language2],
        values[EasProperty.Title2],
        values[EasProperty.Message2]
    );
    addLanguageIfDefined(
        values[EasProperty.Language3],
        values[EasProperty.Title3],
        values[EasProperty.Message3]
    );
    addLanguageIfDefined(
        values[EasProperty.Language4],
        values[EasProperty.Title4],
        values[EasProperty.Message4]
    );
    addLanguageIfDefined(
        values[EasProperty.Language5],
        values[EasProperty.Title5],
        values[EasProperty.Message5]
    );

    return messages;
}

function cleanSubscriberGeoCode(subscriberGeoCode: string): string {
    if (!subscriberGeoCode) {
        return easConfig.globalGeoCode;
    }

    subscriberGeoCode = subscriberGeoCode.trim();

    if (subscriberGeoCode.length === easConfig.geoCodeLength - 1) {
        subscriberGeoCode = "0" + subscriberGeoCode;
    }

    if (subscriberGeoCode.length === easConfig.geoCodeLength) {
        if (!easConfig.validGeoCodeRegex.test(subscriberGeoCode)) {
            subscriberGeoCode = easConfig.globalGeoCode;
        }
    } else {
        subscriberGeoCode = easConfig.globalGeoCode;
    }

    subscriberGeoCodePart1 = getGeoCodePart1(subscriberGeoCode);
    subscriberGeoCodePart2 = getGeoCodePart2(subscriberGeoCode);
    subscriberGeoCodePart3 = getGeoCodePart3(subscriberGeoCode);

    return subscriberGeoCode;
}

export function parseMessage(
    message: string,
    locale: any,
    easGeoCode: any
): any {
    if (!message) {
        return null;
    }
    let audioCustomURL = "";
    let newAudio;
    let templateRegex = getTemplateRegexp(easTemplate);
    let matches = message.match(templateRegex);
    let propertyToIndex = getPropertyToIndexMap(easTemplate);
    if (matches) {
        let values = parseMatch(matches, propertyToIndex);
        let defaultMessage = getDefaultMessage(values);
        let id = values[EasProperty.EventId];
        let startTime = getDateFromTicks(values[EasProperty.NtpStartTime]);
        let endTime = getDateFromTicks(values[EasProperty.NtpEndTime]);
        if (
            values[EasProperty.AudioPort] === "0" &&
            values[EasProperty.AudioMulticastIp]
        ) {
            try {
                newAudio = JSON.parse(values[EasProperty.AudioMulticastIp]);
            } catch (e) {
                newAudio = null;
            }
            newAudio?.audio?.length &&
                newAudio.audio.forEach((element: any) => {
                    if (element.culture === locale) {
                        audioCustomURL = element.value;
                    }
                });
        }

        if (id && defaultMessage && startTime && endTime) {
            let geoCode = values[EasProperty.Fips]
                ? values[EasProperty.Fips].split(",")
                : [];
            subscriberGeoCode = cleanSubscriberGeoCode(easGeoCode);
            return <IEasMessage>{
                id: values[EasProperty.EventId],
                alertType:
                    values[EasProperty.AlertType] &&
                        values[EasProperty.AlertType].trim().toLowerCase() ===
                        DUPLEX_ALERT_TYPE.toLowerCase()
                        ? DUPLEX_ALERT_TYPE
                        : MULTICAST_ALERT_TYPE,
                easGeoCodes: geoCode,
                defaultMessage: defaultMessage,
                localizedMessages: getLocalizedMessagesByLanguage(values),
                startTime: startTime,
                endTime: endTime,
                audioDynamicURL: audioCustomURL,
                audioMulticastIp: !audioCustomURL
                    ? values[EasProperty.AudioMulticastIp]
                    : "",
                audioPort: !audioCustomURL ? values[EasProperty.AudioPort] : "",
                priority: parseInt(values[EasProperty.Priority], 10),
                alertShortCode: values[EasProperty.AlertShortCode],
            };
        }
    }
}

function getGeoCodePart1(geoCode: string): string {
    let len = geoCode.length;
    let geoCodePart1 = geoCode.substr(
        0,
        len - easConfig.part2Length - easConfig.part3Length
    );

    return geoCodePart1;
}

function getGeoCodePart2(geoCode: string): string {
    let len = geoCode.length;
    let geoCodePart2 = geoCode.substr(
        len - easConfig.part2Length - easConfig.part3Length,
        easConfig.part2Length
    );

    return geoCodePart2;
}

function getGeoCodePart3(geoCode: string): string {
    let len = geoCode.length;
    let geoCodePart3 = geoCode.substr(
        len - easConfig.part3Length,
        easConfig.part3Length
    );

    return geoCodePart3;
}

function isWildcard(input: string): boolean {
    // A wildcard is composed only of 0s (e.g. "0", "000")
    return +input === 0;
}

export function isFipsSgcMatch(messageGeoCode: string): boolean {
    if (!easConfig.validGeoCodeRegex.test(messageGeoCode)) {
        return false;
    }

    if (subscriberGeoCode.length !== messageGeoCode.length) {
        return false;
    }

    if (subscriberGeoCode === easConfig.globalGeoCode) {
        return true;
    }

    if (messageGeoCode === easConfig.globalGeoCode) {
        return true;
    }

    if (subscriberGeoCode === messageGeoCode) {
        return true;
    }

    let messageGeoCodePart1 = getGeoCodePart1(messageGeoCode);
    let messageGeoCodePart2 = getGeoCodePart2(messageGeoCode);
    let messageGeoCodePart3 = getGeoCodePart3(messageGeoCode);

    if (
        messageGeoCodePart1 === subscriberGeoCodePart1 ||
        isWildcard(messageGeoCodePart1)
    ) {
        if (
            messageGeoCodePart2 === subscriberGeoCodePart2 ||
            isWildcard(messageGeoCodePart2)
        ) {
            if (
                messageGeoCodePart3 === subscriberGeoCodePart3 ||
                isWildcard(messageGeoCodePart3)
            ) {
                return true;
            }
        }
    }
    return false;
}

export function isMatch(messageGeoCodes: string[]): boolean {
    if (!messageGeoCodes || messageGeoCodes.length === 0) {
        return false;
    }

    for (let i = 0, len = messageGeoCodes.length; i < len; i++) {
        let messageGeoCode = messageGeoCodes[i];

        if (messageGeoCode.length === easConfig.geoCodeLength - 1) {
            messageGeoCode = "0" + messageGeoCode;
        }

        if (isFipsSgcMatch(messageGeoCode)) {
            return true;
        }
    }
    return false;
}
