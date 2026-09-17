import { describe, it, expect } from 'vitest';
import { displayPlayerName, getCharacterMatches, getOutcomeCSSClass, setOutcome, showMMRchange } from '../../utils/formatter';
import { ICharacterDetails } from '../../models/ICharacterDetails';

describe('formatter', () => {
    describe('displayPlayerName', () => {
        it('displayPlayerName returns "Unknown player" if player details are not present', () => {
            const player = {};

            const result = displayPlayerName(player);
            expect(result).toBe('-- Unkown player --');
        });

        it('displayPlayerName returns "Unknown player" if player name is not valid', () => {
            const player = {
                name: '',
                ratingChange: -20
            };

            const result = displayPlayerName(player);
            expect(result).toBe('-- Unkown player --');
        });

        it('displayPlayerName returns player name and mmr variation (negative variation use case)', () => {
            const player = {
                name: 'TestPlayer',
                ratingChange: -20
            };

            const result = displayPlayerName(player);
            expect(result).toBe('TestPlayer ( -20 )');
        });

        it('displayPlayerName returns player name and mmr variation (positive variation use case)', () => {
            const player = {
                name: 'TestPlayer',
                ratingChange: +20
            };

            const result = displayPlayerName(player);
            expect(result).toBe('TestPlayer ( +20 )');
        });
    })

    describe('showMMRchange', () => {
        it('formats negative variations correctly', () => {
            const result = showMMRchange(-20);
            expect(result).toBe('( -20 )');
        });

        it('formats positive variations with a plus sign', () => {
            const result = showMMRchange(20);
            expect(result).toBe('( +20 )');
        });
    });

    describe('getSortedMatches', () => {
        it(`Sorts character as Player 1 when its name is null (but characterId is present and matches our characterId) 
            and the opponent's name is valid`, () => {
            const matchesMockedData = {
                "matchId": 627922866,
                "datetime": "2026-08-09T09:06:18Z",
                "region": "US",
                "type": "_1V1",
                "map": "Sanctuary III LE",
                "mapId": 55371,
                "durationSeconds": 3941,
                "duration": "65:41",
                "players": [
                    {
                        "name": "esthetique",
                        "displayName": "esthetique#164",
                        "battleTag": "gaschem#2379",
                        "characterName": "esthetique#164",
                        "characterId": 9507322,
                        "battlenetId": 5289452,
                        "toon": "1-S2-1-5289452",
                        "race": "Zerg",
                        "mmr": 4529,
                        "mmrCurrent": 4468,
                        "mmrAtMatch": 4529,
                        "ratingChange": 24,
                        "decision": "WIN",
                        "record": {
                            "wins": 196,
                            "losses": 215,
                            "games": 411,
                            "percent": 47.7,
                            "text": "47.7% (196-215)"
                        },
                        "clan": null,
                        "proNickname": null
                    },
                    {
                        "name": null,
                        "displayName": null,
                        "battleTag": null,
                        "characterName": null,
                        "characterId": 2179926,
                        "battlenetId": null,
                        "toon": null,
                        "race": "Random",
                        "mmr": null,
                        "mmrCurrent": null,
                        "mmrAtMatch": null,
                        "ratingChange": null,
                        "decision": "LOSS",
                        "record": null,
                        "clan": null,
                        "proNickname": null
                    }
                ]
            };

            const characterDetails = {
                battleTag: 'Berry#12296',
                name: 'BerryCrnch#465',
                region: 'US',
                tag: 'Berry',
                proNickname: 'BerryCrunch'
            } as ICharacterDetails;

            const characterId = 2179926;
            const result = getCharacterMatches(matchesMockedData, characterDetails, characterId);

            expect(result.matches[0].players[0].displayName).toBe(null);
        });

        it(`Pro Player - Sorts character as player 1 when match player data is not found but character ID 
                coincides with Character Details`, () => {
            const mockedMatchesData = {
                result: [
                    {
                        "match": {
                            "date": "2026-08-09T09:06:18Z",
                            "type": "_1V1",
                            "id": 627922866,
                            "mapId": 55371,
                            "region": "US",
                            "updated": "2026-08-29T02:07:30.320765Z",
                            "duration": 3941
                        },
                        "map": {
                            "id": 55371,
                            "name": "Sanctuary III LE"
                        },
                        "participants": [
                            {
                                "participant": {
                                    "matchId": 627922866,
                                    "playerCharacterId": 9507322,
                                    "teamId": 275210803,
                                    "teamStateDateTime": "2026-08-09T09:09:49.334855Z",
                                    "decision": "WIN",
                                    "ratingChange": 24
                                },
                                "team": {
                                    "rating": 4468,
                                    "wins": 196,
                                    "losses": 215,
                                    "ties": 0,
                                    "id": 275210803,
                                    "legacyId": "1.5289452.3",
                                    "divisionId": 2844028,
                                    "season": 68,
                                    "region": "US",
                                    "league": {
                                        "type": 5,
                                        "queueType": 201,
                                        "teamType": 0
                                    },
                                    "tierType": 1,
                                    "globalRank": 2819,
                                    "regionRank": 961,
                                    "leagueRank": 736,
                                    "lastPlayed": "2026-08-31T16:13:21Z",
                                    "joined": "2026-08-29T00:59:32Z",
                                    "primaryDataUpdated": "2026-08-31T16:16:04.230746Z",
                                    "members": [
                                        {
                                            "zergGamesPlayed": 411,
                                            "character": {
                                                "realm": 1,
                                                "name": "esthetique#164",
                                                "id": 9507322,
                                                "accountId": 174999,
                                                "region": "US",
                                                "battlenetId": 5289452,
                                                "tag": "esthetique",
                                                "discriminator": 164
                                            },
                                            "account": {
                                                "battleTag": "gaschem#2379",
                                                "id": 174999,
                                                "partition": "GLOBAL",
                                                "hidden": null,
                                                "tag": "gaschem",
                                                "discriminator": 2379
                                            },
                                            "raceGames": {
                                                "ZERG": 411
                                            }
                                        }
                                    ],
                                    "globalTeamCount": 63401,
                                    "regionTeamCount": 30309,
                                    "leagueTeamCount": 1391,
                                    "queueType": 201,
                                    "teamType": 0,
                                    "leagueType": 5,
                                    "legacyUid": "201-0-1-1.5289452.3"
                                },
                                "teamState": {
                                    "teamState": {
                                        "teamId": 275210803,
                                        "dateTime": "2026-08-09T09:09:49.334855Z",
                                        "divisionId": null,
                                        "wins": 76,
                                        "games": 163,
                                        "rating": 4529,
                                        "globalRank": 1777,
                                        "regionRank": 601,
                                        "leagueRank": 388,
                                        "secondary": null
                                    },
                                    "race": null,
                                    "league": {
                                        "type": 5,
                                        "queueType": 201,
                                        "teamType": 0,
                                        "id": null,
                                        "seasonId": null
                                    },
                                    "tier": 1,
                                    "season": 68,
                                    "globalTeamCount": 63401,
                                    "regionTeamCount": 30309,
                                    "leagueTeamCount": 1391
                                },
                                "twitchVodUrl": null,
                                "subOnlyTwitchVod": null
                            },
                            {
                                "participant": {
                                    "matchId": 627922866,
                                    "playerCharacterId": 2179926,
                                    "teamId": null,
                                    "teamStateDateTime": null,
                                    "decision": "LOSS",
                                    "ratingChange": null
                                },
                                "team": null,
                                "teamState": null,
                                "twitchVodUrl": null,
                                "subOnlyTwitchVod": null
                            }
                        ]
                    }
                ]
            };

            const characterDetails = {
                battleTag: 'Berry#12296',
                name: 'BerryCrnch#465',
                region: 'US',
                tag: 'Berry',
                proNickname: 'BerryCrunch'
            } as ICharacterDetails;

            const sortedMatchesData = getCharacterMatches(mockedMatchesData, characterDetails, 2179926);
            const firstPlayerName = sortedMatchesData.matches[0].players[0].characterName;

            expect(firstPlayerName).toBe('BerryCrunch');
        });

        it(`Standard player - Sorts character as player 1 when match player data is not found but character ID 
                coincides with Character Details`, () => {
            const mockedMatchesData = {
                result: [
                    {
                        "match": {
                            "date": "2026-08-09T09:06:18Z",
                            "type": "_1V1",
                            "id": 627922866,
                            "mapId": 55371,
                            "region": "US",
                            "updated": "2026-08-29T02:07:30.320765Z",
                            "duration": 3941
                        },
                        "map": {
                            "id": 55371,
                            "name": "Sanctuary III LE"
                        },
                        "participants": [
                            {
                                "participant": {
                                    "matchId": 627922866,
                                    "playerCharacterId": 9507322,
                                    "teamId": 275210803,
                                    "teamStateDateTime": "2026-08-09T09:09:49.334855Z",
                                    "decision": "WIN",
                                    "ratingChange": 24
                                },
                                "team": {
                                    "rating": 4468,
                                    "wins": 196,
                                    "losses": 215,
                                    "ties": 0,
                                    "id": 275210803,
                                    "legacyId": "1.5289452.3",
                                    "divisionId": 2844028,
                                    "season": 68,
                                    "region": "US",
                                    "league": {
                                        "type": 5,
                                        "queueType": 201,
                                        "teamType": 0
                                    },
                                    "tierType": 1,
                                    "globalRank": 2819,
                                    "regionRank": 961,
                                    "leagueRank": 736,
                                    "lastPlayed": "2026-08-31T16:13:21Z",
                                    "joined": "2026-08-29T00:59:32Z",
                                    "primaryDataUpdated": "2026-08-31T16:16:04.230746Z",
                                    "members": [
                                        {
                                            "zergGamesPlayed": 411,
                                            "character": {
                                                "realm": 1,
                                                "name": "esthetique#164",
                                                "id": 9507322,
                                                "accountId": 174999,
                                                "region": "US",
                                                "battlenetId": 5289452,
                                                "tag": "esthetique",
                                                "discriminator": 164
                                            },
                                            "account": {
                                                "battleTag": "gaschem#2379",
                                                "id": 174999,
                                                "partition": "GLOBAL",
                                                "hidden": null,
                                                "tag": "gaschem",
                                                "discriminator": 2379
                                            },
                                            "raceGames": {
                                                "ZERG": 411
                                            }
                                        }
                                    ],
                                    "globalTeamCount": 63401,
                                    "regionTeamCount": 30309,
                                    "leagueTeamCount": 1391,
                                    "queueType": 201,
                                    "teamType": 0,
                                    "leagueType": 5,
                                    "legacyUid": "201-0-1-1.5289452.3"
                                },
                                "teamState": {
                                    "teamState": {
                                        "teamId": 275210803,
                                        "dateTime": "2026-08-09T09:09:49.334855Z",
                                        "divisionId": null,
                                        "wins": 76,
                                        "games": 163,
                                        "rating": 4529,
                                        "globalRank": 1777,
                                        "regionRank": 601,
                                        "leagueRank": 388,
                                        "secondary": null
                                    },
                                    "race": null,
                                    "league": {
                                        "type": 5,
                                        "queueType": 201,
                                        "teamType": 0,
                                        "id": null,
                                        "seasonId": null
                                    },
                                    "tier": 1,
                                    "season": 68,
                                    "globalTeamCount": 63401,
                                    "regionTeamCount": 30309,
                                    "leagueTeamCount": 1391
                                },
                                "twitchVodUrl": null,
                                "subOnlyTwitchVod": null
                            },
                            {
                                "participant": {
                                    "matchId": 627922866,
                                    "playerCharacterId": 2179926,
                                    "teamId": null,
                                    "teamStateDateTime": null,
                                    "decision": "LOSS",
                                    "ratingChange": null
                                },
                                "team": null,
                                "teamState": null,
                                "twitchVodUrl": null,
                                "subOnlyTwitchVod": null
                            }
                        ]
                    }
                ]
            };

            const characterDetails = {
                battleTag: 'Berry#12296',
                name: 'BerryCrnch#465',
                region: 'US',
                tag: 'Berry',
                proNickname: null
            } as ICharacterDetails;

            const sortedMatchesData = getCharacterMatches(mockedMatchesData, characterDetails, 2179926);
            const firstPlayerName = sortedMatchesData.matches[0].players[0].characterName;

            expect(firstPlayerName).toBe('Berry');
        });

    });

    describe('setOutcome', () => {
        it('Set outcome as LOSS based on player 1 match Decision', () => {
            const mockData = {
                "matchId": 632575198,
                "datetime": "2026-09-17T02:43:07Z",
                "region": "US",
                "type": "_1V1",
                "map": "Sanctuary III LE",
                "mapId": 55371,
                "durationSeconds": 172,
                "duration": "2:52",
                "players": [
                    {
                        "name": "MVPtcnologic",
                        "displayName": null,
                        "battleTag": null,
                        "characterName": "MVPtcnologic",
                        "characterId": 340978136,
                        "battlenetId": null,
                        "toon": null,
                        "race": "Random",
                        "mmr": null,
                        "mmrCurrent": null,
                        "mmrAtMatch": null,
                        "ratingChange": null,
                        "decision": "WIN",
                        "record": null,
                        "clan": null,
                        "proNickname": null
                    },
                    {
                        "name": "ack",
                        "displayName": "ack#347",
                        "battleTag": "ack5252#1585",
                        "characterName": "ack#347",
                        "characterId": 2047310,
                        "battlenetId": 8718119,
                        "toon": "1-S2-1-8718119",
                        "race": "Protoss",
                        "mmr": 3355,
                        "mmrCurrent": 3347,
                        "mmrAtMatch": 3355,
                        "ratingChange": -42,
                        "decision": "LOSS",
                        "record": {
                            "wins": 13,
                            "losses": 11,
                            "games": 24,
                            "percent": 54.2,
                            "text": "54.2% (13-11)"
                        },
                        "clan": "3sums",
                        "proNickname": null
                    }
                ]
            };

            const characterDetails = {
                name: "MVPtcnologic#898",
                region: "US",
                tag: "MVPtcnologic",
                proNickname: null,
                battleTag: ''
            } as ICharacterDetails;

            const result = setOutcome(mockData, characterDetails);
            expect(result).toBe('WIN');
        });

    });

    describe('getOutcomeCSSClass', () => {
        it('Set outcome CSS as matchWon based on player 1 match Decision', () => {
            const mockData = {
                "matchId": 632575198,
                "datetime": "2026-09-17T02:43:07Z",
                "region": "US",
                "type": "_1V1",
                "map": "Sanctuary III LE",
                "mapId": 55371,
                "durationSeconds": 172,
                "duration": "2:52",
                "players": [
                    {
                        "name": "MVPtcnologic",
                        "displayName": null,
                        "battleTag": null,
                        "characterName": "MVPtcnologic",
                        "characterId": 340978136,
                        "battlenetId": null,
                        "toon": null,
                        "race": "Random",
                        "mmr": null,
                        "mmrCurrent": null,
                        "mmrAtMatch": null,
                        "ratingChange": null,
                        "decision": "WIN",
                        "record": null,
                        "clan": null,
                        "proNickname": null
                    },
                    {
                        "name": "ack",
                        "displayName": "ack#347",
                        "battleTag": "ack5252#1585",
                        "characterName": "ack#347",
                        "characterId": 2047310,
                        "battlenetId": 8718119,
                        "toon": "1-S2-1-8718119",
                        "race": "Protoss",
                        "mmr": 3355,
                        "mmrCurrent": 3347,
                        "mmrAtMatch": 3355,
                        "ratingChange": -42,
                        "decision": "LOSS",
                        "record": {
                            "wins": 13,
                            "losses": 11,
                            "games": 24,
                            "percent": 54.2,
                            "text": "54.2% (13-11)"
                        },
                        "clan": "3sums",
                        "proNickname": null
                    }
                ]
            };

            const characterDetails = {
                name: "MVPtcnologic#898",
                region: "US",
                tag: "MVPtcnologic",
                proNickname: null,
                battleTag: ''
            } as ICharacterDetails;

            const result = getOutcomeCSSClass(mockData, characterDetails);
            expect(result).toBe('matchWon');
        });

        it('Set outcome CSS as matchLost based on player 1 match Decision', () => {
            const mockData = {
                "matchId": 632574361,
                "datetime": "2026-09-17T02:39:32Z",
                "region": "US",
                "type": "_1V1",
                "map": "Rainfall LE",
                "mapId": 55372,
                "durationSeconds": 786,
                "duration": "13:06",
                "players": [
                    {
                        "name": "MVPtcnologic",
                        "displayName": null,
                        "battleTag": null,
                        "characterName": "MVPtcnologic",
                        "characterId": 340978136,
                        "battlenetId": null,
                        "toon": null,
                        "race": "Random",
                        "mmr": null,
                        "mmrCurrent": null,
                        "mmrAtMatch": null,
                        "ratingChange": null,
                        "decision": "LOSS",
                        "record": null,
                        "clan": null,
                        "proNickname": null
                    },
                    {
                        "name": "LunaCaNON",
                        "displayName": "LunaCaNON#496",
                        "battleTag": "JERRY#34841",
                        "characterName": "LunaCaNON#496",
                        "characterId": 320160112,
                        "battlenetId": 11963191,
                        "toon": "1-S2-1-11963191",
                        "race": "Protoss",
                        "mmr": 3302,
                        "mmrCurrent": 3481,
                        "mmrAtMatch": 3302,
                        "ratingChange": 25,
                        "decision": "WIN",
                        "record": {
                            "wins": 439,
                            "losses": 388,
                            "games": 827,
                            "percent": 53.1,
                            "text": "53.1% (439-388)"
                        },
                        "clan": null,
                        "proNickname": null
                    }
                ]
            };

            const characterDetails = {
                name: "MVPtcnologic#898",
                region: "US",
                tag: "MVPtcnologic",
                proNickname: null,
                battleTag: ''
            } as ICharacterDetails;

            const result = getOutcomeCSSClass(mockData, characterDetails);
            expect(result).toBe('matchLost');
        });

        it('PRO Player - Set outcome CSS as matchLost when match Decision is LOSS', () => {
            const mockData = {
                "matchId": 627961102,
                "datetime": "2026-08-09T15:58:39Z",
                "region": "US",
                "type": "_1V1",
                "map": "Washout LE",
                "mapId": 55377,
                "durationSeconds": 1001,
                "duration": "16:41",
                "players": [
                    {
                        "name": "BerryCruncH",
                        "displayName": "throatGOAT#656",
                        "battleTag": "Berry#12296",
                        "characterName": "throatGOAT#656",
                        "characterId": 2179926,
                        "battlenetId": 20087215,
                        "toon": "1-S2-1-20087215",
                        "race": "Protoss",
                        "mmr": 4619,
                        "mmrCurrent": 4619,
                        "mmrAtMatch": 4619,
                        "ratingChange": -9,
                        "decision": "LOSS",
                        "record": {
                            "wins": 38,
                            "losses": 31,
                            "games": 69,
                            "percent": 55.1,
                            "text": "55.1% (38-31)"
                        },
                        "clan": "MANBUN",
                        "proNickname": "BerryCruncH"
                    },
                    {
                        "name": "Bioice",
                        "displayName": "Zulrah#592",
                        "battleTag": "Zulrah#11327",
                        "characterName": "Zulrah#592",
                        "characterId": 1025056,
                        "battlenetId": 8583842,
                        "toon": "1-S2-1-8583842",
                        "race": "Zerg",
                        "mmr": 5149,
                        "mmrCurrent": 4744,
                        "mmrAtMatch": 5149,
                        "ratingChange": 10,
                        "decision": "WIN",
                        "record": {
                            "wins": 226,
                            "losses": 123,
                            "games": 349,
                            "percent": 64.8,
                            "text": "64.8% (226-123)"
                        },
                        "clan": "BUFFW",
                        "proNickname": "Bioice"
                    }
                ]
            };

            const characterDetails = {
                name: "tGOAT#656",
                region: "US",
                tag: "tGOAT",
                proNickname: 'BerryCruncH',
                battleTag: ''
            } as ICharacterDetails;

            const result = getOutcomeCSSClass(mockData, characterDetails);
            expect(result).toBe('matchLost');
        });
    })
})