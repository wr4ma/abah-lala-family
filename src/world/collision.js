import house from '../data/world/house.json';
const T = 0.12;
const seg = (h) => ([a, b, c, d]) => ({ x0: Math.min(a, c) - T, x1: Math.max(a, c) + T, z0: Math.min(b, d) - T, z1: Math.max(b, d) + T, h });
export const boxes = [
  ...house.walls.map(seg(3)), ...house.fence.map(seg(1)),
  ...house.furniture.filter((f) => f.solid).map((f) => ({ x0: f.pos[0] - f.size[0] / 2, x1: f.pos[0] + f.size[0] / 2, z0: f.pos[1] - f.size[2] / 2, z1: f.pos[1] + f.size[2] / 2, h: f.size[1] })),
];
export function resolve(x, z, r = 0.35) {
  for (const b of boxes) {
    const cx = Math.max(b.x0, Math.min(x, b.x1)), cz = Math.max(b.z0, Math.min(z, b.z1));
    const dx = x - cx, dz = z - cz, d2 = dx * dx + dz * dz;
    if (d2 >= r * r) continue;
    if (d2 > 1e-6) { const d = Math.sqrt(d2); x = cx + (dx / d) * r; z = cz + (dz / d) * r; }
    else { const o = [[x - b.x0, -1, 0], [b.x1 - x, 1, 0], [z - b.z0, 0, -1], [b.z1 - z, 0, 1]].sort((p, q) => p[0] - q[0])[0]; x += o[1] * (o[0] + r); z += o[2] * (o[0] + r); }
  }
  return [x, z];
}
export const camBlocked = (x, y, z) => boxes.some((b) => y < b.h && x > b.x0 - 0.25 && x < b.x1 + 0.25 && z > b.z0 - 0.25 && z < b.z1 + 0.25);
