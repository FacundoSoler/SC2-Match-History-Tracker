import { describe, it, expect } from 'vitest';
import { getRaceIconLink, RaceGames } from '../../utils/assetsHelper';

describe('LinkFormatter', () => {
    it('setRaceIconLink returns valid most played race icon for Protoss', () =>{
        const arrange = {
            PROTOSS: 750,
            TERRAN: 50,
            ZERG: 600,
            RANDOM: 500
        };

        const result = getRaceIconLink(arrange);
        const expected = '/assets/protoss.svg';

        expect(result).toBe(expected);
    });

    it('setRaceIconLink returns valid most played race icon for Zerg', () =>{
        debugger;
        const arrange: RaceGames = {
            PROTOSS: 750,
            TERRAN: 50,
            ZERG: 900,
            RANDOM: 500
        };

        const result = getRaceIconLink(arrange);
        const expected = '/assets/zerg.svg';

        expect(result).toBe(expected);
    });

    it('setRaceIconLink returns valid most played race icon for Terran', () =>{
        debugger;
        const arrange: RaceGames = {
            PROTOSS: 750,
            TERRAN: 1000,
            ZERG: 900,
            RANDOM: 500
        };

        const result = getRaceIconLink(arrange);
        const expected = '/assets/terran.svg';

        expect(result).toBe(expected);
    });

    it('setRaceIconLink returns valid most played race icon for Random', () =>{
        debugger;
        const arrange: RaceGames = {
            PROTOSS: 750,
            TERRAN: 50,
            ZERG: 900,
            RANDOM: 1200
        };

        const result = getRaceIconLink(arrange);
        const expected = '/assets/random.svg';

        expect(result).toBe(expected);
    });
})