import demo from '../../data/routines/demo.json';
export const activities = demo.activities;
// NPC Routine Manager: aktivitas NPC berdasarkan jam game
export const entryAt = (routine, h) => routine.find((r) => h >= r.from && h < r.to) || routine[routine.length - 1];
// NPC Behavior Controller: BFS antar node rumah
export function findPath(house, [x, z], target) {
  const N = house.nodes, adj = {};
  for (const [a, b] of house.edges) { (adj[a] ||= []).push(b); (adj[b] ||= []).push(a); }
  let start = null, best = 1e9;
  for (const k in N) { const d = Math.hypot(N[k][0] - x, N[k][1] - z); if (d < best) { best = d; start = k; } }
  const prev = { [start]: null }, q = [start];
  while (q.length) { const c = q.shift(); if (c === target) break; for (const n of adj[c] || []) if (!(n in prev)) { prev[n] = c; q.push(n); } }
  if (!(target in prev)) return [];
  const out = []; for (let c = target; c; c = prev[c]) out.unshift(N[c]);
  return out;
}
