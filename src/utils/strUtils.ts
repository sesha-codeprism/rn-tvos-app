export function endsWith(str: string, part: string): boolean {
    if (!str || !part || str.length < part.length) {
        return false;
    }
    return str.length - str.lastIndexOf(part) === part.length;
}

export function startsWith(str: string, part: string): boolean {
    if (!str || !part) {
        return false;
    }
    return str.lastIndexOf(part, 0) === 0;
}

export function contains(str: string, part: string): boolean {
    return str.indexOf(part) >= 0;
}

export function isNullOrUndefined(str: string): boolean {
    return typeof str === "undefined" || str === null;
}

// ### white spaces will be considered empty
export function isEmpty(str: string): boolean {
    return str.trim().length === 0;
}

export function isNullOrWhiteSpace(str: string): boolean {
    return str == null || isEmpty(str);
}
