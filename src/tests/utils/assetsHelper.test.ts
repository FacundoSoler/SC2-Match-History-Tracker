import { describe, it, expect } from 'vitest';
import { getRaceIconLink } from '../../utils/assetsHelper';

describe('LinkFormatter', () => {
    it('setRaceIconLink returns valid most played race icon for Protoss', () =>{
        const arrange = {
            Protoss: 750,
            Terran: 50,
            Zerg: 600,
            Random: 500
        };

        const result = getRaceIconLink(arrange);
        const expected = '/assets/zerg.svg';

        expect(result).toBe(expected);
    });

    it('setRaceIconLink returns valid most played race icon for Zerg', () =>{
        const arrange = {
            Protoss: 750,
            Terran: 50,
            Zerg: 900,
            Random: 500
        };

        const result = getRaceIconLink(arrange);
        const expected = '/assets/terran.svg';

        expect(result).toBe(expected);
    });
})