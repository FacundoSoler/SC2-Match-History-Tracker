import { describe, it, expect } from 'vitest';
import { displayPlayerName, showMMRchange } from '../../utils/formatter';

describe('formatter', () => {
    describe('displayPlayerName', () => {
        it('displayPlayerName returns "Unknown player" if player details are not present', () => {
            const player = {};

            const result = displayPlayerName(player);
            expect(result).toBe('-- Unkown player --');
        });

        it('displayPlayerName returns "Unknown player" if player name is not valid', () => {
            const player = {
                name: '',
                ratingChange: -20
            };

            const result = displayPlayerName(player);
            expect(result).toBe('-- Unkown player --');
        });

        it('displayPlayerName returns player name and mmr variation (negative variation use case)', () => {
            const player = {
                name: 'TestPlayer',
                ratingChange: -20
            };

            const result = displayPlayerName(player);
            expect(result).toBe('TestPlayer ( -20 )');
        });

        it('displayPlayerName returns player name and mmr variation (positive variation use case)', () => {
            const player = {
                name: 'TestPlayer',
                ratingChange: +20
            };

            const result = displayPlayerName(player);
            expect(result).toBe('TestPlayer ( +20 )');
        });
    })

    describe('showMMRchange', () => {
        it('formats negative variations correctly', () => {
            const result = showMMRchange(-20);
            expect(result).toBe('( -20 )');
        });

        it('formats positive variations with a plus sign', () => {
            const result = showMMRchange(20);
            expect(result).toBe('( +20 )');
        });
    });
})