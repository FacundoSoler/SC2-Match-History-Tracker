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

    static matchHistoryDateDiff(mhDatetime: Date, currentDatetime: Date) {
        const dateDiffMiliseconds = Math.abs(mhDatetime.getTime() - currentDatetime.getTime());
        const dateDiffMinutes = Math.floor(dateDiffMiliseconds / 1000 / 60);

        if (dateDiffMinutes < 60) {
            return `${dateDiffMinutes} minutes`;
        }

        const dateDiffHours = Math.round(dateDiffMinutes / 60);
        if (dateDiffHours < 24) {
            if (dateDiffHours === 1) return `${dateDiffHours} hour`;
            return `${dateDiffHours} hours`;
        }

        const dateDiffDays = Math.floor(dateDiffHours / 24);
        if (dateDiffDays < 30) {
            if (dateDiffDays === 1) return `${dateDiffDays} day`;
            return `${dateDiffDays} days`;
        }

        const dateDiffMonths = Math.floor(dateDiffDays / 30);
        if (dateDiffMonths < 12) {
            if (dateDiffMonths === 1) return `${dateDiffMonths} month`; 
            return `${dateDiffMonths} months`;
        }

        const dateDiffYears = Math.floor(dateDiffMonths / 12);
        if (dateDiffYears === 1) return `${dateDiffYears} year`;
        return `${dateDiffYears} years`;
    }
}