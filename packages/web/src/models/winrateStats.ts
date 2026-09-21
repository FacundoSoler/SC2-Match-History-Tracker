export class WinrateStats {
    rating = 0;
    leagueType = 0;
    tierType = 0;
    wins = 0;
    losses = 0;
    raceGames = {
        race: '',
        games: 0
    }
    winratePercentage = 0;
    winrateText = '';

    constructor(init?: Partial<WinrateStats>) {
        if (init) Object.assign(this, init);

        this.winratePercentage = Math.floor(this.wins / (this.raceGames.games / 100));
        this.winrateText = `${this.winratePercentage} % winrate. WINS: ${this.wins}, LOSSES: ${this.losses}. 
            Total Games : ${this.raceGames.games} `;
    }
}