const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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