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

describe('matchHistoryDateDiff', () => {
    it('Return Minutes difference between match history Date and the current datetime', () => {
        const today = new Date('2026-09-08T22:00:00Z');
        const matchHistoryDate = new Date('2026-09-08T21:45:00Z');
        
        const result = DateFormatter.matchHistoryDateDiff(matchHistoryDate, today);
        expect(result).toBe(`15 minutes`);
    });

    it('Return Hours difference between match history Date and the current datetime', () => {
        const today = new Date('2026-09-08T18:00:00Z');
        const matchHistoryDate = new Date('2026-09-08T16:55:00Z');
        
        const result = DateFormatter.matchHistoryDateDiff(matchHistoryDate, today);
        expect(result).toBe(`1 hour`);
    });

    it('Return Hours difference between match history Date and the current datetime', () => {
        const today = new Date('2026-09-08T18:00:00Z');
        const matchHistoryDate = new Date('2026-09-08T15:45:00Z');
        
        const result = DateFormatter.matchHistoryDateDiff(matchHistoryDate, today);
        expect(result).toBe(`2 hours`);
    });

    it('Return Days difference between match history Date and the current datetime when diff more than 24 hours', () => {
        const today = new Date('2026-09-08T18:00:00Z');
        const matchHistoryDate = new Date('2026-09-07T15:00:00Z');
        
        const result = DateFormatter.matchHistoryDateDiff(matchHistoryDate, today);
        expect(result).toBe(`1 day`);
    });

    it('Return Days difference between match history Date and the current datetime when diff more than 1 day', () => {
        const today = new Date('2026-09-08T18:00:00Z');
        const matchHistoryDate = new Date('2026-09-06T15:00:00Z');
        
        const result = DateFormatter.matchHistoryDateDiff(matchHistoryDate, today);
        expect(result).toBe(`2 days`);
    });

    it('Return Months difference between match history Date and the current datetime when diff more than 30 days', () => {
        const today = new Date('2026-09-08T18:00:00Z');
        const matchHistoryDate = new Date('2026-08-07T15:00:00Z');
        
        const result = DateFormatter.matchHistoryDateDiff(matchHistoryDate, today);
        expect(result).toBe(`1 month`);
    });

     it('Return Months difference between match history Date and the current datetime when diff more than 30 days', () => {
        const today = new Date('2026-09-08T18:00:00Z');
        const matchHistoryDate = new Date('2026-07-07T15:00:00Z');
        
        const result = DateFormatter.matchHistoryDateDiff(matchHistoryDate, today);
        expect(result).toBe(`2 months`);
    });

    it('Return Years difference between match history Date and the current datetime when diff more than 12 months', () => {
        const today = new Date('2026-09-08T18:00:00Z');
        const matchHistoryDate = new Date('2025-09-07T15:00:00Z');
        
        const result = DateFormatter.matchHistoryDateDiff(matchHistoryDate, today);
        expect(result).toBe(`1 year`);
    });

     it('Return Years difference between match history Date and the current datetime when diff more than 12 months', () => {
        const today = new Date('2026-09-08T18:00:00Z');
        const matchHistoryDate = new Date('2022-09-07T15:00:00Z');
        
        const result = DateFormatter.matchHistoryDateDiff(matchHistoryDate, today);
        expect(result).toBe(`4 years`);
    });
})