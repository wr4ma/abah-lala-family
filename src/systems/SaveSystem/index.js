import { clock } from '../TimeSystem/clock';
import { playerState } from '../input';
import { useStore } from '../../store/useStore';
const DB = 'abah-lala', ST = 'kv';
const open = () => new Promise((res, rej) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(ST); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
async function put(k, v) { try { const db = await open(); await new Promise((res, rej) => { const t = db.transaction(ST, 'readwrite'); t.objectStore(ST).put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); }); } catch (e) { console.warn('save gagal', e); } }
async function get(k) { try { const db = await open(); return await new Promise((res, rej) => { const q = db.transaction(ST).objectStore(ST).get(k); q.onsuccess = () => res(q.result ?? null); q.onerror = () => rej(q.error); }); } catch { return null; } }
export async function saveState() {
  const s = useStore.getState();
  await put('state', { v: 1, x: playerState.x, z: playerState.z, hour: clock.hour, speed: clock.speed, sens: s.sens, camDist: s.camDist, quality: s.quality });
}
// Status rutinitas NPC diturunkan dari jam game, jadi cukup menyimpan jam.
export async function loadState() {
  const d = await get('state');
  const ok = d && d.v === 1 && ['x', 'z', 'hour', 'speed', 'sens', 'camDist'].every((k) => Number.isFinite(d[k]));
  if (!ok) return false;
  playerState.x = d.x; playerState.z = d.z; clock.hour = d.hour % 24; clock.speed = d.speed;
  useStore.getState().setQuality(['auto', 'low', 'high'].includes(d.quality) ? d.quality : 'auto');
  useStore.setState({ sens: d.sens, camDist: d.camDist });
  return true;
}
export const resetData = () => new Promise((r) => { const q = indexedDB.deleteDatabase(DB); q.onsuccess = q.onerror = q.onblocked = () => r(); });
