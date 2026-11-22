import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Character from '../Character';
import house from '../../data/world/house.json';
import routines from '../../data/routines/demo.json';
import { clock } from '../../systems/TimeSystem/clock';
import { entryAt, findPath } from '../../systems/RoutineSystem';
import { playerState } from '../../systems/input';
import { useStore } from '../../store/useStore';
export default function NPC({ cfg }) {
  const o = cfg.offset || [0, 0];
  const g = useRef(), anim = useRef({ walking: false, sitting: false }), st = useRef(null);
  if (!st.current) { const e = entryAt(routines.routines[cfg.id], clock.hour), n = house.nodes[e.loc]; st.current = { x: n[0] + o[0], z: n[1] + o[1], rot: 0, path: [], loc: e.loc }; }
  useFrame((_, dt) => {
    if (useStore.getState().paused) return; dt = Math.min(dt, 0.05);
    const s = st.current, e = entryAt(routines.routines[cfg.id], clock.hour);
    if (e.loc !== s.loc) { s.loc = e.loc; s.path = findPath(house, [s.x, s.z], e.loc); const L = s.path[s.path.length - 1]; if (L) s.path[s.path.length - 1] = [L[0] + o[0], L[1] + o[1]]; }
    if (s.path.length) {
      const [tx, tz] = s.path[0], dx = tx - s.x, dz = tz - s.z, d = Math.hypot(dx, dz), step = cfg.speed * dt;
      if (d <= step) { s.x = tx; s.z = tz; s.path.shift(); } else { s.x += (dx / d) * step; s.z += (dz / d) * step; s.rot = Math.atan2(dx, dz); }
    }
    anim.current.walking = s.path.length > 0;
    anim.current.sitting = !s.path.length && routines.activities[e.activity].pose === 'sit';
    g.current.position.set(s.x, 0, s.z); g.current.rotation.y = s.rot;
    // NPC Interaction System
    const near = Math.hypot(s.x - playerState.x, s.z - playerState.z) < 2, cur = useStore.getState().nearNpc;
    if (near && cur !== cfg.id) useStore.setState({ nearNpc: cfg.id }); else if (!near && cur === cfg.id) useStore.setState({ nearNpc: null });
  });
  return <group ref={g}><Character {...cfg} anim={anim} /></group>;
}
