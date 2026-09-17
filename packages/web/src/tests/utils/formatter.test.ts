import { describe, it, expect } from 'vitest';
import { displayPlayerName, getCharacterMatches, showMMRchange } from '../../utils/formatter';
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
        it('', () => {
            const mockData = {
                "matchId": 631750241,
                "datetime": "2026-09-10T16:38:51Z",
                "region": "US",
                "type": "_1V1",
                "map": "Rorschach LE",
                "mapId": 55378,
                "durationSeconds": 4555,
                "duration": "75:55",
                "players": [
                    {
                        "name": "Test",
                        "displayName": null,
                        "battleTag": null,
                        "characterName": "Test",
                        "characterId": 341417840,
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
                        "name": "ReAdosS",
                        "displayName": "ReAdosS#473",
                        "battleTag": "ReAdosS#1248",
                        "characterName": "ReAdosS#473",
                        "characterId": 35851,
                        "battlenetId": 159230,
                        "toon": "1-S2-2-159230",
                        "race": "Terran",
                        "mmr": 2631,
                        "mmrCurrent": 2605,
                        "mmrAtMatch": 2631,
                        "ratingChange": 22,
                        "decision": "WIN",
                        "record": {
                            "wins": 324,
                            "losses": 306,
                            "games": 630,
                            "percent": 51.4,
                            "text": "51.4% (324-306)"
                        },
                        "clan": "ALQ",
                        "proNickname": null
                    }
                ]
            };


        })
    })
})