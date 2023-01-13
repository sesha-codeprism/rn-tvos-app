function getNewDate(): Date {
    return new Date(new Date().setSeconds(0));
}

function formatUtcDateYearMonthDay(date: Date): string {
    const year = date.getUTCFullYear(); // year in 4-digit format
    const month = date.getUTCMonth() + 1; // months are 0 indexed so add one
    const day = date.getUTCDate();

    return [year, padLeftWithZero(month), padLeftWithZero(day)].join("-");
}

function padLeftWithZero(num: number): string {
    return num > 9 ? num.toString() : "0" + num;
}

function convertISOStringToTimeStamp(date: string): number {
    return new Date(date).getTime();
}

/**
 * Returns slot corresponding to the date provided or current date.
 * @param date If provided, slot corresponding to this date is returned.
 */
function getSlot(date?: Date) {
    if (!date) {
        // If no adte is provided, return current slot.
        date = new Date();
    }

    return ~~(date.getUTCHours() / 3) * 3;
}

const DateUtils = {
    getNewDate,
    formatUtcDateYearMonthDay,
    padLeftWithZero,
    convertISOStringToTimeStamp,
    getSlot,
};

export default DateUtils;