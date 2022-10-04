import SHA256 from "crypto-js/sha256";
import { ItemShowType, sourceTypeString } from "./analytics/consts";

const digitsPatternMatch = /\{([0-9]+)\}/;

export function convertStringToHashKey(str: string): string {
    let secretKey: string = SHA256(str).toString();
    return secretKey;
}

export function getPasscodeHash(passcode: string, accountId: string): string {
    if (!isHash(passcode)) {
        let encryptedPasscode: string = convertStringToHashKey(
            passcode + accountId
        );
        return encryptedPasscode;
    } else {
        return passcode;
    }
}

// validate string is a sha256 hash
export function isHash(str: string) {
    let sha256Regex = new RegExp(/^([a-f0-9]{64})$/);
    return sha256Regex.test(str);
}

export function padLeft(num: number) {
    return num < 10 ? `0${num}` : num;
}

export function getTimeStringFromISOString(time: string) {
    const date = new Date(time);
    const hours =
        date.getHours() <= 12 ? date.getHours() : date.getHours() % 12;
    const minutes = date.getMinutes();
    const am = date.getHours() < 12;

    return `${padLeft(hours)}:${padLeft(minutes)} ${am ? "AM" : "PM"}`;
}

export function getItemId(data: any) {
    if (!data) {
        return undefined;
    }

    let id = data?.CatalogInfo?.UniversalProgramId;
    if (data?.assetType?.sourceType === sourceTypeString.LIVE) {
        id =
            data?.Schedule?.SeriesId ||
            data?.CatalogInfo?.SeriesId ||
            data?.Schedule?.ProgramId ||
            data?.SeriesId ||
            data?.ProgramId;
    } else if (!id && data?.ShowType === ItemShowType.Movie) {
        id = data?.Schedule?.ProgramId || data?.ProgramId;
    } else if (!id && data?.CatalogInfo?.ShowType === ItemShowType.TVShow) {
        id = data?.CatalogInfo?.SeriesId;
    } else if (
        data?.SeriesId ||
        data?.ProgramId ||
        data?.Schedule?.SeriesId ||
        data?.CatalogInfo?.SeriesId
    ) {
        id =
            data?.SeriesId ||
            data?.ProgramId ||
            data?.Schedule?.SeriesId ||
            data?.CatalogInfo?.SeriesId;
    }

    id = id || data?.Id;
    return id;
}

export function convertISOStringToTimeStamp(date: string): number {
    if (!date) {
        return 0;
    }
    return new Date(date).getTime();
}

export const convertSecondsToDayHourMinStrings = (s: number): string => {
    if (!s && s !== 0) {
        return "0 Secs";
    }
    const d = Math.floor(s / (3600 * 24));

    s -= d * 3600 * 24;

    const h = Math.floor(s / 3600);

    s -= h * 3600;

    const m = Math.floor(s / 60);

    s -= m * 60;

    const tmp = [];

    d && tmp.push(`${d} d`);

    (d || h) && tmp.push(`${h} h`);

    (d || h || m) && tmp.push(s > 30 ? `${m + 1} m` : `${m} m`);

    return tmp.join(" ");
};

// computes size of JSON object in bytes
// JSON is converted to string and every character can use max of 8 bytes.
export function getSizeInBytes(obj: any): number {
    if (!obj) {
        return 0;
    }
    const objString = JSON.stringify(obj);
    const m = encodeURIComponent(objString).match(/%[89ABab]/g);
    const objLength = objString.length + (m ? m.length : 0);
    const objSize = objLength * 8;
    return objSize;
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function getPlaybackSessionId(): string {
    return `${Math.random().toString(16).slice(2)}${Math.random()
        .toString(16)
        .slice(2)}-${getRandomInt(9)}-${Date.now()}`;
}

export function getDateDifferenceInSeconds(date1: Date, date2: Date): number {
    const dateDiffInMS = date2.getTime() - date1.getTime();
    return Math.abs(Math.floor(dateDiffInMS / 1000));
}

export function padTo2Digits(num: any) {
    return num.toString().padStart(2, "0");
}

export function formatDate(date: any) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join("/");
}

export function formatArgs(args: any[], forlogs = false): string {
    let format = args ? args[0] : "",
        parmatch: string,
        parmNum: number;
    let formatted = false;

    if (format === undefined || format === null) {
        format = "";
    } else {
        format = format.toString(); //it could be object in case of exceptions etc.
        while (null !== (parmatch = format.match(digitsPatternMatch))) {
            parmNum = parseInt(parmatch[1], 10);
            const val = args[1 + parmNum] || "";
            // don't use format.replace() with a string or you may get unexpected results if the string has a "$" in it

            format = format.replace(
                digitsPatternMatch,
                (str: string, ...fargs: any[]) => {
                    let didMatch = false;
                    for (let i = 0; i < fargs.length - 1; i += 2) {
                        const pos = fargs[i + 1];

                        // format parms are only allowed once in a format string
                        if (pos >= 0 && fargs[i] === parmatch[1]) {
                            didMatch = true;
                            formatted = true;
                            return val;
                        }
                    }
                    return str;
                }
            );
        }
    }
    if (forlogs && !formatted) {
        return args
            .map((arg: any): string => {
                if (typeof arg === "string" || typeof arg === "number") {
                    return String(arg);
                }
                return JSON.stringify(arg);
            })
            .join(" ");
    }
    return format;
}

export function format(...args: string[]): string {
    return formatArgs(args);
}

export function durationStringToSeconds(duration: string): number {
    if (!duration) {
        return NaN;
    }
    const negative = duration.indexOf("-") === 0 ? -1 : 1;
    if (negative < 0) {
        duration = duration.slice(1);
    }

    let fraction = 0;
    const iDot = duration.indexOf(".");
    if (iDot !== -1) {
        if (duration.indexOf(":") > iDot) {
            duration = duration.replace(".", ":");
        }
    }
    const split = duration.split(".");

    if (split.length === 2) {
        fraction = parseFloat("0." + split[1]);
        duration = split[0];
    }
    if (split.length < 3) {
        let durationParts = duration.split(":");
        if (durationParts.length <= 1) {
            return negative * Number(durationParts) + fraction;
        } else if (durationParts.length > 1 && durationParts.length <= 4) {
            const secondsInHour = 3600;
            durationParts = durationParts.reverse();
            let hours = Number(durationParts[2] || 0);
            let days = 0;
            if (durationParts.length === 4) {
                if (hours < 24) {
                    days = Number(durationParts[3] || 0);
                } else {
                    return NaN;
                }
            } else if (hours > 24) {
                days += Math.floor(hours / 24);
                hours -= days * 24;
            }
            const t =
                negative * days * 24 * secondsInHour +
                Math.min(24, hours) * secondsInHour +
                Math.min(59, Number(durationParts[1]) || 0) * 60 +
                Math.min(59, Number(durationParts[0]) || 0) +
                fraction;
            return t;
        }
    }
    return Infinity;
}

export function convertSecondsToHours(
    seconds: number,
    fraction = false
): number {
    let hours = seconds / 3600;

    if (isNaN(hours)) {
        return NaN;
    }

    if (fraction) {
        return +hours.toFixed(1);
    }

    return Math.round(hours);
}
