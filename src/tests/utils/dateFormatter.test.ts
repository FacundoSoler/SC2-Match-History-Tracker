import { describe, it, expect } from 'vitest';
import { DateFormatter } from '../../utils/dateFormatter';

describe('formatUTCDate', () => {
    it('Format UTC Date to dd/mm/yyyy hh:mm:ss format', () => {
        const testDateString = 'Sun, 06 Sep 2026 20:47:32 GMT';
        const expectedOutputDate = `06/09/2026 20:47:32`;
        const result = DateFormatter.formatUTCDate(testDateString);
        expect(result).toBe(expectedOutputDate);
    });

    it('format ISO 8601 string to UTC in dd/mm/yyyy hh:mm:ss format', () => {
        const arrange = '2026-09-06T20:47:32.000Z';
        const result = DateFormatter.formatUTCDate(arrange);
        expect(result).toBe('06/09/2026 20:47:32');
    });
})

describe('formatDateTimeLocal', () => {
    it('format UTC Date using Argentina timeZone returns valid formatted date', () => {
        const testDateString = 'Sun, 06 Sep 2026 20:47:32 GMT';
        const expectedOutputDate = `06/09/2026, 17:47:32`;
        const timeZone = 'America/Argentina/Cordoba';
        const result = DateFormatter.formatDateTimeLocal(testDateString, timeZone);

        expect(result).toBe(expectedOutputDate);
    });

    it('format UTC Date using Argentina timeZone returns valid formatted date', () => {
        const testDateString = 'Sun, 06 Sep 2026 20:47:32 GMT';
        const expectedOutputDate = `07/09/2026, 05:47:32`;
        const timeZone = 'Asia/Tokyo';
        const result = DateFormatter.formatDateTimeLocal(testDateString, timeZone);

        expect(result).toBe(expectedOutputDate);
    });
});