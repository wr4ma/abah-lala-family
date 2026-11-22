import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
const B = ({ p, s, c }) => (<mesh position={p}><boxGeometry args={s} /><meshStandardMaterial color={c} /></mesh>);
/* Karakter blocky ala Roblox, dapat dikonfigurasi dari data:
   color(baju) pants(bawahan) bottom: pants|wide|shorts|skirt|longskirt  sleeves: short|long
   skin hair hairStyle: short|long|bob|tail|none  shoes socks
   aksesori: cap, vest, tie, hood(true), hijab, inner, belt(true) */
export default function Character({ color = '#c9824b', pants = '#3b4a6b', bottom = 'pants', sleeves = 'short', skin = '#e3b58c', hair = '#2b1d14', hairStyle = 'short', shoes = '#eeeeee', socks, cap, vest, tie, hood, hijab, inner, belt, anim }) {
  const body = useRef(), la = useRef(), ra = useRef(), ll = useRef(), rl = useRef(), t = useRef(0);
  useFrame((_, dt) => {
    const a = anim.current; t.current += dt * (a.walking ? 9 : 1.5);
    const sw = a.walking ? Math.sin(t.current) * 0.7 : 0, idle = a.walking || a.sitting ? 0 : Math.sin(t.current) * 0.05;
    ll.current.rotation.x = a.sitting ? -1.5 : sw; rl.current.rotation.x = a.sitting ? -1.5 : -sw;
    la.current.rotation.x = a.sitting ? -0.6 : -sw + idle; ra.current.rotation.x = a.sitting ? -0.6 : sw - idle;
    body.current.position.y = (a.sitting ? -0.35 : 0) + (a.walking ? Math.abs(Math.sin(t.current)) * 0.04 : 0);
  });
  const sl = sleeves === 'long' ? 0.65 : 0.4, wide = bottom === 'wide', lx = wide ? 0.22 : 0.19, lw = wide ? 0.42 : 0.35;
  const arm = (ref, x) => (<group ref={ref} position={[x, 1.45, 0]}><B p={[0, -sl / 2, 0]} s={[0.27, sl, 0.27]} c={color} /><B p={[0, -(sl + 0.75) / 2, 0]} s={[0.27, 0.75 - sl, 0.27]} c={skin} /></group>);
  const leg = (ref, x) => (<group ref={ref} position={[x, 0.7, 0]}>
    {(bottom === 'pants' || wide) && <B p={[0, -0.35, 0]} s={[lw, 0.7, lw]} c={pants} />}
    {bottom === 'shorts' && <><B p={[0, -0.19, 0]} s={[0.37, 0.38, 0.37]} c={pants} /><B p={[0, socks ? -0.44 : -0.53, 0]} s={[0.33, socks ? 0.12 : 0.3, 0.33]} c={skin} /></>}
    {(bottom === 'skirt' || bottom === 'longskirt') && <B p={[0, -0.35, 0]} s={[0.3, 0.7, 0.3]} c={skin} />}
    {socks && bottom !== 'pants' && !wide && <B p={[0, -0.6, 0]} s={[0.36, 0.2, 0.36]} c={socks} />}
    <B p={[0, -0.64, 0.06]} s={[lw + 0.02, 0.12, 0.44]} c={shoes} />
  </group>);
  const noTop = cap || hijab;
  return (<group scale={0.9}><group ref={body}>
    <B p={[0, 1.075, 0]} s={[0.75, 0.75, 0.4]} c={color} />
    {vest && <><B p={[0, 1.12, 0]} s={[0.78, 0.6, 0.42]} c={vest} /><B p={[0, 1.15, 0]} s={[0.79, 0.06, 0.43]} c="#d9d9d9" /></>}
    {tie && <B p={[0, 1.25, 0.21]} s={[0.1, 0.4, 0.02]} c={tie} />}
    {inner && <B p={[0, 1.12, 0.211]} s={[0.28, 0.5, 0.02]} c={inner} />}
    {hood && <B p={[0, 1.5, -0.25]} s={[0.5, 0.25, 0.2]} c={color} />}
    {belt && <B p={[0, 0.73, 0]} s={[0.77, 0.07, 0.42]} c="#1a1a1a" />}
    {bottom === 'skirt' && <B p={[0, 0.62, 0]} s={[0.84, 0.3, 0.48]} c={pants} />}
    {bottom === 'longskirt' && <B p={[0, 0.38, 0]} s={[0.86, 0.68, 0.5]} c={pants} />}
    {arm(la, -0.52)}{arm(ra, 0.52)}{leg(ll, -lx)}{leg(rl, lx)}
    <B p={[0, 1.7, 0]} s={[0.5, 0.5, 0.5]} c={skin} />
    <B p={[-0.12, 1.75, 0.255]} s={[0.07, 0.1, 0.02]} c="#1a1a1a" /><B p={[0.12, 1.75, 0.255]} s={[0.07, 0.1, 0.02]} c="#1a1a1a" />
    <B p={[0, 1.6, 0.255]} s={[0.18, 0.03, 0.02]} c="#6b2d2d" />
    <B p={[-0.11, 1.62, 0.255]} s={[0.03, 0.04, 0.02]} c="#6b2d2d" /><B p={[0.11, 1.62, 0.255]} s={[0.03, 0.04, 0.02]} c="#6b2d2d" />
    {hijab ? (<>
      <B p={[0, 2.0, 0]} s={[0.6, 0.14, 0.6]} c={hijab} /><B p={[0, 1.72, -0.27]} s={[0.6, 0.6, 0.1]} c={hijab} />
      <B p={[-0.29, 1.7, 0]} s={[0.08, 0.56, 0.52]} c={hijab} /><B p={[0.29, 1.7, 0]} s={[0.08, 0.56, 0.52]} c={hijab} />
      <B p={[0, 1.93, 0.27]} s={[0.6, 0.1, 0.06]} c={hijab} /><B p={[0, 1.44, 0.02]} s={[0.62, 0.12, 0.56]} c={hijab} />
    </>) : hairStyle !== 'none' && (<>
      {!noTop && <><B p={[0, 2.01, 0]} s={[0.56, 0.12, 0.56]} c={hair} /><B p={[0, 1.93, 0.25]} s={[0.56, 0.1, 0.06]} c={hair} /></>}
      <B p={[-0.27, hairStyle === 'long' ? 1.7 : 1.85, 0]} s={[0.06, hairStyle === 'long' ? 0.5 : 0.3, 0.46]} c={hair} /><B p={[0.27, hairStyle === 'long' ? 1.7 : 1.85, 0]} s={[0.06, hairStyle === 'long' ? 0.5 : 0.3, 0.46]} c={hair} />
      <B p={[0, hairStyle === 'long' ? 1.55 : hairStyle === 'bob' ? 1.68 : 1.82, -0.26]} s={[0.56, hairStyle === 'long' ? 0.9 : hairStyle === 'bob' ? 0.55 : 0.35, 0.08]} c={hair} />
      {hairStyle === 'tail' && <B p={[0, 1.75, -0.36]} s={[0.15, 0.45, 0.15]} c={hair} />}
    </>)}
    {cap && <><B p={[0, 1.99, 0]} s={[0.57, 0.14, 0.57]} c={cap} /><B p={[0, 1.93, 0.36]} s={[0.5, 0.04, 0.26]} c={cap} /></>}
  </group></group>);
}
