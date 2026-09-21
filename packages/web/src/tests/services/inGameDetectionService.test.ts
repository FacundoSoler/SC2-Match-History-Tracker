import { describe, it, expect } from "vitest";
import { getMostPlayedRace, getOpponentCharacterId, getOpponentName, getOpponentRace } from "../../services/inGameDetectionService";
import { ref } from "vue";

describe('inGameDetectionService', () => {
    describe('getOpponentName', () => {
        it('Retrieve opponent name if player tag is player 1', () => {
            const playerTag = 'Artanis';
            const mockedData = ref<any>({
                "isReplay": true,
                "displayTime": 211.0,
                "players": [
                    {
                        "id": 1,
                        "name": "Artanis",
                        "type": "user",
                        "race": "Terr",
                        "result": "Undecided"
                    },
                    {
                        "id": 2,
                        "name": "PaN",
                        "type": "user",
                        "race": "Prot",
                        "result": "Undecided"
                    }
                ]
            });

            const result = getOpponentName(mockedData.value, playerTag);
            const expected = 'PaN';
            expect(result).toBe(expected);
        });

        it('Retrieve opponent name if player tag is player 2', () => {
            const playerTag = 'Artanis';
            const mockedData = ref<any>({
                "isReplay": true,
                "displayTime": 211.0,
                "players": [
                    {
                        "id": 1,
                        "name": "PaN",
                        "type": "user",
                        "race": "Prot",
                        "result": "Undecided"
                    },
                    {
                        "id": 2,
                        "name": "Artanis",
                        "type": "user",
                        "race": "Terr",
                        "result": "Undecided"
                    }
                ]
            });

            const result = getOpponentName(mockedData.value, playerTag);
            const expected = 'PaN';
            expect(result).toBe(expected);
        });
    });

    describe('getOpponentRace', () => {
        it('Retrieve opponent race Protoss', () => {
            const playerTag = 'Artanis';
            const mockedData = ref<any>({
                "isReplay": true,
                "displayTime": 211.0,
                "players": [
                    {
                        "id": 1,
                        "name": "PaN",
                        "type": "user",
                        "race": "Prot",
                        "result": "Undecided"
                    },
                    {
                        "id": 2,
                        "name": "Artanis",
                        "type": "user",
                        "race": "Terr",
                        "result": "Undecided"
                    }
                ]
            });

            const result = getOpponentRace(mockedData.value, playerTag);
            expect(result).toBe('PROTOSS');
        });

        it('Retrieve opponent race Terran', () => {
            const playerTag = 'Artanis';
            const mockedData = ref<any>({
                "isReplay": true,
                "displayTime": 211.0,
                "players": [
                    {
                        "id": 1,
                        "name": "PaN",
                        "type": "user",
                        "race": "Terr",
                        "result": "Undecided"
                    },
                    {
                        "id": 2,
                        "name": "Artanis",
                        "type": "user",
                        "race": "Terr",
                        "result": "Undecided"
                    }
                ]
            });

            const result = getOpponentRace(mockedData.value, playerTag);
            expect(result).toBe('TERRAN');
        });

        it('Retrieve opponent race Zerg', () => {
            const playerTag = 'Artanis';
            const mockedData = ref<any>({
                "isReplay": true,
                "displayTime": 211.0,
                "players": [
                    {
                        "id": 1,
                        "name": "PaN",
                        "type": "user",
                        "race": "Zerg",
                        "result": "Undecided"
                    },
                    {
                        "id": 2,
                        "name": "Artanis",
                        "type": "user",
                        "race": "Terr",
                        "result": "Undecided"
                    }
                ]
            });

            const result = getOpponentRace(mockedData.value, playerTag);
            expect(result).toBe('ZERG');
        });

        it('Retrieve opponent race Protoss', () => {
            const playerTag = 'Artanis';
            const mockedData = ref<any>({
                "isReplay": true,
                "displayTime": 211.0,
                "players": [
                    {
                        "id": 1,
                        "name": "PaN",
                        "type": "user",
                        "race": "Rand",
                        "result": "Undecided"
                    },
                    {
                        "id": 2,
                        "name": "Artanis",
                        "type": "user",
                        "race": "Terr",
                        "result": "Undecided"
                    }
                ]
            });

            const result = getOpponentRace(mockedData.value, playerTag);
            expect(result).toBe('RANDOM');
        });
    });

    describe('getMostPlayedRace', () => {
        it('Retrieves most played Race', () => {
            const mockData = {
                "leagueMax": 5,
                "ratingMax": 4529,
                "totalGamesPlayed": 3407,
                "previousStats": {
                    "rating": null,
                    "gamesPlayed": null,
                    "rank": null
                },
                "currentStats": {
                    "rating": null,
                    "gamesPlayed": null,
                    "rank": null
                },
                "members": {
                    "terranGamesPlayed": 1629,
                    "protossGamesPlayed": 72,
                    "zergGamesPlayed": 1177,
                    "randomGamesPlayed": 529,
                    "character": {
                        "realm": 1,
                        "name": "PaN#690",
                        "id": 4147432,
                        "accountId": 4147432,
                        "region": "EU",
                        "battlenetId": 8165224,
                        "tag": "PaN",
                        "discriminator": 690
                    },
                    "account": {
                        "battleTag": "PaN#22991",
                        "id": 4147432,
                        "partition": "GLOBAL",
                        "hidden": null,
                        "tag": "PaN",
                        "discriminator": 22991
                    },
                    "raceGames": {
                        "TERRAN": 1000,
                        "ZERG": 1800,
                        "RANDOM": 529,
                        "PROTOSS": 72
                    }
                }
            };

            const result = getMostPlayedRace(mockData);
            expect(result).toBe('ZERG');
        })
    });

    describe('getOpponentCharacterId', () => {
        it('Retrieves character ID of the most suitable match for the current active user character.', () => {
            const mockData = [
                {
                    "leagueMax": 5,
                    "ratingMax": 3939,
                    "totalGamesPlayed": 30,
                    "previousStats": {
                        "rating": null,
                        "gamesPlayed": null,
                        "rank": null
                    },
                    "currentStats": {
                        "rating": 3206,
                        "gamesPlayed": 5,
                        "rank": 22678
                    },
                    "members": {
                        "terranGamesPlayed": 24,
                        "protossGamesPlayed": 6,
                        "character": {
                            "name": "Nãonãonãonão#583",
                            "id": 3018721,
                            "region": "EU",
                            "tag": "PaN",
                        },
                        "raceGames": {
                            "TERRAN": 24,
                            "PROTOSS": 6
                        }
                    }
                },
                {
                    "leagueMax": 5,
                    "ratingMax": 4640,
                    "totalGamesPlayed": 325,
                    "previousStats": {
                        "rating": null,
                        "gamesPlayed": null,
                        "rank": null
                    },
                    "currentStats": {
                        "rating": 3000,
                        "gamesPlayed": 6,
                        "rank": 31510
                    },
                    "members": {
                        "character": {
                            "name": "PaN#833",
                            "id": 2822074,
                            "region": "US",
                            "tag": "Pan",
                        },
                        "raceGames": {
                            "TERRAN": 292,
                            "PROTOSS": 350,
                            "ZERG": 12,
                            "RANDOM": 6
                        }
                    }
                },
                {
                    "leagueMax": 0,
                    "ratingMax": 3500,
                    "totalGamesPlayed": 20,
                    "previousStats": {
                        "rating": null,
                        "gamesPlayed": null,
                        "rank": null
                    },
                    "currentStats": {
                       "rating": 3100,
                        "gamesPlayed": 7,
                        "rank": 118712
                    },
                    "members": {
                        "character": {
                            "name": "nico#1992",
                            "id": 341379991,
                            "region": "US",
                            "tag": "PaN",
                        },
                        "raceGames": {
                            "PROTOSS": 10
                        }
                    }
                },
                {
                    "leagueMax": 5,
                    "ratingMax": 4529,
                    "totalGamesPlayed": 3407,
                    "previousStats": {
                        "rating": null,
                        "gamesPlayed": null,
                        "rank": null
                    },
                    "currentStats": {
                        "rating": 3050,
                        "gamesPlayed": 30,
                        "rank": 432432
                    },
                    "members": {
                        "character": {
                            "name": "PaN#690",
                            "id": 667,
                            "region": "US",
                            "tag": "PaN",
                        },
                        "raceGames": {
                            "TERRAN": 1629,
                            "ZERG": 1177,
                            "RANDOM": 529,
                            "PROTOSS": 2000
                        }
                    }
                },
                 {
                    "leagueMax": 5,
                    "ratingMax": 4529,
                    "totalGamesPlayed": 3407,
                    "previousStats": {
                        "rating": 3050,
                        "gamesPlayed": 4000,
                        "rank": 432423
                    },
                    "currentStats": {
                        "rating": null,
                        "gamesPlayed": null,
                        "rank": null
                    },
                    "members": {
                        "character": {
                            "name": "PaN#690",
                            "id": 4147432,
                            "region": "US",
                            "tag": "PaN",
                        },
                        "raceGames": {
                            "TERRAN": 1629,
                            "ZERG": 1177,
                            "RANDOM": 529,
                            "PROTOSS": 3000
                        }
                    }
                }
            ];

            const playerRegion = 'US';
            const playerRating = 3000;
            const opponentTag = 'PaN';
            const opponentRace = 'PROTOSS';

            const result = getOpponentCharacterId(mockData, opponentTag, opponentRace, playerRegion, playerRating);
            expect(result).toBe(667);
        });
    })
});