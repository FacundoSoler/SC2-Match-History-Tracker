/**
 * Parse SC2 Pulse match-history API response.
 * Usage: parsePulseMatches(apiResponse, { focalName: "ReSpOnSe" })
 */

function normalizeRace(raw) {
  if (raw == null || raw === "") return null;
  const s = String(raw).toUpperCase();
  if (s.startsWith("T") && s !== "TIE") return "Terran";
  if (s.startsWith("P")) return "Protoss";
  if (s.startsWith("Z")) return "Zerg";
  if (s.startsWith("R")) return "Random";
  return null;
}

function raceFromMember(member) {
  if (!member) return null;

  if (member.raceGames && typeof member.raceGames === "object") {
    const played = Object.entries(member.raceGames)
      .map(([race, n]) => [normalizeRace(race), Number(n) || 0])
      .filter(([r, n]) => r && n > 0)
      .sort((a, b) => b[1] - a[1]);
    if (played.length) return played[0][0];
  }

  const counts = [
    ["Terran", member.terranGamesPlayed],
    ["Protoss", member.protossGamesPlayed],
    ["Zerg", member.zergGamesPlayed],
    ["Random", member.randomGamesPlayed],
  ]
    .map(([race, n]) => [race, Number(n) || 0])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);

  return counts.length ? counts[0][0] : null;
}

function playerName(member) {
  if (!member) return null;
  const c = member.character || {};
  const a = member.account || {};
  return (
    member.proNickname ||
    c.tag ||
    (c.name ? String(c.name).split("#")[0] : null) ||
    a.tag ||
    a.battleTag ||
    null
  );
}

function displayName(member) {
  if (!member) return null;
  const c = member.character || {};
  const a = member.account || {};
  return c.name || a.battleTag || member.proNickname || playerName(member);
}

function namesOf(member) {
  if (!member) return [];
  const c = member.character || {};
  const a = member.account || {};
  return [member.proNickname, c.tag, c.name, a.tag, a.battleTag, playerName(member)]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());
}

function namesOfPlayer(p) {
  if (p._names) return p._names;
  return [p.proNickname, p.name, p.displayName, p.characterName, p.battleTag]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());
}

function winPct(wins, losses) {
  const w = Number(wins);
  const l = Number(losses);
  if (!Number.isFinite(w) || !Number.isFinite(l) || w + l <= 0) return null;
  const pct = (w / (w + l)) * 100;
  return {
    wins: w,
    losses: l,
    games: w + l,
    percent: Number(pct.toFixed(1)),
    text: `${pct.toFixed(1)}% (${w}-${l})`,
  };
}

function formatDuration(seconds) {
  if (seconds == null || !Number.isFinite(Number(seconds))) return null;
  const s = Math.max(0, Math.floor(Number(seconds)));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return { seconds: s, text: `${m}:${String(r).padStart(2, "0")}` };
}

function isWin(decision) {
  const d = String(decision || "").toUpperCase();
  return d === "WIN" || d === "VICTORY";
}

function regionToId(region) {
  const map = { US: 1, EU: 2, KR: 3, TW: 3, CN: 5 };
  return map[String(region || "").toUpperCase()] ?? region;
}

function resolveRace(member, p) {
  const fromMember = raceFromMember(member);
  if (fromMember) return fromMember;

  const fromState = normalizeRace(p?.teamState?.race);
  if (fromState) return fromState;

  // Pulse Random is null here, not "RANDOM"
  if (member || p?.participant) return "Random";
  return null;
}

function extractParticipant(p) {
  const member = p?.team?.members?.[0] || null;
  const team = p?.team || {};
  const state = p?.teamState?.teamState || {};
  const part = p?.participant || {};

  const wins = team.wins ?? state.wins ?? null;
  const losses =
    team.losses ??
    (state.games != null && state.wins != null
      ? Number(state.games) - Number(state.wins)
      : null);

  return {
    name: playerName(member),
    displayName: displayName(member),
    battleTag: member?.account?.battleTag || null,
    characterName: member?.character?.name || null,
    characterId: member?.character?.id || part.playerCharacterId || null,
    battlenetId: member?.character?.battlenetId || null,
    toon: member?.character
      ? `${regionToId(member.character.region)}-S2-${member.character.realm}-${member.character.battlenetId}`
      : null,
    race: resolveRace(member, p),
    mmr: state.rating ?? team.rating ?? null,
    mmrCurrent: team.rating ?? null,
    mmrAtMatch: state.rating ?? null,
    ratingChange: part.ratingChange ?? null,
    decision: part.decision || null,
    record: winPct(wins, losses),
    clan: member?.clan?.tag || null,
    proNickname: member?.proNickname || null,
    _names: namesOf(member),
  };
}

function normalizeExistingPlayer(p) {
  return {
    ...p,
    race: p.race || "Random",
    _names: namesOfPlayer(p),
  };
}

function matchesFocal(player, focalName) {
  if (!focalName) return false;
  const needle = String(focalName).toLowerCase();
  return namesOfPlayer(player).some(
    (n) => n === needle || n.startsWith(needle + "#") || n.includes(needle)
  );
}

function emptyVsRace() {
  return {
    Terran: { wins: 0, total: 0, text: "0 / 0" },
    Protoss: { wins: 0, total: 0, text: "0 / 0" },
    Zerg: { wins: 0, total: 0, text: "0 / 0" },
    Random: { wins: 0, total: 0, text: "0 / 0" },
  };
}

function parsePulseMatches(payload, options = {}) {
  const focalName = options.focalName || null;
  const rows = Array.isArray(payload?.result)
    ? payload.result
    : Array.isArray(payload?.matches)
      ? payload.matches
      : Array.isArray(payload)
        ? payload
        : [payload];

  const matches = [];
  const vsRace = emptyVsRace();

  for (const row of rows) {
    let parts;
    if (Array.isArray(row.participants) && row.participants.length) {
      parts = row.participants.map(extractParticipant);
    } else if (Array.isArray(row.players) && row.players.length) {
      parts = row.players.map(normalizeExistingPlayer);
    } else {
      parts = [];
    }

    const meta = row.match || row;
    const map = row.map || {};
    const duration = formatDuration(meta.durationSeconds ?? meta.duration);

    matches.push({
      matchId: meta.matchId || meta.id,
      datetime: meta.datetime || meta.date || null,
      region: meta.region || null,
      type: meta.type || null,
      map: typeof map === "string" ? map : map.name || row.map || null,
      mapId: map.id || meta.mapId || null,
      durationSeconds: duration?.seconds ?? meta.durationSeconds ?? meta.duration ?? null,
      duration: duration?.text ?? row.duration ?? null,
      players: parts.map(({ _names, ...rest }) => rest),
    });

    if (!focalName || parts.length < 2) continue;

    const me = parts.find((p) => matchesFocal(p, focalName));
    const opp = parts.find((p) => p !== me);
    if (!me || !opp) continue;

    const race = opp.race || "Random";
    if (!vsRace[race]) continue;

    vsRace[race].total += 1;
    if (isWin(me.decision)) vsRace[race].wins += 1;
  }

  for (const race of Object.keys(vsRace)) {
    const { wins, total } = vsRace[race];
    vsRace[race].text = `${wins} / ${total}`;
  }

  return {
    matchCount: matches.length,
    focalPlayer: focalName,
    matches,
    winsVsRace: vsRace,
  };
}

export { parsePulseMatches };