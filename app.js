'use strict';

/* ======================================================================
   DESIGN TOKENS
====================================================================== */
const T = {
  bg: '#0B0E12', panel: '#12161B', panelAlt: '#181D24',
  border: '#232A33', borderStrong: '#2E3742',
  text: '#E7ECF0', textDim: '#8B96A3', textFaint: '#5C6673',
  accent: '#4CC9F0', accentSoft: 'rgba(76,201,240,0.14)',
  good: '#FFB020', goodSoft: 'rgba(255,176,32,0.14)',
  bad: '#FB5B62', badSoft: 'rgba(251,91,98,0.14)',
};

const TIERS = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'];
const TIER_COLORS = {
  Iron: '#6B7280', Bronze: '#B08D57', Silver: '#B9C2CC', Gold: '#E8B923',
  Platinum: '#3FC7C0', Diamond: '#B98CE8', Ascendant: '#3ED17E',
  Immortal: '#E14C82', Radiant: '#F0D98C',
};

/* ======================================================================
   VOLTAIC AIM BENCHMARK SCENARIOS (Season 1, "Hard" track)
   thresholds are the Radiant/Elysian/Aurora/Angelic rank cutoffs shown on
   app.voltaic.gg — used only to normalize each scenario onto a comparable
   0-100 scale so scores can be averaged across scenarios of wildly
   different magnitude (e.g. VT MiniTS ~115 vs VT Widereflex ~7650).
====================================================================== */
const SCENARIOS = [
  { id: 'floatshot',        category: 'Flick-Tech', sub: 'Dynamic', name: 'VT Floatshot',           thresholds: { radiant: 950,  elysian: 1050, aurora: 1150, angelic: 1250 } },
  { id: 'angleshot',        category: 'Flick-Tech', sub: 'Dynamic', name: 'VT Angleshot',           thresholds: { radiant: 900,  elysian: 1050, aurora: 1200, angelic: 1300 } },
  { id: 'adjustshot',       category: 'Flick-Tech', sub: 'Dynamic', name: 'VT Adjustshot',          thresholds: { radiant: 950,  elysian: 1050, aurora: 1150, angelic: 1250 } },
  { id: 'miniphase',        category: 'Flick-Tech', sub: 'Core',    name: 'VT Miniphase',           thresholds: { radiant: 1300, elysian: 1400, aurora: 1600, angelic: 1700 } },
  { id: 'fourshot',         category: 'Flick-Tech', sub: 'Core',    name: 'VT Fourshot Adaptive',   thresholds: { radiant: 1300, elysian: 1375, aurora: 1475, angelic: 1575 } },
  { id: 'dotts',            category: 'Flick-Tech', sub: 'Core',    name: 'VT DotTS',               thresholds: { radiant: 2650, elysian: 2800, aurora: 3000, angelic: 3200 } },
  { id: '1w1t',             category: 'Flick-Tech', sub: 'Reflex',  name: 'VT 1w1t',                thresholds: { radiant: 7250, elysian: 7700, aurora: 8150, angelic: 8600 } },
  { id: 'widereflex',       category: 'Flick-Tech', sub: 'Reflex',  name: 'VT Widereflex',          thresholds: { radiant: 7100, elysian: 7650, aurora: 8200, angelic: 8750 } },
  { id: 'microshot',        category: 'Micros',     sub: 'Evasive', name: 'VT Microshot',           thresholds: { radiant: 850,  elysian: 1050, aurora: 1250, angelic: 1450 } },
  { id: 'angleshot_micro',  category: 'Micros',     sub: 'Evasive', name: 'VT Angleshot Micro',     thresholds: { radiant: 1325, elysian: 1475, aurora: 1625, angelic: 1725 } },
  { id: 'skyclick_multi',   category: 'Micros',     sub: 'Evasive', name: 'VT Skyclick Multi',      thresholds: { radiant: 1125, elysian: 1225, aurora: 1325, angelic: 1425 } },
  { id: 'angelic_click',    category: 'Micros',     sub: 'Core',    name: 'VT Angelic Click',       thresholds: { radiant: 130,  elysian: 145,  aurora: 165,  angelic: 185 } },
  { id: 'minits',           category: 'Micros',     sub: 'Core',    name: 'VT MiniTS',               thresholds: { radiant: 115,  elysian: 125,  aurora: 135,  angelic: 145 } },
  { id: 'micro2sphere',     category: 'Micros',     sub: 'Core',    name: 'VT Micro 2 Sphere',      thresholds: { radiant: 1500, elysian: 1650, aurora: 1800, angelic: 1950 } },
  { id: 'microcluster',     category: 'Micros',     sub: 'Reflex',  name: 'VT Microcluster',        thresholds: { radiant: 1200, elysian: 1300, aurora: 1400, angelic: 1500 } },
  { id: 'peekshot',         category: 'Micros',     sub: 'Reflex',  name: 'VT Peekshot',             thresholds: { radiant: 4800, elysian: 5300, aurora: 5800, angelic: 6300 } },
  { id: 'micropace',        category: 'Micros',     sub: 'Reflex',  name: 'VT Micropace',            thresholds: { radiant: 1250, elysian: 1300, aurora: 1350, angelic: 1400 } },
  { id: 'controlstrafes',   category: 'Stability',  sub: 'Strafe',  name: 'VT Controlstrafes',      thresholds: { radiant: 5100, elysian: 5500, aurora: 5900, angelic: 6300 } },
  { id: 'peektrack',        category: 'Stability',  sub: 'Strafe',  name: 'VT Peektrack',            thresholds: { radiant: 2750, elysian: 2900, aurora: 3050, angelic: 3200 } },
  { id: 'angle_track',      category: 'Stability',  sub: 'Precise', name: 'VT Angle Track',          thresholds: { radiant: 3925, elysian: 4150, aurora: 4375, angelic: 4600 } },
  { id: 'adjust_track',     category: 'Stability',  sub: 'Precise', name: 'VT Adjust Track',         thresholds: { radiant: 2600, elysian: 2800, aurora: 3000, angelic: 3200 } },
];
const SCENARIO_MAP = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]));
const AIM_CATEGORIES = ['Flick-Tech', 'Micros', 'Stability'];

/* ======================================================================
   STORAGE (plain localStorage — this runs outside Claude, no window.storage)
====================================================================== */
const LS_MATCHES = 'vir_ranked_matches';
const LS_DM = 'vir_dm_sessions';
const LS_AIM = 'vir_aim_scores';

