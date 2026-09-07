export interface RaceGames {
    PROTOSS: number;
    TERRAN: number;
    ZERG: number;
    RANDOM: number;
}

export function getRaceIconLink(raceGames: RaceGames) {
    const mapRaceGames = {
        PROTOSS: raceGames.PROTOSS ?? 0,
        TERRAN: raceGames.TERRAN ?? 0,
        ZERG: raceGames.ZERG ?? 0,
        RANDOM: raceGames.RANDOM ?? 0
    };

    const sortedRaceGames = Object.entries(mapRaceGames)
        .map(([race, games]) => ({ race, games }))
        .sort((a, b) => b.games - a.games);

    const mostPlayedRace = sortedRaceGames[0].race;

    if (mostPlayedRace === 'TERRAN') return '/assets/terran.svg';
    if (mostPlayedRace === 'ZERG') return '/assets/zerg.svg';
    if (mostPlayedRace === 'PROTOSS') return '/assets/protoss.svg';
    if (mostPlayedRace === 'RANDOM') return '/assets/random.svg';
}