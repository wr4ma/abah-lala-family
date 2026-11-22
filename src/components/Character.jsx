import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
const B = ({ p, s, c }) => (<mesh position={p}><boxGeometry args={s} /><meshStandardMaterial color={c} /></mesh>);
// Karakter blocky ala Roblox. Props: color (baju), pants, skin, hair, longHair
export default function Character({ color = '#c9824b', pants = '#3b4a6b', skin = '#f1c9a0', hair = '#2b1d14', longHair = false, anim }) {
  const body = useRef(), la = useRef(), ra = useRef(), ll = useRef(), rl = useRef(), t = useRef(0);
  useFrame((_, dt) => {
    const a = anim.current; t.current += dt * (a.walking ? 9 : 1.5);
    const sw = a.walking ? Math.sin(t.current) * 0.7 : 0, idle = a.walking || a.sitting ? 0 : Math.sin(t.current) * 0.05;
    ll.current.rotation.x = a.sitting ? -1.5 : sw; rl.current.rotation.x = a.sitting ? -1.5 : -sw;
    la.current.rotation.x = a.sitting ? -0.6 : -sw + idle; ra.current.rotation.x = a.sitting ? -0.6 : sw - idle;
    body.current.position.y = (a.sitting ? -0.35 : 0) + (a.walking ? Math.abs(Math.sin(t.current)) * 0.04 : 0);
  });
  const arm = (ref, x) => (<group ref={ref} position={[x, 1.45, 0]}><B p={[0, -0.2, 0]} s={[0.27, 0.4, 0.27]} c={color} /><B p={[0, -0.575, 0]} s={[0.27, 0.35, 0.27]} c={skin} /></group>);
  const leg = (ref, x) => (<group ref={ref} position={[x, 0.7, 0]}><B p={[0, -0.35, 0]} s={[0.35, 0.7, 0.35]} c={pants} /></group>);
  return (<group scale={0.9}><group ref={body}>
    <B p={[0, 1.075, 0]} s={[0.75, 0.75, 0.4]} c={color} />
    {arm(la, -0.52)}{arm(ra, 0.52)}{leg(ll, -0.19)}{leg(rl, 0.19)}
    <B p={[0, 1.7, 0]} s={[0.5, 0.5, 0.5]} c={skin} />
    {/* wajah (menghadap +z) */}
    <B p={[-0.12, 1.75, 0.255]} s={[0.07, 0.1, 0.02]} c="#1a1a1a" /><B p={[0.12, 1.75, 0.255]} s={[0.07, 0.1, 0.02]} c="#1a1a1a" />
    <B p={[0, 1.6, 0.255]} s={[0.18, 0.03, 0.02]} c="#6b2d2d" />
    <B p={[-0.11, 1.62, 0.255]} s={[0.03, 0.04, 0.02]} c="#6b2d2d" /><B p={[0.11, 1.62, 0.255]} s={[0.03, 0.04, 0.02]} c="#6b2d2d" />
    {/* rambut */}
    <B p={[0, 2.01, 0]} s={[0.56, 0.12, 0.56]} c={hair} />
    <B p={[0, 1.93, 0.25]} s={[0.56, 0.1, 0.06]} c={hair} />
    <B p={[-0.27, 1.85, 0]} s={[0.06, 0.3, 0.46]} c={hair} /><B p={[0.27, 1.85, 0]} s={[0.06, 0.3, 0.46]} c={hair} />
    <B p={[0, longHair ? 1.55 : 1.82, -0.26]} s={[0.56, longHair ? 0.9 : 0.35, 0.08]} c={hair} />
  </group></group>);
}