function loadJSON(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch (e) { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { return false; }
}

/* ======================================================================
   RANK MATH
====================================================================== */
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function rankToSkill(tierIdx, subtier, rr) {
  if (TIERS[tierIdx] === 'Radiant') return 24 * 100 + (rr || 0);
  return (tierIdx * 3 + (subtier - 1)) * 100 + (rr || 0);
}
function skillToRank(skill) {
  skill = Math.max(0, skill);
  const pos = Math.floor(skill / 100);
  if (pos >= 24) return { tier: 'Radiant', subtier: null, rr: Math.round(skill - 2400) };
  const tierIdx = Math.min(7, Math.floor(pos / 3));
  const subtier = (pos % 3) + 1;
  const rr = Math.round(skill % 100);
  return { tier: TIERS[tierIdx], subtier, rr };
}
function rankLabel(r) {
  if (!r) return '—';
  if (r.tier === 'Radiant') return `Radiant (${r.rr >= 0 ? '+' : ''}${r.rr} RR)`;
  return `${r.tier} ${r.subtier} · ${r.rr} RR`;
}

/* ======================================================================
   STATS HELPERS
====================================================================== */
function mean(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = mean(xs), my = mean(ys);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  return den === 0 ? 0 : num / den;
}

function causalEwma(series, field, idx, halfLifeDays) {
  let wSum = 0, vSum = 0;
  const refTs = series[idx].ts;
  for (let j = 0; j <= idx; j++) {
    const ageDays = (refTs - series[j].ts) / 86400000;
    if (ageDays < -0.001) continue;
    const w = Math.pow(0.5, Math.max(0, ageDays) / halfLifeDays);
    wSum += w; vSum += w * series[j][field];
  }
  return wSum > 0 ? vSum / wSum : series[idx][field];
}

function ewmaAsOfNow(series, field, halfLifeDays, now) {
  let wSum = 0, vSum = 0;
  for (const m of series) {
    const ageDays = (now - m.ts) / 86400000;
    if (ageDays < 0) continue;
    const w = Math.pow(0.5, ageDays / halfLifeDays);
    wSum += w; vSum += w * m[field];
  }
  return { value: wSum > 0 ? vSum / wSum : null, effN: wSum };
}

function confidenceLabel(effN) {
  if (effN < 5) return { label: 'Insufficient', color: T.textFaint };
  if (effN < 10) return { label: 'Low', color: T.bad };
  if (effN < 20) return { label: 'Moderate', color: T.good };
  return { label: 'High', color: T.accent };
}

function trendArrow(recent, baseline, threshold) {
  if (recent == null || baseline == null) return '→';
  const d = recent - baseline;
  if (d > threshold) return '↑';
  if (d < -threshold) return '↓';
  return '→';
}

/* ======================================================================
   INDIVIDUAL PERFORMANCE SCORE — Tracker Score + ACS + KD, blended
   (0-100 sub-normalizations, weighted so they don't double-count)
====================================================================== */
function normTP(trackerScore) { return clamp(trackerScore / 10, 0, 100); }
// median ACS across ranks sits ~207-216 in practice; 210 -> 50 baseline
function normACS(acs) { return clamp(50 + (acs - 210) / 2, 0, 100); }
// KD 1.0 (breakeven) -> 50 baseline
function normKD(kd) { return clamp(50 + (kd - 1.0) * 100, 0, 100); }
// Tracker Score is already a broad composite (largely overlaps with ACS),
// so it keeps the largest weight; ACS adds independent damage/impact
// signal; KD gets the smallest weight since it's the coarsest of the three.
function combineIPS(tp, acsPerf, kdPerf) { return 0.55 * tp + 0.25 * acsPerf + 0.20 * kdPerf; }

/* ======================================================================
   CORE DERIVATION — raw ranked matches -> full causal derived series
====================================================================== */
function deriveSeries(raw) {
  const sorted = [...raw].sort((a, b) => a.ts - b.ts);
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    const m = sorted[i];
    const mySkill = rankToSkill(m.myTier, m.mySub, m.myRR);
    const lobbySkill = rankToSkill(m.lobbyTier, m.lobbySub, 50);
    const diffTiers = (lobbySkill - mySkill) / 300;
    const tp = normTP(m.trackerScore);
    const acsPerf = normACS(m.acs);
    const kdPerf = normKD(m.kd);
    const ips = combineIPS(tp, acsPerf, kdPerf);
    const mod = 1 + 0.6 * Math.tanh(diffTiers / 1.5);
    const cpInstant = ips * mod;

    out.push({ ...m, mySkill, lobbySkill, diffTiers, tp, acsPerf, kdPerf, ips, mod, cpInstant });

    out[i].cpRolling = causalEwma(out, 'cpInstant', i, 10);
    out[i].parRaw = out[i].cpRolling - 50;

    const start = Math.max(0, i - 9);
    const windowArr = out.slice(start, i + 1);
    if (windowArr.length >= 3) {
      const xs = windowArr.map((w) => w.ts / 86400000);
      const ys = windowArr.map((w) => w.cpInstant);
      const slope = olsSlope(xs, ys);
      out[i].trendSlope = slope;
      out[i].trendScore = 50 + clamp(slope * 20, -50, 50);
    } else {
      out[i].trendSlope = null;
      out[i].trendScore = 50;
    }

    out[i].gameIR = 0.5 * cpInstant + 0.3 * out[i].cpRolling + 0.2 * out[i].trendScore;
    out[i].irShortSeries = causalEwma(out, 'gameIR', i, 3);
  }
  return out;
}

function computeAggregates(series, now) {
  if (series.length === 0) return null;

  const irShort = ewmaAsOfNow(series, 'gameIR', 3, now);
  const irMed = ewmaAsOfNow(series, 'gameIR', 10, now);
  const irLong = ewmaAsOfNow(series, 'gameIR', 45, now);
  const parLong = ewmaAsOfNow(series, 'parRaw', 45, now);

  const latest = series[series.length - 1];
  const currentRank = skillToRank(latest.mySkill);
  const estDeltaTiers = parLong.value != null ? parLong.value / 20 : 0;
  const estSkill = latest.mySkill + estDeltaTiers * 300;
  const estRank = skillToRank(estSkill);

  let sessionStartIdx = 0;
  for (let i = series.length - 1; i > 0; i--) {
    const gapH = (series[i].ts - series[i - 1].ts) / 3600000;
    if (gapH > 4) { sessionStartIdx = i; break; }
  }
  const sessionMatches = series.slice(sessionStartIdx);
  const sessionIR = mean(sessionMatches.map((m) => m.gameIR));

  const patterns = [];
  const recentWindow = series.slice(-15);
  const strength = irMed.effN;
  const posShare = recentWindow.length ? recentWindow.filter((m) => m.parRaw > 0).length / recentWindow.length : 0;

  if (strength >= 10 && irMed.value != null && irLong.value != null && (irMed.value - irLong.value) >= 4 && posShare >= 0.6) {
    patterns.push({
      key: 'improving', tone: 'good', title: 'You are improving',
      detail: `30-day form (${irMed.value.toFixed(1)}) is running above your long-term baseline (${irLong.value.toFixed(1)}), and ${Math.round(posShare * 100)}% of your recent games beat your rank-expected level.`,
    });
  }

  const ipsVals = recentWindow.map((m) => m.ips);
  const ipsMean = mean(ipsVals);
  const ipsStd = ipsVals.length ? Math.sqrt(mean(ipsVals.map((v) => (v - ipsMean) ** 2))) : 0;
  if (strength >= 10 && ipsStd < 10 && irMed.value != null && irLong.value != null && Math.abs(irMed.value - irLong.value) < 3) {
    patterns.push({
      key: 'stagnating', tone: 'neutral', title: 'You are stagnating',
      detail: `Raw performance has been steady (±${ipsStd.toFixed(1)} points) and your 30-day IR is essentially flat versus your long-term baseline. No detectable movement yet.`,
    });
  }

  if (parLong.effN >= 10 && parLong.value >= 15) {
    patterns.push({
      key: 'lagging', tone: 'accent', title: 'Your rank is lagging behind your performance',
      detail: `Sustained performance sits ${parLong.value.toFixed(1)} points above the baseline expected for your rank — roughly ${estDeltaTiers.toFixed(1)} tiers ahead of where you're currently ranked.`,
    });
  }

  const hardGames = series.filter((m) => m.diffTiers > 0.3);
  const easyGames = series.filter((m) => m.diffTiers < -0.3);
  if (hardGames.length >= 4 && easyGames.length >= 4) {
    const hardIPS = mean(hardGames.map((m) => m.ips));
    const easyIPS = mean(easyGames.map((m) => m.ips));
    if (easyIPS - hardIPS >= 15) {
      patterns.push({
        key: 'misleading', tone: 'bad', title: 'Your raw stats are misleading',
        detail: `Average raw performance (Tracker Score/ACS/KD blend) is ${(easyIPS - hardIPS).toFixed(1)} points higher in weaker lobbies (${easyIPS.toFixed(1)}) than tougher ones (${hardIPS.toFixed(1)}). Taken alone, your stat line overstates how you're really doing.`,
      });
    }
  }

  return { irShort, irMed, irLong, parLong, currentRank, estRank, estDeltaTiers, sessionMatches, sessionIR, patterns, latest };
}

