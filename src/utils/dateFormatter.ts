export class DateFormatter {
    static formatUTCDate(dateUTC: string) {
        const newDate = new Date(dateUTC);
        const day = String(newDate.getUTCDate()).padStart(2, '0');
        const month = String(Number(String(newDate.getMonth()).padStart(2, '0')) + 1).padStart(2, '0');
        const year = String(newDate.getUTCFullYear());

        const hours = String(newDate.getUTCHours()).padStart(2, '0');
        const minutes = String(newDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(newDate.getUTCSeconds()).padStart(2, '0');

        const formattedUTCDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        return formattedUTCDate;
    }

    static formatDateTimeLocal(isoString: string, timeZone?: string): string {
        const date = new Date(isoString);

        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            ...(timeZone && { timeZone })
        }).format(date);
    }
}