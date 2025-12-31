export function formatDate(
    date: Date | string,
    options?: { showTime?: boolean }
) {
    const d = typeof date === "string" ? new Date(date) : date;

    if (isNaN(d.getTime())) return "-";

    const showTime = options?.showTime ?? true;

    const formatter = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...(showTime && {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }),
    });

    return formatter
        .format(d)
        .replace(/\./g, ":");
}