/* ======================================================================
   AIM TRAINING (Voltaic benchmarks) — derivation & aggregation
   Mirrors the ranked-match EWMA machinery above so aim trend and ranked
   trend are computed the same way and can be compared on equal footing.
====================================================================== */
function normalizeAimScore(scenario, rawScore) {
  const th = scenario.thresholds;
  // anchor points: 0=Radiant floor, 33.34=Elysian, 66.67=Aurora, 100=Angelic
  const anchors = [[0, th.radiant], [33.34, th.elysian], [66.67, th.aurora], [100, th.angelic]];
  if (rawScore <= anchors[0][1]) {
    const slope = (anchors[1][1] - anchors[0][1]) / (anchors[1][0] - anchors[0][0]);
    return anchors[0][0] + (rawScore - anchors[0][1]) / slope;
  }
  for (let i = 0; i < 3; i++) {
    if (rawScore <= anchors[i + 1][1]) {
      const slope = (anchors[i + 1][1] - anchors[i][1]) / (anchors[i + 1][0] - anchors[i][0]);
      return anchors[i][0] + (rawScore - anchors[i][1]) / slope;
    }
  }
  const slope = (anchors[3][1] - anchors[2][1]) / (anchors[3][0] - anchors[2][0]);
  return anchors[3][0] + (rawScore - anchors[3][1]) / slope;
}

function deriveAimSeries(raw) {
  const sorted = [...raw].sort((a, b) => a.ts - b.ts);
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    const m = sorted[i];
    const scenario = SCENARIO_MAP[m.scenarioId];
    if (!scenario) continue;
    const normScore = normalizeAimScore(scenario, m.rawScore);
    out.push({ ...m, category: scenario.category, sub: scenario.sub, scenarioName: scenario.name, normScore });
    out[i].rollingAim = causalEwma(out, 'normScore', i, 10);

    const start = Math.max(0, i - 9);
    const windowArr = out.slice(start, i + 1);
    if (windowArr.length >= 3) {
      const xs = windowArr.map((w) => w.ts / 86400000);
      const ys = windowArr.map((w) => w.normScore);
      out[i].trendSlope = olsSlope(xs, ys);
    } else {
      out[i].trendSlope = null;
    }
  }
  return out;
}

function aggregateAim(series, now) {
  if (!series.length) return null;
  const short = ewmaAsOfNow(series, 'normScore', 3, now);
  const med = ewmaAsOfNow(series, 'normScore', 10, now);
  const long = ewmaAsOfNow(series, 'normScore', 45, now);

  const byCategory = {};
  AIM_CATEGORIES.forEach((c) => {
    const inCat = series.filter((m) => m.category === c);
    const recent30 = inWindow(inCat, now, 30);
    byCategory[c] = recent30.length ? mean(recent30.map((m) => m.normScore)) : null;
  });

  const last7 = inWindow(series, now, 7);
  const last30 = inWindow(series, now, 30);
  return { short, med, long, byCategory, last7Count: last7.length, last30Count: last30.length, latest: series[series.length - 1] };
}

function detectAimTransferPattern(aimAgg, rankedAgg) {
  if (!aimAgg || !rankedAgg) return null;
  if (aimAgg.med.effN < 8 || aimAgg.long.effN < 8) return null;
  const aimDelta = aimAgg.med.value - aimAgg.long.value;
  if (aimDelta < 8) return null;
  if (rankedAgg.irMed.value == null || rankedAgg.irLong.value == null) return null;
  const irDelta = rankedAgg.irMed.value - rankedAgg.irLong.value;
  if (Math.abs(irDelta) < 3) {
    return {
      key: 'aim-not-transferring', tone: 'accent', title: "Aim mechanics are improving, but it isn't showing up in ranked yet",
      detail: `Your Voltaic benchmark trend is up ${aimDelta.toFixed(1)} points over your long-term baseline, while ranked Improvement Rating is essentially flat (${irDelta >= 0 ? '+' : ''}${irDelta.toFixed(1)}). This is a known gap — isolated aim-trainer mechanics don't automatically translate to in-game decision-making, positioning, or utility play. Worth logging a few deathmatch or ranked sessions specifically to test transfer rather than assuming it.`,
    };
  }
  return null;
}

