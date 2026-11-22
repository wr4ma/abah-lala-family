import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useStore } from './store/useStore';
import Environment from './world/Environment';
import House from './world/House';
import Player from './components/Player';
import NPC from './components/NPC';
import UI from './ui/UI';
import { saveState } from './systems/SaveSystem';
import chars from './data/characters/npcs.json';
export default function App() {
  const screen = useStore((s) => s.screen), dpr = useStore((s) => s.dpr);
  useEffect(() => { if (screen !== 'game') return; const t = setInterval(saveState, 10000); return () => clearInterval(t); }, [screen]);
  const adapt = (d) => useStore.getState().quality === 'auto' && useStore.setState({ dpr: d });
  return (<>
    {screen === 'game' && (<Canvas dpr={dpr} camera={{ fov: 60, near: 0.1, far: 120 }} gl={{ antialias: false, powerPreference: 'high-performance' }}>
      <PerformanceMonitor onDecline={() => adapt(0.75)} onIncline={() => adapt(1.25)} />
      <Environment /><House /><Player />
      {chars.npcs.map((n) => <NPC key={n.id} cfg={n} />)}
    </Canvas>)}
    <UI />
  </>);
}
