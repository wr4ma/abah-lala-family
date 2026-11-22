import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// NPC Animation Controller (prosedural): anim.current = {walking, sitting}
export default function Character({ color = '#c9824b', anim }) {
  const body = useRef(), l = useRef(), r = useRef(), t = useRef(0);
  useFrame((_, dt) => {
    const a = anim.current; t.current += dt * (a.walking ? 9 : 0);
    const sw = a.walking ? Math.sin(t.current) * 0.6 : 0;
    l.current.rotation.x = a.sitting ? -1.4 : sw; r.current.rotation.x = a.sitting ? -1.4 : -sw;
    body.current.position.y = (a.sitting ? -0.35 : 0) + (a.walking ? Math.abs(Math.sin(t.current)) * 0.05 : 0);
  });
  const leg = (ref, x) => (<group ref={ref} position={[x, 0.55, 0]}><mesh position={[0, -0.25, 0]}><boxGeometry args={[0.16, 0.5, 0.16]} /><meshStandardMaterial color="#44506b" /></mesh></group>);
  return (<group ref={body}>
    <mesh position={[0, 1, 0]}><capsuleGeometry args={[0.28, 0.6, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[0, 1.65, 0]}><sphereGeometry args={[0.2, 12, 12]} /><meshStandardMaterial color="#f1c9a0" /></mesh>
    {leg(l, -0.13)}{leg(r, 0.13)}
  </group>);
}
