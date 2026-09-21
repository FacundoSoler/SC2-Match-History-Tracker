import { ICharacterDetails } from "../models/ICharacterDetails";
import { parsePulseMatches } from "../parsePulseMatches";

export function showMMRchange(variation: number) {
    if (variation === null || variation === undefined) return '';

    let MMRvariationString = variation.toString();
    if (variation > 0) MMRvariationString = `+${MMRvariationString}`;

    return `( ${MMRvariationString} )`;
}

export function displayPlayerName(player: any) {
    if (!player || !player.name) return '-- Unkown player --';

    let fullPlayerName = player.name;

    if (player.ratingChange) {
        fullPlayerName = `${fullPlayerName} ${showMMRchange(player.ratingChange)}`;
    }

    return fullPlayerName;
}

export function getLeagueIcon(leagueMax: number) {
    if (leagueMax === 0) return "/assets/league_bronze.svg";
    if (leagueMax === 1) return "/assets/league_silver.svg";
    if (leagueMax === 2) return "/assets/league_gold.svg";
    if (leagueMax === 3) return "/assets/league_platinum.svg";
    if (leagueMax === 4) return "/assets/league_diamond.svg";
    if (leagueMax === 5) return "/assets/league_master.svg";
    if (leagueMax === 6) return "/assets/league_grandmaster.svg";
}

export function getRaceIcon(race: string | null | undefined) {
    if (race?.toUpperCase() === "TERRAN") return "/assets/terran.svg";
    if (race?.toUpperCase() === "PROTOSS") return "/assets/protoss.svg";
    if (race?.toUpperCase() === "ZERG") return "/assets/zerg.svg";
    return "/assets/random.svg";
}

export function getCharacterMatches(rawMatchesData: any, characterDetails: ICharacterDetails, characterId: number) {
    const parsedData = parsePulseMatches(rawMatchesData, { focalName: characterDetails.name });

    const matches = parsedData.matches.map((match: any) => {
        const sortedMatch = {
            ...match,
            players: [...match.players].sort((a, b) => 
                getPlayerScore(b, characterDetails.name, characterId) - getPlayerScore(a, characterDetails.name, characterId))
        };

        if (!sortedMatch.players[0]?.name && sortedMatch.players[0]?.characterId) {
            const characterName = characterDetails.proNickname ? characterDetails.proNickname : characterDetails.tag;
            console.debug('Testing CharacterDetails', characterDetails);
            sortedMatch.players[0].characterName = characterName;
            sortedMatch.players[0].name = characterName;
        }

        return sortedMatch;
    });

    const characterMatches = {
        matches: matches,
        winsVsRace: parsedData.winsVsRace
    };

    console.log('winsVSRAce', parsedData.winsVsRace);

    return characterMatches;
}

const getPlayerScore = (player: any, characterName: string, characterID: number) => {
    if (!player) return 1; // Inferred match (null player object)

    // 1. Exact displayName player match
    const isExactMatch = player.displayName === characterName;
    const isExactIDMatch = player.characterId === characterID;
    if (isExactMatch || isExactIDMatch) return 2;

    // 2. Inferred match (all name fields are null/empty)
    const isUnknown = !player.displayName;
    if (isUnknown) return 1;

    // 3. Known opponent
    return 0;
};

export function setOutcome(match: any, characterDetails: ICharacterDetails) {
    const characterName = characterDetails.proNickname ? characterDetails.proNickname : characterDetails.tag;

    if (match.players[0]?.name === characterName) {
        const mmrChange = showMMRchange(match.players[0]?.ratingChange);
        if (mmrChange) {
            return match.players[0]?.decision + ` (` + showMMRchange(match.players[0]?.ratingChange) + ')';
        }

        return match.players[0]?.decision;
    }
}

export function getOutcomeCSSClass(match: any, characterDetails: ICharacterDetails) {
    const characterName = characterDetails.proNickname ? characterDetails.proNickname : characterDetails.tag;

    if (match.players[0]?.name === characterName && match.players[0].decision === 'WIN') {
        return 'matchWon';
    }

    if (match.players[0]?.name === characterName && match.players[0].decision === 'LOSS') {
        return 'matchLost';
    }

    return '';
}

