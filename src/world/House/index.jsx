import house from '../../data/world/house.json';
const Box = ({ p, s, c }) => (<mesh position={p}><boxGeometry args={s} /><meshStandardMaterial color={c} flatShading /></mesh>);
const Wall = ({ w: [a, b, c, d], h, color }) => (<Box p={[(a + c) / 2, h / 2, (b + d) / 2]} s={[Math.abs(c - a) || 0.2, h, Math.abs(d - b) || 0.2]} c={color} />);
export default function House() {
  return (<group>
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#8fb56a" /></mesh>
    {house.rooms.map((r) => (<mesh key={r.id} rotation-x={-Math.PI / 2} position={[(r.x0 + r.x1) / 2, 0.01, (r.z0 + r.z1) / 2]}><planeGeometry args={[r.x1 - r.x0, r.z1 - r.z0]} /><meshStandardMaterial color={r.color} /></mesh>))}
    {house.walls.map((w, i) => <Wall key={'w' + i} w={w} h={3} color="#f1e4cf" />)}
    {house.fence.map((w, i) => <Wall key={'f' + i} w={w} h={1} color="#a9794a" />)}
    {house.furniture.map((f) => <Box key={f.id} p={[f.pos[0], f.size[1] / 2, f.pos[1]]} s={f.size} c={f.color} />)}
    {house.decor.map((d, i) => (<group key={i} position={[d.pos[0], 0, d.pos[1]]}>
      <mesh position={[0, 1, 0]}><cylinderGeometry args={[0.2, 0.3, 2, 6]} /><meshStandardMaterial color="#6b4a2b" /></mesh>
      <mesh position={[0, 2.8, 0]}><icosahedronGeometry args={[1.4, 0]} /><meshStandardMaterial color="#4f8a3c" flatShading /></mesh></group>))}
  </group>);
}
