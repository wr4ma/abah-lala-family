import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// VITE_BASE diisi workflow (/nama-repo/). Lokal: './'
export default defineConfig({ base: process.env.VITE_BASE || './', plugins: [react()], build: { chunkSizeWarningLimit: 1500 } });
