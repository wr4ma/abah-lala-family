import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { clock } from '../../systems/TimeSystem/clock';
import { useStore } from '../../store/useStore';
const keys = [[0, '#0b1030'], [5, '#1b2250'], [6.5, '#f4a76b'], [8, '#9fd0f5'], [12, '#7ec8f5'], [17, '#9fc8ee'], [18.5, '#f2a36b'], [20, '#2a2252'], [24, '#0b1030']].map(([h, c]) => [h, new THREE.Color(c)]);
const sky = (h, out) => { for (let i = 0; i < keys.length - 1; i++) { const [a, ca] = keys[i], [b, cb] = keys[i + 1]; if (h >= a && h <= b) return out.copy(ca).lerp(cb, (h - a) / (b - a)); } return out; };
// Siklus waktu: langit, matahari, cahaya & lampu interior. Juga menggerakkan jam game.
export default function Environment() {
  const { scene } = useThree(); const c = useMemo(() => new THREE.Color(), []);
  const sun = useRef(), sunM = useRef(), amb = useRef(), l1 = useRef(), l2 = useRef(), acc = useRef(0);
  useFrame((_, dt) => {
    if (!useStore.getState().paused) { clock.hour = (clock.hour + Math.min(dt, 0.1) * clock.speed) % 24; acc.current += dt; if (acc.current > 1) { acc.current = 0; useStore.setState({ hour: clock.hour }); } }
    const h = clock.hour, a = ((h - 6) / 12) * Math.PI, day = Math.max(0, Math.sin(a)), night = Math.max(0, 1 - day * 3);
    sky(h, c); scene.background = c; if (!scene.fog) scene.fog = new THREE.Fog(c.clone(), 30, 80); scene.fog.color.copy(c);
    const p = [Math.cos(a) * 35, Math.sin(a) * 35 + 1, 14]; sun.current.position.set(...p); sunM.current.position.set(...p);
    sun.current.intensity = day * 1.1; amb.current.intensity = 0.22 + 0.6 * day; l1.current.intensity = l2.current.intensity = night * 14;
  });
  return (<>
    <ambientLight ref={amb} /><directionalLight ref={sun} color="#fff2d6" />
    <mesh ref={sunM}><sphereGeometry args={[2, 8, 8]} /><meshBasicMaterial color="#ffe9a8" fog={false} /></mesh>
    <pointLight ref={l1} position={[0, 2.6, 1.5]} color="#ffcf8a" distance={9} />
    <pointLight ref={l2} position={[0, 2.6, -3]} color="#ffcf8a" distance={9} />
  </>);
}
