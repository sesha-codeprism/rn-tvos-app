export function debounce(cb: () => void, timeout: number) {
    const timer = setTimeout(cb, timeout);
    return {
        cancel: () => {
            clearTimeout(timer);
        },
    };
}

export function debounce2(func: () => void, wait: number, immediate?: boolean) {
    let timeout: any;
    //@ts-ignore
    return (...args) => {
        let context;
        //@ts-ignore
        context = this;

        const later = () => {
            timeout = null;
            //@ts-ignore
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);
        //@ts-ignore
        if (callNow) func.apply(context, args);
    };
}