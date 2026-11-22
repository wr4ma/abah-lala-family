import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clock } from '../../systems/TimeSystem/clock';
const NIGHT = new THREE.Color('#4a5080'), WHITE = new THREE.Color('#ffffff');
const defs = [[-45, 16, -40, 1], [10, 20, -60, 1.3], [50, 15, -35, 0.9], [-30, 18, 45, 1.2], [35, 22, 50, 1], [-65, 17, 10, 1.1], [0, 24, -80, 1.4], [70, 19, 5, 1]];
// Awan blocky ala Roblox: melayang pelan, gelap saat malam.
export default function Clouds() {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', fog: false }), []);
  const refs = useRef([]);
  useFrame((_, dt) => {
    const day = Math.max(0, Math.sin(((clock.hour - 6) / 12) * Math.PI));
    mat.color.copy(NIGHT).lerp(WHITE, Math.min(1, day * 3));
    for (const g of refs.current) if (g) { g.position.x += dt * 0.8; if (g.position.x > 90) g.position.x = -90; }
  });
  return (<group>{defs.map(([x, y, z, s], i) => (
    <group key={i} ref={(el) => (refs.current[i] = el)} position={[x, y, z]} scale={s}>
      <mesh material={mat}><boxGeometry args={[12, 3, 6]} /></mesh>
      <mesh material={mat} position={[-5, 1.5, 1]}><boxGeometry args={[7, 3, 5]} /></mesh>
      <mesh material={mat} position={[4.5, 1.2, -1]}><boxGeometry args={[7, 3, 5]} /></mesh>
      <mesh material={mat} position={[0, 2.5, 0]}><boxGeometry args={[6, 2.5, 4]} /></mesh>
    </group>))}</group>);
}
