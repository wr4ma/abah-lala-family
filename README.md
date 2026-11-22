# ABAH LALA’S FAMILY
*A place where memories never fade.* — prototype 3D (React + Vite + React Three Fiber) untuk browser mobile.

## Jalankan lokal
`npm install && npm run dev` · build: `npm run build`

## Deploy GitHub Pages
1. Buat repo, push seluruh isi folder ini ke branch `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Setiap push ke `main` men-deploy otomatis (`deploy.yml`). Base path otomatis `/<nama-repo>/`.

## Update lewat satu file `update.zip`
1. Siapkan source terbaru; naikkan `version` di `package.json`.
2. Kompres **ISI** project (bukan folder pembungkusnya) menjadi `update.zip`.
3. Replace `update.zip` di root repo (upload via web GitHub) → commit.
4. Workflow **Apply update.zip** berjalan: validasi ZIP → staging → `npm install` → build → (jika sukses) commit ke repo → deploy.

Isi ZIP:
```
update.zip
├── public/  ├── src/  ├── index.html  ├── package.json  └── vite.config.js
```
Aturan: file bernama sama diganti, file baru ditambah, file yang tidak ada di ZIP **tidak dihapus**. `.git`, `.github`, `scripts`, `node_modules`, `update.zip` dilindungi (dilewati + peringatan). Path `..`, absolut, dan symlink ditolak. `package.json` wajib `name: "abah-lalas-family"` dan `abah.updateFormat: 1`. Jika gagal di tahap mana pun, tidak ada commit dan tidak ada deploy; situs lama tetap hidup. Log versi lama → baru tampil di langkah “Validasi ZIP”.

## Troubleshooting
- *package.json tidak ada di root ZIP* → ZIP dibungkus folder; kompres isinya.
- *Build gagal* → baca error di langkah “Build (staging)”; perbaiki lalu upload ZIP baru.
- *Halaman kosong/404 aset* → pastikan Pages Source = GitHub Actions.
- Pertama kali setelah push awal, workflow update ikut berjalan (update.zip bawaan = source yang sama).

## Mengganti aset/data
Semua data di `src/data/`: `world/house.json` (dinding, ruangan, furniture, node jalur NPC), `characters/npcs.json`, `routines/demo.json` (rutinitas **demo**, bukan fakta tentang orang asli). Taruh GLB/tekstur di `public/assets/*` (belum dipakai kode; placeholder = primitive 3D).

## Belum ada di prototype ini
Audio (Howler terpasang, belum ada aset/sistem), pemuatan GLB & LOD, atap rumah, tekstur. Tidak diuji build di lingkungan pembuatan (tanpa internet).
