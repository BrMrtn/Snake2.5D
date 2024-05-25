export default class Leaderboard {
    constructor() {
        this.players = [];
    }

    addPlayer(newEntry) { //{name: "name", score: 0}
        // Only push if the name is not in the leaderboard or if the corresponding score is higher
        let idx = this.players.findIndex(entry => entry.name === newEntry.name);
        if (idx === -1) {
            this.players.push(newEntry);
        } else {
            this.players[idx].score = newEntry.score;
        }
        
        // Sort descending
        this.players.sort((a, b) => b.score - a.score);
    }

    getPlayers() {
        return this.players;
    }

    readPlayers() {
        let data = localStorage.getItem('leaderboard');
        if (data) {
            this.players = JSON.parse(data);
        }
    }

    writePlayers() {
        localStorage.setItem('leaderboard', JSON.stringify(this.players));
    }
}