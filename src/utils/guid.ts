const HEXA_DIGITS = "0123456789abcdef";

export const GUID_LENGTH = 36;

export function hexDigitCount(str: string): number {
    var count = 0;
    var i: number;
    str = str.toUpperCase();
    for (i = 0; i < str.length; i++) {
        if (str[i] >= "0" && str[i] <= "9") {
            count++;
        } else if (str[i] >= "A" && str[i] <= "F") {
            count++;
        } else {
            return -1;
        }
    }
    return count;
}


export function makeRandomHexString(len: number, group4: boolean): string {
    // version 4 GUID request data4 first byte bit 4 is set
    const hexDigitsGroup4 = "89ab";
    var hex = "";
    var i = 0;

    if (group4) {
        hex += hexDigitsGroup4[Math.floor(Math.random() * hexDigitsGroup4.length)];
        i++;
    }
    for (; i < len; i++) {
        hex += HEXA_DIGITS[Math.floor(Math.random() * HEXA_DIGITS.length)];
    }
    return hex;
}

export function generateGUID(data?: string): string {
    var guid = "";
    const guidChunks = [8, 4, 4, 4, 12];

    if (data && hexDigitCount(data) !== data.length) {
        var hexdata = "";
        for (let i = 0; i < data.length; i++) {
            hexdata += HEXA_DIGITS[data.charCodeAt(i) % HEXA_DIGITS.length];
        }
        data = hexdata;
    }
    while (data && data.length < GUID_LENGTH - 4) {
        data += data;
    }

    guidChunks.forEach((cl: number, index: number) => {
        var chunk: string;
        if (data) {
            chunk = data.substr(0, cl);
            data = data.substr(cl);
        } else {
            chunk = makeRandomHexString(cl, index === 3);
        }
        guid += chunk;
        guid += "-";
    });

    guid = guid.substr(0, guid.length - 1);

    return guid;
}