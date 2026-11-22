import { create } from 'zustand';
const dprFor = (q) => (q === 'low' ? 0.75 : q === 'high' ? 1.5 : 1);
export const useStore = create((set) => ({
  screen: 'welcome', overlay: null, paused: false,
  hour: 8, sens: 1, camDist: 6, quality: 'auto', dpr: 1,
  nearNpc: null, dialog: null,
  setQuality: (q) => set({ quality: q, dpr: dprFor(q) }),
}));
