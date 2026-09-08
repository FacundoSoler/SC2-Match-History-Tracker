export function showMMRchange(variation: number) {
    if (variation === null) return '';

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