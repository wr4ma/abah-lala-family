import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { input, playerState } from '../systems/input';
import { clock, fmt } from '../systems/TimeSystem/clock';
import { saveState, loadState, resetData } from '../systems/SaveSystem';
import { entryAt, activities } from '../systems/RoutineSystem';
import chars from '../data/characters/npcs.json';
import routines from '../data/routines/demo.json';
import house from '../data/world/house.json';

function Joystick() {
  const [k, setK] = useState({ x: 0, y: 0 }), id = useRef(null), base = useRef();
  const upd = (e) => { const r = base.current.getBoundingClientRect(), m0 = r.width / 2; let dx = e.clientX - (r.left + m0), dy = e.clientY - (r.top + m0); const m = Math.hypot(dx, dy); if (m > m0) { dx *= m0 / m; dy *= m0 / m; } setK({ x: dx, y: dy }); input.mx = dx / m0; input.mz = -dy / m0; };
  const end = () => { id.current = null; setK({ x: 0, y: 0 }); input.mx = input.mz = 0; };
  return (<div ref={base} className="joy" onPointerDown={(e) => { id.current = e.pointerId; e.currentTarget.setPointerCapture(e.pointerId); upd(e); }} onPointerMove={(e) => id.current === e.pointerId && upd(e)} onPointerUp={end} onPointerCancel={end}><div className="knob" style={{ transform: `translate(${k.x}px,${k.y}px)` }} /></div>);
}
function Look() {
  const l = useRef(null); const end = () => { l.current = null; };
  return (<div className="look" onPointerDown={(e) => { l.current = { id: e.pointerId, x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={(e) => { const p = l.current; if (!p || p.id !== e.pointerId) return; const s = useStore.getState().sens * 0.005; input.yaw -= (e.clientX - p.x) * s; input.pitch = Math.max(0.05, Math.min(1.2, input.pitch + (e.clientY - p.y) * s)); p.x = e.clientX; p.y = e.clientY; }}
    onPointerUp={end} onPointerCancel={end} />);
}
const Slider = ({ label, v, min, max, step, on }) => (<label className="row">{label}<input type="range" min={min} max={max} step={step} value={v} onChange={(e) => on(+e.target.value)} /></label>);
function Settings({ back }) {
  const s = useStore(); const [, f] = useState(0); const re = () => f((n) => n + 1);
  return (<div className="panel"><h2>Settings</h2>
    <Slider label="Sensitivitas kamera" v={s.sens} min={0.3} max={2.5} step={0.1} on={(v) => useStore.setState({ sens: v })} />
    <Slider label="Jarak kamera" v={s.camDist} min={3} max={10} step={0.5} on={(v) => useStore.setState({ camDist: v })} />
    <Slider label="Kecepatan waktu" v={clock.speed} min={0} max={1} step={0.01} on={(v) => { clock.speed = v; re(); }} />
    <label className="row">Grafis<select value={s.quality} onChange={(e) => s.setQuality(e.target.value)}><option value="auto">Auto</option><option value="low">Rendah</option><option value="high">Tinggi</option></select></label>
    <p className="hint">Volume audio: belum ada audio (lihat README).</p>
    <button onClick={async () => { if (confirm('Hapus semua data lokal?')) { await resetData(); location.reload(); } }}>Reset data lokal</button>
    <button className="primary" onClick={back}>Kembali</button></div>);
}
export default function UI() {
  const s = useStore();
  const enter = async () => { await loadState(); if (playerState.x === 0 && playerState.z === 9) [playerState.x, playerState.z] = house.start; useStore.setState({ screen: 'game', paused: false, overlay: null }); };
  if (s.screen === 'welcome') return (<div className="welcome">
    {s.overlay === 'settings' ? <Settings back={() => useStore.setState({ overlay: null })} /> : (<>
      <h1>ABAH LALA’S<br />FAMILY</h1><p className="tag">“A place where memories never fade.”</p>
      <button className="primary" onClick={enter}>Enter World</button>
      <button onClick={() => useStore.setState({ overlay: 'settings' })}>Settings</button></>)}</div>);
  const pause = (o) => { useStore.setState({ paused: true, overlay: o }); saveState(); };
  const np = s.nearNpc && chars.npcs.find((n) => n.id === s.nearNpc);
  return (<>
    <Look /><Joystick />
    <div className="hud"><span className="clock">{fmt(s.hour)}</span><span><button onClick={() => pause('settings')}>⚙</button><button onClick={() => pause('pause')}>❚❚</button></span></div>
    {np && !s.dialog && <button className="act" onClick={() => { const e = entryAt(routines.routines[np.id], clock.hour); useStore.setState({ dialog: `${np.name}: “${np.line}”\n(sedang ${activities[e.activity].label})` }); }}>Sapa</button>}
    {s.dialog && <div className="dialog" onClick={() => useStore.setState({ dialog: null })}>{s.dialog}</div>}
    {s.overlay && <div className="overlay">{s.overlay === 'settings' ? <Settings back={() => useStore.setState({ overlay: 'pause' })} /> : (<div className="panel"><h2>Pause</h2>
      <button className="primary" onClick={() => useStore.setState({ paused: false, overlay: null })}>Resume</button>
      <button onClick={() => useStore.setState({ overlay: 'settings' })}>Audio &amp; Graphics Settings</button>
      <button onClick={async () => { await saveState(); alert('Tersimpan'); }}>Save Progress</button>
      <button onClick={async () => { await saveState(); useStore.setState({ screen: 'welcome', paused: false, overlay: null }); }}>Return to Main Menu</button></div>)}</div>}
  </>);
}
