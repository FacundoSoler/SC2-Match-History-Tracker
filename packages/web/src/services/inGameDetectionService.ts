import { type Ref } from 'vue';

export function getOpponentName(sc2Data: Ref<any>, playerTag: string) {
    if (!sc2Data.value || !sc2Data.value.players) return;

    const opponentName: string = sc2Data.value.players.filter((x: any) => x.name !== playerTag)[0]?.name;
    return opponentName;
}

export function getOpponentRace(sc2Data: Ref<any>, playerTag: string) {
    if (!sc2Data.value || !sc2Data.value.players) return;

    const opponentRace = sc2Data.value.players.filter((x: any) => x.name !== playerTag)[0]?.race;

    if (opponentRace.includes('Terr')) return 'TERRAN';
    if (opponentRace.includes('Prot')) return 'PROTOSS';
    if (opponentRace.includes('Zerg')) return 'ZERG';

    return 'RANDOM';
}

export function getMostPlayedRace(characterDetails: any) {
    const raceGames = Object.entries(characterDetails.members.raceGames ?? {}).map(([race, games]) => ({
        race,
        games
    }));

    const sortedGames = [...raceGames].sort((a, b) => Number(b.games) - Number(a.games));
    const mostPlayedRace = sortedGames[0]?.race;

    return mostPlayedRace;
}

export function getOpponentCharacterId(characterList: any, opponentTag: string, opponentRace: string, playerRegion: string, playerRating: number) {
    const mappedList = characterList.map((x: any) => {
        const mostPlayedRace = getMostPlayedRace(x);

        return {
            mostPlayedRace: mostPlayedRace ?? null,
            ...x
        };
    });

    const filteredList = mappedList
        .filter((x: any) => x.mostPlayedRace === opponentRace.toUpperCase()
            && x.members.character.tag === opponentTag
            && x.members.character.region === playerRegion);

    // 1. Try active players (currentStats.rating)
    const activePlayers = filteredList.filter(
        (x:any) => typeof x.currentStats?.rating === 'number'
    );

    if (activePlayers.length > 0) {
        activePlayers.sort(
            (a:any, b:any) => Math.abs(a.currentStats.rating - playerRating) - Math.abs(b.currentStats.rating - playerRating)
        );
        return activePlayers[0].members?.character?.id;
    }

    // 2. Fallback: try inactive players with previous stats (previousStats.rating)
    const pastPlayers = filteredList.filter(
        (x:any) => typeof x.previousStats?.rating === 'number'
    );

    if (pastPlayers.length > 0) {
        pastPlayers.sort(
            (a:any, b:any) => Math.abs(a.previousStats.rating - playerRating) - Math.abs(b.previousStats.rating - playerRating)
        );
        return pastPlayers[0].members?.character?.id;
    }

    // 3. Final fallback: pick the first record if neither has ratings set
    return filteredList[0]?.members?.character?.id;
}