export function getRaceIconLink(raceGames: any) {
    const mapRaceGames = {
        Protoss: raceGames.PROTOSS ?? 0,
        Terran: raceGames.TERRAN ?? 0,
        Zerg: raceGames.ZERG ?? 0,
        Random: raceGames.RANDOM ?? 0
    };

    const sortedRaceGames = Object.entries(mapRaceGames)
        .map(([race, games]) => ({ race, games }))
        .sort((a, b) => b.games - a.games);

    const mostPlayedRace = sortedRaceGames[0].race;

    if (mostPlayedRace === 'Terran') return '/assets/terran.svg';
    if (mostPlayedRace === 'Zerg') return '/assets/zerg.svg';
    if (mostPlayedRace === 'Protoss') return '/assets/protoss.svg';
    if (mostPlayedRace === 'Random') return '/assets/random.svg';
}