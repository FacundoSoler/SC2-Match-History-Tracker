export class WinrateStat {
    wins = 0;
    losses = 0;
    raceGames = {
        race: '',
        games: 0
    }
    winratePercentage = 0;
    winrateText = '';

    constructor(init?: Partial<WinrateStat>) {
        if (init) Object.assign(this, init);

        this.winratePercentage = Math.floor(this.wins / (this.raceGames.games / 100));
        this.winrateText = `${this.winratePercentage} % winrate. WINS: ${this.wins}, LOSSES: ${this.losses}. 
            Total Games : ${this.raceGames.games} `;
    }
}