/* ======================================================================
   TRAINING RECOMMENDATION — ranked vs deathmatch decision engine
====================================================================== */
function startOfDay(ts) {
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
function todayItems(items, now) {
  const s = startOfDay(now);
  return items.filter((x) => x.ts >= s);
}
function inWindow(items, now, days) {
  const cutoff = now - days * 86400000;
  return items.filter((x) => x.ts >= cutoff);
}

function detectFatigue(series, now) {
  const today = todayItems(series, now);
  if (today.length < 6) return { flagged: false, n: today.length };
  const third = Math.max(1, Math.ceil(today.length / 3));
  const firstAvg = mean(today.slice(0, third).map((m) => m.gameIR));
  const lastAvg = mean(today.slice(-third).map((m) => m.gameIR));
  const decline = firstAvg - lastAvg;
  const slope = olsSlope(today.map((_, i) => i), today.map((m) => m.gameIR));
  const flagged = decline >= 8 && slope < -0.5;
  return { flagged, decline, slope, n: today.length, firstAvg, lastAvg };
}

function seriesArrow(series, recent, field, now) {
  if (!recent.length) return '→';
  const recentVal = mean(recent.map((m) => m[field]));
  const baseline = ewmaAsOfNow(series, field, 30, now).value;
  return trendArrow(recentVal, baseline, 3);
}

function buildRecommendation(series, dmLog, aimSeries, now) {
  const rankedToday = todayItems(series, now).length;
  const rankedLast7 = inWindow(series, now, 7).length;
  const rankedLast30 = inWindow(series, now, 30).length;
  const dmToday = todayItems(dmLog, now).length;
  const dmLast7 = inWindow(dmLog, now, 7).length;
  const dmLast30 = inWindow(dmLog, now, 30).length;
  const fatigue = detectFatigue(series, now);

  const recentN = Math.min(10, series.length);
  const recent = series.slice(-recentN);
  const recentIPS = recent.length ? mean(recent.map((m) => m.ips)) : null;
  const baselineIPS = series.length ? ewmaAsOfNow(series, 'ips', 30, now).value : null;
  const ipsGap = (recentIPS != null && baselineIPS != null) ? recentIPS - baselineIPS : 0;
  const recentParRaw = recent.length ? mean(recent.map((m) => m.parRaw)) : null;

  const aimLast7 = inWindow(aimSeries, now, 7).length;
  const aimLast30 = inWindow(aimSeries, now, 30).length;
  const aimMed = aimSeries.length ? ewmaAsOfNow(aimSeries, 'normScore', 10, now) : { value: null, effN: 0 };
  const aimLong = aimSeries.length ? ewmaAsOfNow(aimSeries, 'normScore', 45, now) : { value: null, effN: 0 };
  const aimRecent = aimSeries.slice(-Math.min(10, aimSeries.length));
  const aimTrendDelta = (aimMed.value != null && aimLong.value != null) ? aimMed.value - aimLong.value : null;
  const aimArrow = aimRecent.length ? trendArrow(mean(aimRecent.map((m) => m.normScore)), aimLong.value, 4) : '→';

  const signals = {
    trackerScore: seriesArrow(series, recent, 'tp', now),
    acs: seriesArrow(series, recent, 'acs', now),
    kd: seriesArrow(series, recent, 'kd', now),
    improvementRating: seriesArrow(series, recent, 'gameIR', now),
    performanceAboveRank: recentParRaw != null ? trendArrow(recentParRaw, 0, 5) : '→',
    aimScore: aimSeries.length ? aimArrow : null,
  };

  const base = { rankedToday, rankedLast7, rankedLast30, dmToday, dmLast7, dmLast30, aimLast7, aimLast30, fatigue, signals };

  if (fatigue.flagged) {
    return {
      recommendation: 'STOP RANKED FOR TODAY',
      volume: '0 — rest or light DM only',
      confidence: fatigue.n >= 8 ? 'High' : 'Medium',
      why: `Performance dropped ${fatigue.decline.toFixed(1)} IR points from your first to your last games today across ${fatigue.n} ranked games, with a negative trend across the session. This reads as fatigue, not a sudden skill drop.`,
      ...base,
    };
  }

  if (series.length < 8) {
    return {
      recommendation: 'BALANCED — PLAY BOTH',
      volume: '2-3 of each',
      confidence: 'Low',
      why: `Only ${series.length} ranked game${series.length === 1 ? '' : 's'} logged so far — not enough to tell a mechanical issue from a ranked-specific one yet.`,
      ...base,
    };
  }

  const mechanicalWeak = ipsGap <= -8;
  const rankedWeak = recentParRaw != null && recentParRaw <= -8;
  const dmVeryLow = dmLast7 <= 1;
  const dmVeryHigh = dmLast7 >= Math.max(6, rankedLast7 * 2);
  const rankedVeryLow = rankedToday === 0 && rankedLast7 <= 2;
  const conf = series.length >= 20 ? 'High' : series.length >= 12 ? 'Medium' : 'Low';

  const aimStale = aimSeries.length > 0 && aimLast7 <= 1;
  const aimDeclining = aimTrendDelta != null && aimMed.effN >= 5 && aimTrendDelta <= -5;

  let rec;
  if (mechanicalWeak && aimSeries.length > 0 && (aimStale || aimDeclining)) {
    rec = {
      recommendation: 'PLAY MORE AIM TRAINING',
      volume: '3-4 benchmark scenarios, then reassess',
      confidence: conf,
      why: aimStale
        ? `Raw ranked performance is ${Math.abs(ipsGap).toFixed(1)} points below your own baseline over the last ${recentN} games, and you've only logged ${aimLast7} Voltaic benchmark run${aimLast7 === 1 ? '' : 's'} in 7 days. Isolated mechanics work is the more targeted fix than blind deathmatch here.`
        : `Raw ranked performance is down ${Math.abs(ipsGap).toFixed(1)} points, and your own aim benchmark trend has dropped ${Math.abs(aimTrendDelta).toFixed(1)} points too — this looks like a genuine mechanics dip, not just ranked variance.`,
    };
  } else if (mechanicalWeak && dmVeryLow) {
    rec = {
      recommendation: 'PLAY MORE DEATHMATCH',
      volume: `${clamp(5 - dmLast7, 3, 6)} games, then reassess`,
      confidence: conf,
      why: `Raw performance (Tracker Score/ACS/KD blend) is running ${Math.abs(ipsGap).toFixed(1)} points below your own baseline over the last ${recentN} games, and you've logged only ${dmLast7} deathmatch${dmLast7 === 1 ? '' : 'es'} in the last 7 days. That points to mechanics, not a ranked-specific problem.`,
    };
  } else if (!mechanicalWeak && rankedWeak) {
    rec = {
      recommendation: 'PLAY MORE RANKED',
      volume: '4-6 games',
      confidence: conf,
      why: `Raw performance is holding up fine, but recent Performance Above Rank is running ${recentParRaw.toFixed(1)} — below what's expected at your rank. Mechanics aren't the bottleneck; ranked decision-making reps are.`,
    };
  } else if (dmVeryHigh && !mechanicalWeak) {
    rec = {
      recommendation: 'PLAY MORE RANKED',
      volume: '3-5 games',
      confidence: conf,
      why: `${dmLast7} deathmatches against only ${rankedLast7} ranked games in the last 7 days, and mechanics look solid. Time to convert that practice into ranked reps.`,
    };
  } else if (rankedVeryLow && !mechanicalWeak && !rankedWeak) {
    rec = {
      recommendation: 'PLAY MORE RANKED',
      volume: '4-6 games',
      confidence: conf,
      why: `Performance is solid across the board but you've barely queued ranked lately (${rankedLast7} games in 7 days). Nothing here suggests you need more warmup first.`,
    };
  } else {
    rec = {
      recommendation: 'BALANCED — PLAY BOTH',
      volume: '2 deathmatch warmup, 3-4 ranked',
      confidence: conf,
      why: `No strong signal either way right now — mechanics and rank-relative results both look roughly in line with your baseline.`,
    };
  }

  return { ...rec, ...base, recentIPS, baselineIPS, recentParRaw };
}

/* ======================================================================
   APP STATE
====================================================================== */
const state = {
  matches: [],
  dmLog: [],
  aimLog: [],
  loading: true,
  lastLoggedId: null,
  lastRank: { myTier: 7, mySub: 1, myRR: 0, lobbyTier: 7, lobbySub: 1 },
  lastAimScenario: SCENARIOS[0].id,
  ui: { formOpen: true, historyOpen: false, methodOpen: false, confirmClear: false, confirmDeleteId: null,
        aimFormOpen: false, aimHistoryOpen: false, confirmDeleteAimId: null },
  now: Date.now(),
};

function persistMatches() { saveJSON(LS_MATCHES, state.matches); }
function persistDM() { saveJSON(LS_DM, state.dmLog); }
function persistAim() { saveJSON(LS_AIM, state.aimLog); }

/* ======================================================================
   SMALL RENDER HELPERS
====================================================================== */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function tierOptions(selected) {
  return TIERS.map((t, i) => `<option value="${i}" ${i === selected ? 'selected' : ''}>${t}</option>`).join('');
}
function subOptions(selected) {
  return [1, 2, 3].map((s) => `<option value="${s}" ${s === selected ? 'selected' : ''}>Tier ${s}</option>`).join('');
}

function rankPickerHTML(prefix, tierIdx, subtier, rr, showRR) {
  const isRadiant = TIERS[tierIdx] === 'Radiant';
  return `
    <div class="field">
      <div class="label">${prefix === 'my' ? 'My rank' : 'Lobby average (visible tiers only)'}</div>
      <div class="row-inline">
        <select id="${prefix}Tier" class="sel" data-rank-tier="${prefix}" style="border-color:${TIER_COLORS[TIERS[tierIdx]]}">${tierOptions(tierIdx)}</select>
        <select id="${prefix}Sub" class="sel" style="display:${isRadiant ? 'none' : 'inline-block'}">${subOptions(subtier || 1)}</select>
        ${showRR ? `<input id="${prefix}RR" type="number" class="inp mono narrow" placeholder="RR" value="${rr || 0}" />` : ''}
      </div>
    </div>`;
}

function rankBadgeHTML(tier, subtier, rr) {
  const color = TIER_COLORS[tier] || T.textDim;
  return `<span class="badge" style="background:${color}22;color:${color};border:1px solid ${color}55">${esc(tier)}${subtier ? ` ${subtier}` : ''}${rr != null ? ` · ${rr}RR` : ''}</span>`;
}

function arrowColor(a) { return a === '↑' ? T.good : a === '↓' ? T.bad : T.textDim; }

function aimScenarioOptions(selectedId) {
  const groups = {};
  SCENARIOS.forEach((s) => {
    const key = `${s.category} — ${s.sub}`;
    (groups[key] = groups[key] || []).push(s);
  });
  return Object.entries(groups).map(([label, arr]) => `
    <optgroup label="${esc(label)}">
      ${arr.map((s) => `<option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}
    </optgroup>`).join('');
}

/* ======================================================================
   MAIN RENDER
====================================================================== */
function render() {
  const app = document.getElementById('app');
  if (state.loading) {
    app.innerHTML = `<div class="loading">Loading match history…</div>`;
    return;
  }

  const series = deriveSeries(state.matches);
  const agg = series.length ? computeAggregates(series, state.now) : null;
  const aimSeries = deriveAimSeries(state.aimLog);
  const aimAgg = aimSeries.length ? aggregateAim(aimSeries, state.now) : null;
  const rec = buildRecommendation(series, state.dmLog, aimSeries, state.now);
  const aimTransferPattern = detectAimTransferPattern(aimAgg, agg);
  const lastResult = state.lastLoggedId ? series.find((m) => m.id === state.lastLoggedId) : null;

  const headerIR = agg && agg.irMed.value != null ? agg.irMed.value.toFixed(1) : '—';
  let trendHTML = '';
  if (agg && agg.irMed.value != null && agg.irLong.value != null) {
    const d = agg.irMed.value - agg.irLong.value;
    const arrow = d > 2 ? '▲' : d < -2 ? '▼' : '—';
    const color = d > 2 ? T.good : d < -2 ? T.bad : T.textDim;
    trendHTML = `<span class="trend mono" style="color:${color}">${arrow} ${d > 0 ? '+' : ''}${d.toFixed(1)}</span>`;
  }

  app.innerHTML = `
    <header class="header">
      <div class="eyebrow">Valorant · Improvement Rating</div>
      <div class="irrow">
        <div class="irbig mono">${headerIR}</div>
        ${trendHTML}
      </div>
      <div class="subtext">30-day IR · 50 = performing exactly at your rank</div>
    </header>

    <section class="card">
      <button class="toggle" data-action="toggle-form">
        <span>Log a ranked match</span><span>${state.ui.formOpen ? '▲' : '▼'}</span>
      </button>
      ${state.ui.formOpen ? `
      <div class="form">
        <div class="grid3">
          <div class="field">
            <div class="label">Tracker score</div>
            <input id="fTrackerScore" type="number" inputmode="numeric" class="inp mono" placeholder="0–1000" />
          </div>
          <div class="field">
            <div class="label">ACS</div>
            <input id="fAcs" type="number" inputmode="numeric" class="inp mono" placeholder="e.g. 230" />
          </div>
          <div class="field">
            <div class="label">K/D</div>
            <input id="fKd" type="number" step="0.01" inputmode="decimal" class="inp mono" placeholder="e.g. 1.25" />
          </div>
        </div>
        ${rankPickerHTML('my', state.lastRank.myTier, state.lastRank.mySub, state.lastRank.myRR, true)}
        ${rankPickerHTML('lobby', state.lastRank.lobbyTier, state.lastRank.lobbySub, null, false)}
        <div class="grid2">
          <div class="field">
            <div class="label">RR change (optional)</div>
            <input id="fRrChange" type="number" class="inp mono" placeholder="+18" />
          </div>
          <div class="field">
            <div class="label">Note (optional)</div>
            <input id="fNote" type="text" class="inp" placeholder="duo queue…" />
          </div>
        </div>
        <button class="btn-primary" data-action="log-match">Log match</button>
        <div id="formErr" class="err" style="display:none">Fill in Tracker Score, ACS, and K/D first.</div>
      </div>` : ''}
    </section>

    <section class="card">
      <button class="toggle" data-action="toggle-dm">
        <span>Deathmatch log</span><span>${dmSummaryLine(state.dmLog, state.now)}</span>
      </button>
      <div class="dmrow">
        <input id="fDmNote" type="text" class="inp" placeholder="note (optional)" style="flex:1" />
        <button class="btn-secondary" data-action="log-dm">+ Log deathmatch</button>
      </div>
    </section>

    ${aimFormHTML()}

    ${lastResult ? lastResultHTML(lastResult) : ''}

    ${state.matches.length === 0 ? `<div class="empty">No ranked matches logged yet. Fill in the form above and tap Log match to start building a baseline.</div>` : ''}

    ${agg ? statsPanelHTML(agg) : ''}

    ${aimAgg ? aimStatsHTML(aimAgg) : ''}

    ${recommendationHTML(rec)}

    ${(function () {
      const allPatterns = (agg ? agg.patterns : []).concat(aimTransferPattern ? [aimTransferPattern] : []);
      return allPatterns.length > 0 ? patternsHTML(allPatterns) : '';
    })()}
    ${agg && agg.patterns.length === 0 && series.length > 0 && series.length < 10 ? `<div class="hint">Log ${10 - series.length} more match${10 - series.length === 1 ? '' : 'es'} before I can call a trend one way or another.</div>` : ''}

    ${series.length >= 2 ? chartHTML(series) : ''}

    ${aimSeries.length >= 2 ? aimChartHTML(aimSeries) : ''}

    ${state.matches.length > 0 ? historyHTML(series) : ''}

    ${state.aimLog.length > 0 ? aimHistoryHTML(aimSeries) : ''}

    ${methodologyHTML()}

    <div class="clearzone">
      ${state.ui.confirmClear ? `
        <span class="mono small">Delete all ${state.matches.length} ranked matches, ${state.dmLog.length} DM logs, and ${state.aimLog.length} aim scores?</span>
        <button class="linkbtn bad" data-action="clear-confirm">Yes, clear</button>
        <button class="linkbtn" data-action="clear-cancel">Cancel</button>
      ` : (state.matches.length > 0 || state.dmLog.length > 0 || state.aimLog.length > 0 ? `<button class="linkbtn" data-action="clear-open">Clear all data</button>` : '')}
    </div>
  `;
}

function dmSummaryLine(dmLog, now) {
  const today = todayItems(dmLog, now).length;
  const last7 = inWindow(dmLog, now, 7).length;
  return `<span class="mono small">${today} today · ${last7} this week</span>`;
}

function lastResultHTML(m) {
  const rr = m.rrChange != null ? `<div class="row"><span class="dim">RR change (not used in IR)</span><span class="mono">${m.rrChange >= 0 ? '+' : ''}${m.rrChange}</span></div>` : '';
  return `
  <section class="card accentcard">
    <div class="rowhead">
      <div class="eyebrow accent">Match logged</div>
      <button class="iconbtn" data-action="dismiss-last">✕</button>
    </div>
    <div class="row"><span class="dim">My rank</span><span class="mono">${esc(rankLabel(skillToRank(m.mySkill)))}</span></div>
    <div class="row"><span class="dim">Lobby average</span><span class="mono">${esc(TIERS[m.lobbyTier])}${m.lobbySub ? ` ${m.lobbySub}` : ''}</span></div>
    <div class="row"><span class="dim">Tracker score / ACS / K/D</span><span class="mono">${m.trackerScore} / ${m.acs} / ${m.kd}</span></div>
    <div class="row"><span class="dim">Lobby strength differential</span><span class="mono">${m.diffTiers >= 0 ? '+' : ''}${m.diffTiers.toFixed(2)} tiers</span></div>
    <div class="row"><span class="dim">Individual performance (blended)</span><span class="mono">${m.ips.toFixed(1)}</span></div>
    <div class="row"><span class="dim">Contextual performance</span><span class="mono">${m.cpInstant.toFixed(1)}</span></div>
    <div class="row"><span class="dim">Performance above rank</span><span class="mono">${m.parRaw >= 0 ? '+' : ''}${m.parRaw.toFixed(1)}</span></div>
    <div class="row"><span class="dim">Match Improvement Rating</span><span class="mono bold">${m.gameIR.toFixed(1)}</span></div>
    ${rr}
  </section>`;
}

function statsPanelHTML(agg) {
  const short = confidenceLabel(agg.irShort.effN);
  const med = confidenceLabel(agg.irMed.effN);
  const long = confidenceLabel(agg.irLong.effN);
  const clampedDelta = clamp(agg.estDeltaTiers, -1.5, 1.5);
  const pct = ((clampedDelta + 1.5) / 3) * 100;
  const zoneColor = agg.estDeltaTiers > 0.3 ? T.good : agg.estDeltaTiers < -0.3 ? T.bad : T.accent;

  return `
  <section class="card">
    <div class="eyebrow">Current improvement</div>
    <div class="statgrid">
      <div class="stat"><div class="statval mono">${agg.irShort.value != null ? agg.irShort.value.toFixed(1) : '—'}</div><div class="statlbl">7-day</div><div class="statconf" style="color:${short.color}">${short.label} conf.</div></div>
      <div class="stat"><div class="statval mono">${agg.irMed.value != null ? agg.irMed.value.toFixed(1) : '—'}</div><div class="statlbl">30-day</div><div class="statconf" style="color:${med.color}">${med.label} conf.</div></div>
      <div class="stat"><div class="statval mono">${agg.irLong.value != null ? agg.irLong.value.toFixed(1) : '—'}</div><div class="statlbl">Long-term</div><div class="statconf" style="color:${long.color}">${long.label} conf.</div></div>
    </div>
    <div class="gauge">
      <div class="gaugelabels"><span>Below rank</span><span>At rank</span><span>Above rank</span></div>
      <div class="gaugetrack">
        <div class="gaugetick"></div>
        <div class="gaugedot" style="left:${pct}%;background:${zoneColor};box-shadow:0 0 10px ${zoneColor}"></div>
      </div>
      <div class="gaugefoot mono"><span>Current: ${esc(rankLabel(agg.currentRank))}</span><span>Est. skill: ${esc(rankLabel(agg.estRank))}</span></div>
    </div>
    <div class="sessionline">Session (${agg.sessionMatches.length} ${agg.sessionMatches.length === 1 ? 'game' : 'games'}): <span class="mono">${agg.sessionIR.toFixed(1)}</span></div>
  </section>`;
}

function recommendationHTML(rec) {
  const toneColor = rec.recommendation.startsWith('STOP') ? T.bad
    : (rec.recommendation.startsWith('PLAY MORE DEATHMATCH') || rec.recommendation.startsWith('PLAY MORE AIM')) ? T.good
    : rec.recommendation.startsWith('PLAY MORE RANKED') ? T.accent
    : T.textDim;
  const s = rec.signals || {};
  const sig = (label, v) => v ? `<div class="sigrow"><span class="dim">${label}</span><span class="mono" style="color:${arrowColor(v)}">${v}</span></div>` : '';
  return `
  <section class="card" style="border-color:${toneColor}55">
    <div class="eyebrow" style="color:${toneColor}">Training recommendation</div>
    <div class="recmain mono" style="color:${toneColor}">${esc(rec.recommendation)}</div>
    <div class="row"><span class="dim">Recommended volume</span><span class="mono">${esc(String(rec.volume))}</span></div>
    <div class="row"><span class="dim">Confidence</span><span class="mono">${esc(rec.confidence)}</span></div>
    <div class="whytext">${esc(rec.why)}</div>
    ${s.trackerScore ? `<div class="sigblock">
      <div class="siglbl">Key signals</div>
      ${sig('Tracker Score', s.trackerScore)}${sig('ACS', s.acs)}${sig('K/D', s.kd)}${sig('Improvement Rating', s.improvementRating)}${sig('Performance Above Rank', s.performanceAboveRank)}${sig('Aim Score', s.aimScore)}
    </div>` : ''}
    <div class="row small"><span class="dim">Ranked: today / 7d / 30d</span><span class="mono">${rec.rankedToday} / ${rec.rankedLast7} / ${rec.rankedLast30}</span></div>
    <div class="row small"><span class="dim">Deathmatch: today / 7d / 30d</span><span class="mono">${rec.dmToday} / ${rec.dmLast7} / ${rec.dmLast30}</span></div>
    <div class="row small"><span class="dim">Aim training: 7d / 30d</span><span class="mono">${rec.aimLast7} / ${rec.aimLast30}</span></div>
  </section>`;
}

function patternsHTML(patterns) {
  const toneStyle = (tone) => ({
    good: [T.goodSoft, T.good], bad: [T.badSoft, T.bad], accent: [T.accentSoft, T.accent],
  }[tone] || [T.panelAlt, T.textDim]);
  return `<section class="stack">` + patterns.map((p) => {
    const [bg, border] = toneStyle(p.tone);
    return `<div class="alert" style="background:${bg};border:1px solid ${border}44">
      <div class="alerttitle">${esc(p.title)}</div>
      <div class="alertdetail">${esc(p.detail)}</div>
    </div>`;
  }).join('') + `</section>`;
}

function chartHTML(series) {
  const w = 320, h = 160, padL = 28, padR = 8, padT = 8, padB = 18;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const vals = series.map((m) => m.gameIR).concat(series.map((m) => m.irShortSeries));
  const minV = Math.min(0, ...vals), maxV = Math.max(100, ...vals);
  const x = (i) => padL + (series.length <= 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
  const y = (v) => padT + innerH - ((v - minV) / (maxV - minV || 1)) * innerH;
  const yRef = y(50);

  const rawPts = series.map((m, i) => `${x(i)},${y(m.gameIR)}`).join(' ');
  const smoothPts = series.map((m, i) => `${x(i)},${y(m.irShortSeries)}`).join(' ');

  return `
  <section class="card">
    <div class="eyebrow">Trend</div>
    <svg viewBox="0 0 ${w} ${h}" class="chart" preserveAspectRatio="none">
      <line x1="${padL}" y1="${yRef}" x2="${w - padR}" y2="${yRef}" stroke="${T.borderStrong}" stroke-dasharray="4 3" stroke-width="1"/>
      <text x="${padL}" y="${y(maxV) + 8}" fill="${T.textFaint}" font-size="8">${maxV.toFixed(0)}</text>
      <text x="${padL}" y="${y(minV) - 2}" fill="${T.textFaint}" font-size="8">${minV.toFixed(0)}</text>
      <polyline points="${rawPts}" fill="none" stroke="${T.textFaint}" stroke-width="1" opacity="0.6"/>
      <polyline points="${smoothPts}" fill="none" stroke="${T.accent}" stroke-width="2"/>
    </svg>
  </section>`;
}

function aimFormHTML() {
  return `
  <section class="card">
    <button class="toggle" data-action="toggle-aimform">
      <span>Log Voltaic aim training</span><span>${state.ui.aimFormOpen ? '▲' : '▼'}</span>
    </button>
    ${state.ui.aimFormOpen ? `
    <div class="form">
      <div class="field">
        <div class="label">Scenario</div>
        <select id="fAimScenario" class="sel" style="width:100%">${aimScenarioOptions(state.lastAimScenario)}</select>
      </div>
      <div class="field">
        <div class="label">Score</div>
        <input id="fAimScore" type="number" inputmode="decimal" class="inp mono" placeholder="raw Voltaic score" />
      </div>
      <button class="btn-primary" data-action="log-aim">Log aim score</button>
      <div id="aimFormErr" class="err" style="display:none">Enter a valid score first.</div>
    </div>` : ''}
  </section>`;
}

function aimStatsHTML(aimAgg) {
  if (!aimAgg) return '';
  const short = confidenceLabel(aimAgg.short.effN);
  const med = confidenceLabel(aimAgg.med.effN);
  const long = confidenceLabel(aimAgg.long.effN);
  const catRows = AIM_CATEGORIES.map((c) => {
    const v = aimAgg.byCategory[c];
    return `<div class="row small"><span class="dim">${c} (30d avg)</span><span class="mono">${v != null ? v.toFixed(1) : '—'}</span></div>`;
  }).join('');
  return `
  <section class="card">
    <div class="eyebrow">Aim Score (Voltaic, normalized)</div>
    <div class="statgrid">
      <div class="stat"><div class="statval mono">${aimAgg.short.value != null ? aimAgg.short.value.toFixed(1) : '—'}</div><div class="statlbl">7-day</div><div class="statconf" style="color:${short.color}">${short.label} conf.</div></div>
      <div class="stat"><div class="statval mono">${aimAgg.med.value != null ? aimAgg.med.value.toFixed(1) : '—'}</div><div class="statlbl">30-day</div><div class="statconf" style="color:${med.color}">${med.label} conf.</div></div>
      <div class="stat"><div class="statval mono">${aimAgg.long.value != null ? aimAgg.long.value.toFixed(1) : '—'}</div><div class="statlbl">Long-term</div><div class="statconf" style="color:${long.color}">${long.label} conf.</div></div>
    </div>
    <div class="sigblock">
      <div class="siglbl">By category (30-day avg)</div>
      ${catRows}
    </div>
    <div class="subtext" style="margin-top:8px">0 ≈ Radiant floor · 33 ≈ Elysian · 67 ≈ Aurora · 100 ≈ Angelic, per scenario, then averaged</div>
  </section>`;
}

function aimChartHTML(aimSeries) {
  if (aimSeries.length < 2) return '';
  const w = 320, h = 160, padL = 28, padR = 8, padT = 8, padB = 18;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const vals = aimSeries.map((m) => m.normScore).concat(aimSeries.map((m) => m.rollingAim));
  const minV = Math.min(0, ...vals), maxV = Math.max(100, ...vals);
  const x = (i) => padL + (aimSeries.length <= 1 ? innerW / 2 : (i / (aimSeries.length - 1)) * innerW);
  const y = (v) => padT + innerH - ((v - minV) / (maxV - minV || 1)) * innerH;
  const yRef = y(50);
  const rawPts = aimSeries.map((m, i) => `${x(i)},${y(m.normScore)}`).join(' ');
  const smoothPts = aimSeries.map((m, i) => `${x(i)},${y(m.rollingAim)}`).join(' ');
  return `
  <section class="card">
    <div class="eyebrow">Aim trend</div>
    <svg viewBox="0 0 ${w} ${h}" class="chart" preserveAspectRatio="none">
      <line x1="${padL}" y1="${yRef}" x2="${w - padR}" y2="${yRef}" stroke="${T.borderStrong}" stroke-dasharray="4 3" stroke-width="1"/>
      <text x="${padL}" y="${y(maxV) + 8}" fill="${T.textFaint}" font-size="8">${maxV.toFixed(0)}</text>
      <text x="${padL}" y="${y(minV) - 2}" fill="${T.textFaint}" font-size="8">${minV.toFixed(0)}</text>
      <polyline points="${rawPts}" fill="none" stroke="${T.textFaint}" stroke-width="1" opacity="0.6"/>
      <polyline points="${smoothPts}" fill="none" stroke="${T.good}" stroke-width="2"/>
    </svg>
  </section>`;
}

function aimHistoryHTML(aimSeries) {
  const rows = [...aimSeries].reverse().map((m) => {
    const dt = new Date(m.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const confirming = state.ui.confirmDeleteAimId === m.id;
    return `
    <div class="histrow">
      <div>
        <div class="dim small">${dt}</div>
        <div class="row-inline"><span class="dim small">${esc(m.scenarioName)}</span></div>
      </div>
      <div class="histright">
        <div class="text-right">
          <div class="mono">${m.normScore.toFixed(1)}</div>
          <div class="dim small">raw ${m.rawScore}</div>
        </div>
        ${confirming ? `
          <div class="row-inline">
            <button class="minibtn bad" data-action="delete-aim-confirm" data-id="${m.id}">Yes</button>
            <button class="minibtn" data-action="delete-aim-cancel">No</button>
          </div>` : `<button class="iconbtn" data-action="delete-aim-open" data-id="${m.id}">🗑</button>`}
      </div>
    </div>`;
  }).join('');

  return `
  <section class="card">
    <button class="toggle" data-action="toggle-aimhistory">
      <span>Aim training log (${state.aimLog.length})</span><span>${state.ui.aimHistoryOpen ? '▲' : '▼'}</span>
    </button>
    ${state.ui.aimHistoryOpen ? `<div class="histlist">${rows}</div>` : ''}
  </section>`;
}

function historyHTML(series) {
  const rows = [...series].reverse().map((m) => {
    const dt = new Date(m.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const confirming = state.ui.confirmDeleteId === m.id;
    return `
    <div class="histrow">
      <div>
        <div class="dim small">${dt}</div>
        <div class="row-inline">${rankBadgeHTML(TIERS[m.myTier], m.mySub, m.myRR)}<span class="dim small">vs</span>${rankBadgeHTML(TIERS[m.lobbyTier], m.lobbySub, null)}</div>
        ${m.note ? `<div class="dim small italic">${esc(m.note)}</div>` : ''}
      </div>
      <div class="histright">
        <div class="text-right">
          <div class="mono">${m.gameIR.toFixed(1)}</div>
          <div class="dim small">TS ${m.trackerScore} · ACS ${m.acs} · KD ${m.kd}</div>
        </div>
        ${confirming ? `
          <div class="row-inline">
            <button class="minibtn bad" data-action="delete-confirm" data-id="${m.id}">Yes</button>
            <button class="minibtn" data-action="delete-cancel">No</button>
          </div>` : `<button class="iconbtn" data-action="delete-open" data-id="${m.id}">🗑</button>`}
      </div>
    </div>`;
  }).join('');

  return `
  <section class="card">
    <button class="toggle" data-action="toggle-history">
      <span>Match history (${state.matches.length})</span><span>${state.ui.historyOpen ? '▲' : '▼'}</span>
    </button>
    ${state.ui.historyOpen ? `<div class="histlist">${rows}</div>` : ''}
  </section>`;
}

function methodologyHTML() {
  return `
  <section class="card small-text">
    <button class="toggle" data-action="toggle-method">
      <span>ⓘ How this is calculated</span><span>${state.ui.methodOpen ? '▲' : '▼'}</span>
    </button>
    ${state.ui.methodOpen ? `
    <div class="methodbody">
      <p><b>Individual Performance Score</b> = 0.55·Tracker Score + 0.25·ACS + 0.20·K/D (each normalized to a 50-centered scale first). Tracker Score keeps the largest share since it already overlaps heavily with ACS — this avoids double-counting the same signal three times.</p>
      <p><b>Rank scale:</b> 100 points per sub-tier, 300 per full rank, 2400 at Radiant's floor. Lobby average assumes 50 RR per visible tier since exact enemy RR isn't shown in-game.</p>
      <p><b>Difficulty modifier:</b> 1 + 0.6·tanh(differential ÷ 1.5 tiers) — symmetric, saturates around ×1.6 / ×0.4.</p>
      <p><b>Game IR</b> = 50% this match's contextual performance + 30% your 10-day rolling form (vs. the 50-baseline expected at any rank) + 20% short-term trend slope.</p>
      <p><b>7-/30-day/long-term IR:</b> exponentially-weighted averages of Game IR with 3-/10-/45-day half-lives — no hard cutoffs.</p>
      <p><b>Training recommendation:</b> compares your raw Individual Performance Score (mechanics) against your own baseline, and your Performance Above Rank (ranked-contextual results) against the neutral 50 line, plus ranked/DM volume and a same-day fatigue check (declining IR across ≥6 ranked games today). This layer is more judgment call than the core IR math — treat it as a nudge, not a verdict.</p>
      <p><b>Confidence:</b> based on effective sample size (Σ of EWMA weights) for the IR figures, and on raw game count for the recommendation.</p>
      <p><b>Aim Score:</b> each Voltaic benchmark scenario is normalized against its own Radiant/Elysian/Aurora/Angelic thresholds onto a 0-100 scale (piecewise-linear, extrapolated beyond the endpoints), then averaged across whatever scenarios you've logged. This lets wildly different scenario score ranges (e.g. VT MiniTS ~115 vs VT Widereflex ~7650) sit on one comparable trend using the same 3-/10-/45-day EWMA machinery as ranked IR.</p>
      <p><b>Aim-training recommendation branch:</b> when raw ranked performance is below your baseline (mechanical weakness) and your aim benchmark log is stale or declining, the app suggests targeted aim training over blind deathmatch. This is a judgment call, not a proven causal claim — aim-trainer mechanics don't automatically transfer to in-game decision-making, so treat it as one input, not a verdict.</p>
    </div>` : ''}
  </section>`;
}

/* ======================================================================
   EVENTS
====================================================================== */
function readForm() {
  const g = (id) => document.getElementById(id);
  return {
    trackerScore: g('fTrackerScore').value,
    acs: g('fAcs').value,
    kd: g('fKd').value,
    myTier: Number(g('myTier').value),
    mySub: Number(g('mySub').value),
    myRR: Number(g('myRR').value) || 0,
    lobbyTier: Number(g('lobbyTier').value),
    lobbySub: Number(g('lobbySub').value),
    rrChange: g('fRrChange').value,
    note: g('fNote').value,
  };
}

function handleLogMatch() {
  const f = readForm();
  const ts = Number(f.trackerScore), ac = Number(f.acs), kd = Number(f.kd);
  if (f.trackerScore === '' || isNaN(ts) || ts < 0 || f.acs === '' || isNaN(ac) || ac < 0 || f.kd === '' || isNaN(kd) || kd < 0) {
    document.getElementById('formErr').style.display = 'block';
    return;
  }
  const newMatch = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    trackerScore: ts, acs: ac, kd: kd,
    myTier: f.myTier, mySub: f.mySub, myRR: f.myRR,
    lobbyTier: f.lobbyTier, lobbySub: f.lobbySub,
    rrChange: f.rrChange === '' ? null : Number(f.rrChange),
    note: f.note.trim(),
  };
  state.matches.push(newMatch);
  persistMatches();
  state.lastLoggedId = newMatch.id;
  state.lastRank = { myTier: f.myTier, mySub: f.mySub, myRR: f.myRR, lobbyTier: f.lobbyTier, lobbySub: f.lobbySub };
  state.now = Date.now();
  render();
}

function handleLogDM() {
  const note = document.getElementById('fDmNote').value.trim();
  state.dmLog.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ts: Date.now(), note });
  persistDM();
  state.now = Date.now();
  render();
}

function handleDelete(id) {
  state.matches = state.matches.filter((m) => m.id !== id);
  persistMatches();
  if (state.lastLoggedId === id) state.lastLoggedId = null;
  state.ui.confirmDeleteId = null;
  render();
}

function handleLogAim() {
  const scenarioId = document.getElementById('fAimScenario').value;
  const rawScore = Number(document.getElementById('fAimScore').value);
  if (!SCENARIO_MAP[scenarioId] || isNaN(rawScore) || rawScore < 0 || document.getElementById('fAimScore').value === '') {
    document.getElementById('aimFormErr').style.display = 'block';
    return;
  }
  state.aimLog.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    scenarioId,
    rawScore,
  });
  persistAim();
  state.lastAimScenario = scenarioId;
  state.now = Date.now();
  render();
}

function handleDeleteAim(id) {
  state.aimLog = state.aimLog.filter((m) => m.id !== id);
  persistAim();
  state.ui.confirmDeleteAimId = null;
  render();
}

function handleClearAll() {
  state.matches = []; state.dmLog = []; state.aimLog = [];
  persistMatches(); persistDM(); persistAim();
  state.lastLoggedId = null;
  state.ui.confirmClear = false;
  render();
}

function bindDelegatedEvents() {
  document.getElementById('app').addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;
    const id = el.dataset.id;
    if (action === 'toggle-form') { state.ui.formOpen = !state.ui.formOpen; render(); }
    else if (action === 'toggle-dm') { /* no-op, header is informational */ }
    else if (action === 'toggle-history') { state.ui.historyOpen = !state.ui.historyOpen; render(); }
    else if (action === 'toggle-method') { state.ui.methodOpen = !state.ui.methodOpen; render(); }
    else if (action === 'toggle-aimform') { state.ui.aimFormOpen = !state.ui.aimFormOpen; render(); }
    else if (action === 'toggle-aimhistory') { state.ui.aimHistoryOpen = !state.ui.aimHistoryOpen; render(); }
    else if (action === 'log-match') { handleLogMatch(); }
    else if (action === 'log-dm') { handleLogDM(); }
    else if (action === 'log-aim') { handleLogAim(); }
    else if (action === 'dismiss-last') { state.lastLoggedId = null; render(); }
    else if (action === 'delete-open') { state.ui.confirmDeleteId = id; render(); }
    else if (action === 'delete-confirm') { handleDelete(id); }
    else if (action === 'delete-cancel') { state.ui.confirmDeleteId = null; render(); }
    else if (action === 'delete-aim-open') { state.ui.confirmDeleteAimId = id; render(); }
    else if (action === 'delete-aim-confirm') { handleDeleteAim(id); }
    else if (action === 'delete-aim-cancel') { state.ui.confirmDeleteAimId = null; render(); }
    else if (action === 'clear-open') { state.ui.confirmClear = true; render(); }
    else if (action === 'clear-cancel') { state.ui.confirmClear = false; render(); }
    else if (action === 'clear-confirm') { handleClearAll(); }
  });

  // targeted listener for the tier <-> subtier show/hide (delegated, survives re-renders)
  document.getElementById('app').addEventListener('change', (e) => {
    if (e.target.dataset && e.target.dataset.rankTier) {
      const prefix = e.target.dataset.rankTier;
      const isRadiant = TIERS[Number(e.target.value)] === 'Radiant';
      const subSel = document.getElementById(`${prefix}Sub`);
      if (subSel) subSel.style.display = isRadiant ? 'none' : 'inline-block';
    }
  });
}

/* ======================================================================
   INIT
====================================================================== */
function init() {
  state.matches = loadJSON(LS_MATCHES, []);
  state.dmLog = loadJSON(LS_DM, []);
  state.aimLog = loadJSON(LS_AIM, []);
  if (state.aimLog.length) {
    state.lastAimScenario = [...state.aimLog].sort((a, b) => b.ts - a.ts)[0].scenarioId;
  }
  if (state.matches.length) {
    const last = [...state.matches].sort((a, b) => b.ts - a.ts)[0];
    state.lastRank = { myTier: last.myTier, mySub: last.mySub, myRR: last.myRR, lobbyTier: last.lobbyTier, lobbySub: last.lobbySub };
  }
  state.loading = false;
  bindDelegatedEvents();
  render();
}

document.addEventListener('DOMContentLoaded', init);
