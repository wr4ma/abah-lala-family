import { Component, Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
const M = ({ c, rough = 0.85, ds }) => <meshStandardMaterial color={c} roughness={rough} side={ds ? THREE.DoubleSide : THREE.FrontSide} />;
const Cyl = ({ p, r0, r1, h, c, sz = 1, seg = 18, rot }) => (<mesh position={p} rotation={rot} scale={[1, 1, sz]}><cylinderGeometry args={[r0, r1, h, seg]} /><M c={c} /></mesh>);
const Cap = ({ p, r, l, c, s, rot }) => (<mesh position={p} rotation={rot} scale={s}><capsuleGeometry args={[r, l, 4, 10]} /><M c={c} /></mesh>);
const Sph = ({ p, r, c, s, rough }) => (<mesh position={p} scale={s}><sphereGeometry args={[r, 16, 12]} /><M c={c} rough={rough} /></mesh>);
const Box = ({ p, s, c, rot }) => (<mesh position={p} rotation={rot}><boxGeometry args={s} /><M c={c} /></mesh>);
const PI = Math.PI;

/* Karakter 3D stylized semi-realistis (primitive halus). Props gaya:
   color(baju) pants bottom:pants|wide|shorts|skirt|longskirt sleeves:short|long skin hair
   hairStyle:short|long|bob|tail|none shoes socks cap vest tie hood hijab inner belt */
function Body({ color = '#c9824b', pants = '#3b4a6b', bottom = 'pants', sleeves = 'short', skin = '#d9a577', hair = '#1a1410', hairStyle = 'short', shoes = '#eeeeee', socks, cap, vest, tie, hood, hijab, inner, belt, anim }) {
  const body = useRef(), la = useRef(), ra = useRef(), ll = useRef(), rl = useRef(), t = useRef(0);
  useFrame((_, dt) => {
    const a = anim.current; t.current += dt * (a.walking ? 8 : 1.5);
    const sw = a.walking ? Math.sin(t.current) * 0.6 : 0, idle = a.walking || a.sitting ? 0 : Math.sin(t.current) * 0.03;
    ll.current.rotation.x = a.sitting ? -1.5 : sw; rl.current.rotation.x = a.sitting ? -1.5 : -sw;
    la.current.rotation.x = a.sitting ? -0.5 : -sw * 0.9 + idle; ra.current.rotation.x = a.sitting ? -0.5 : sw * 0.9 - idle;
    body.current.position.y = (a.sitting ? -0.4 : 0) + (a.walking ? Math.abs(Math.sin(t.current)) * 0.03 : 0);
  });
  const long = sleeves === 'long', wide = bottom === 'wide', skirtish = bottom === 'skirt' || bottom === 'longskirt';
  const dark = useMemo(() => '#' + new THREE.Color(color).multiplyScalar(0.8).getHexString(), [color]);
  const arm = (ref, s) => (<group ref={ref} position={[s * 0.215, 1.42, 0]}><group rotation={[0, 0, s * 0.05]}>
    <Sph p={[0, 0, 0]} r={0.062} c={color} />
    {long ? (<><Cap p={[0, -0.15, 0]} r={0.052} l={0.2} c={color} /><Cap p={[0, -0.4, 0]} r={0.045} l={0.2} c={color} /></>)
      : (<><Cap p={[0, -0.07, 0]} r={0.056} l={0.06} c={color} /><Cap p={[0, -0.3, 0]} r={0.045} l={0.3} c={skin} /></>)}
    <Sph p={[0, -0.59, 0]} r={0.048} c={skin} s={[1, 1.2, 0.8]} /></group></group>);
  const leg = (ref, x) => (<group ref={ref} position={[x, 0.85, 0]}>
    {(bottom === 'pants' || wide) && <Cyl p={[0, -0.4, 0]} r0={wide ? 0.115 : 0.09} r1={wide ? 0.135 : 0.068} h={0.8} c={pants} seg={14} />}
    {bottom === 'shorts' && <><Cyl p={[0, -0.19, 0]} r0={0.1} r1={0.092} h={0.38} c={pants} seg={14} /><Cyl p={[0, -0.6, 0]} r0={0.065} r1={0.06} h={0.45} c={skin} seg={12} /></>}
    {skirtish && <Cyl p={[0, -0.4, 0]} r0={0.085} r1={0.062} h={0.8} c={skin} seg={12} />}
    {socks && bottom !== 'pants' && !wide && <Cyl p={[0, -0.7, 0]} r0={0.066} r1={0.066} h={0.2} c={socks} seg={12} />}
    <Cap p={[0, -0.81, 0.05]} r={0.045} l={0.12} c={shoes} s={[1.2, 1, 0.85]} rot={[PI / 2, 0, 0]} />
  </group>);
  const S = [0.105, 0.125, 0.11];
  const sideTheta = { short: 1.9, tail: 1.9, bob: 2.3, long: 2.6 }[hairStyle] || 1.9;
  return (<group ref={body}>
    {/* torso & bawahan */}
    <Cyl p={[0, 1.15, 0]} r0={0.2} r1={0.165} h={0.6} c={color} sz={0.6} />
    {bottom !== 'longskirt' && <Cyl p={[0, 0.84, 0]} r0={0.17} r1={0.165} h={0.12} c={pants} sz={0.62} />}
    {bottom === 'skirt' && <Cyl p={[0, 0.7, 0]} r0={0.18} r1={0.27} h={0.3} c={pants} sz={0.9} seg={28} />}
    {bottom === 'longskirt' && <Cyl p={[0, 0.45, 0]} r0={0.185} r1={0.3} h={0.85} c={pants} sz={0.85} seg={28} />}
    {belt && <Cyl p={[0, 0.87, 0]} r0={0.172} r1={0.172} h={0.04} c="#1a1a1a" sz={0.62} />}
    {vest && <><Cyl p={[0, 1.14, 0]} r0={0.212} r1={0.178} h={0.52} c={vest} sz={0.64} /><Cyl p={[0, 1.22, 0]} r0={0.206} r1={0.206} h={0.03} c="#d4d4d4" sz={0.64} /><Cyl p={[0, 1.0, 0]} r0={0.194} r1={0.194} h={0.03} c="#d4d4d4" sz={0.64} /></>}
    {tie && <><Box p={[0, 1.25, 0.121]} s={[0.035, 0.32, 0.012]} c={tie} /><Box p={[0, 1.4, 0.121]} s={[0.045, 0.04, 0.02]} c={tie} /></>}
    {inner && <Box p={[0, 1.2, 0.119]} s={[0.1, 0.36, 0.01]} c={inner} />}
    {hood && <><Sph p={[0, 1.46, -0.1]} r={0.1} c={color} s={[1.2, 0.7, 0.8]} /><Box p={[0, 0.98, 0.112]} s={[0.2, 0.1, 0.01]} c={dark} /></>}
    <Cyl p={[0, 1.5, 0]} r0={0.042} r1={0.046} h={0.1} c={skin} seg={12} />
    {arm(la, -1)}{arm(ra, 1)}{leg(ll, -0.095)}{leg(rl, 0.095)}
    {/* kepala */}
    <group position={[0, 1.6, 0]}>
      <mesh scale={S}><sphereGeometry args={[1, 24, 18]} /><M c={skin} rough={0.7} /></mesh>
      {[-1, 1].map((s) => (<group key={s}>
        <Sph p={[s * 0.038, 0.012, 0.098]} r={0.013} c="#1b1512" s={[1, 1.4, 0.6]} />
        <Box p={[s * 0.04, 0.045, 0.1]} s={[0.04, 0.008, 0.008]} c={hair} rot={[0, 0, -s * 0.1]} />
        <Sph p={[s * 0.105, 0, 0]} r={0.02} c={skin} s={[0.5, 1, 0.7]} /></group>))}
      <Sph p={[0, -0.012, 0.108]} r={0.012} c={skin} />
      <Box p={[0, -0.052, 0.098]} s={[0.034, 0.006, 0.006]} c="#8f4c47" />
      <group scale={S}>
        {hairStyle !== 'none' && !hijab && (<>
          {!cap && <mesh><sphereGeometry args={[1.06, 24, 14, 0, PI * 2, 0, 1.0]} /><M c={hair} /></mesh>}
          <mesh><sphereGeometry args={[1.07, 24, 16, PI / 2 + 1.2, PI * 2 - 2.4, 0, sideTheta]} /><M c={hair} ds /></mesh></>)}
        {cap && <mesh><sphereGeometry args={[1.1, 24, 14, 0, PI * 2, 0, 1.35]} /><M c={cap} /></mesh>}
        {hijab && (<><mesh><sphereGeometry args={[1.12, 24, 14, 0, PI * 2, 0, 0.85]} /><M c={hijab} /></mesh>
          <mesh><sphereGeometry args={[1.12, 24, 16, PI / 2 + 0.8, PI * 2 - 1.6, 0, 2.6]} /><M c={hijab} ds /></mesh></>)}
      </group>
      {cap && <mesh position={[0, 0.03, 0.075]} rotation={[0.15, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.01, 16, 1, false, -PI / 2, PI]} /><M c={cap} /></mesh>}
      {hijab && <Cyl p={[0, -0.27, 0]} r0={0.12} r1={0.3} h={0.3} c={hijab} sz={0.85} seg={24} />}
      {!hijab && hairStyle === 'long' && (<><Box p={[0, -0.2, -0.085]} s={[0.23, 0.32, 0.05]} c={hair} />{[-1, 1].map((s) => <Box key={s} p={[s * 0.1, -0.17, 0]} s={[0.035, 0.28, 0.1]} c={hair} />)}</>)}
      {!hijab && hairStyle === 'bob' && <Box p={[0, -0.1, -0.09]} s={[0.2, 0.14, 0.05]} c={hair} />}
      {!hijab && hairStyle === 'tail' && <Cap p={[0, -0.02, -0.14]} r={0.03} l={0.2} c={hair} rot={[-0.5, 0, 0]} />}
    </group>
  </group>);
}
class Boundary extends Component {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}
const Glb = ({ url }) => { const { scene } = useGLTF(url); return <primitive object={scene.clone()} />; };
// Jika `model` (path GLB relatif ke public/, mis. "assets/characters/abah.glb") diisi, dipakai; jika gagal -> kembali ke model prosedural.
export default function Character(props) {
  if (!props.model) return <Body {...props} />;
  const fb = <Body {...props} />;
  return (<Boundary fallback={fb}><Suspense fallback={fb}><Glb url={import.meta.env.BASE_URL + props.model} /></Suspense></Boundary>);
}
