import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Character from '../Character';
import { input, playerState } from '../../systems/input';
import { resolve, camBlocked } from '../../world/collision';
import { useStore } from '../../store/useStore';
import chars from '../../data/characters/npcs.json';
const tgt = new THREE.Vector3(), want = new THREE.Vector3();
export default function Player() {
  const g = useRef(), anim = useRef({ walking: false, sitting: false });
  useFrame(({ camera }, dt) => {
    const s = useStore.getState(); if (s.paused) return; dt = Math.min(dt, 0.05);
    const { mx, mz, yaw, pitch } = input, len = Math.min(1, Math.hypot(mx, mz));
    anim.current.walking = len > 0.05;
    if (len > 0.05) {
      const dx = -Math.sin(yaw) * mz + Math.cos(yaw) * mx, dz = -Math.cos(yaw) * mz - Math.sin(yaw) * mx;
      const sp = len > 0.85 ? 4.2 : 2.4 * len + 0.6, n = Math.hypot(dx, dz);
      const [x, z] = resolve(playerState.x + (dx / n) * sp * dt, playerState.z + (dz / n) * sp * dt);
      playerState.x = x; playerState.z = z;
      let d = Math.atan2(dx, dz) - playerState.rot; d = Math.atan2(Math.sin(d), Math.cos(d));
      playerState.rot += d * Math.min(1, dt * 12);
    }
    g.current.position.set(playerState.x, 0, playerState.z); g.current.rotation.y = playerState.rot;
    tgt.set(playerState.x, 1.4, playerState.z);
    let dist = s.camDist;
    const dir = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)];
    for (; dist > 1.2; dist -= 0.4) if (!camBlocked(tgt.x + dir[0] * dist, tgt.y + dir[1] * dist, tgt.z + dir[2] * dist)) break;
    want.set(tgt.x + dir[0] * dist, tgt.y + dir[1] * dist, tgt.z + dir[2] * dist);
    camera.position.lerp(want, 1 - Math.exp(-10 * dt)); camera.lookAt(tgt);
  });
  return <group ref={g}><Character color={chars.player.color} anim={anim} /></group>;
}
