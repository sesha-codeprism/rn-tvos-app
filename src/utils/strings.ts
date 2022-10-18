export const replacePlaceHoldersInTemplatedString = (
    str: string,
    replacements: any
) => {
    return str.replace(/{\w+}/g, (placeholderWithDelimiters) => {
        const placeholderWithoutDelimiters = placeholderWithDelimiters.substring(
            1,
            placeholderWithDelimiters.length - 1
        );
        const stringReplacement =
            replacements[placeholderWithoutDelimiters] ||
            null;
        return stringReplacement;
    });
};

export const addPrefixToUrl = (url: string, prefix: string) => {
    if (!prefix || !url) {
        return url;
    }

    let [first, second] = url.split("//");
    return `${first}//${prefix}${second}`;
};
