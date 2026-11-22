#!/usr/bin/env python3
"""Validasi update.zip lalu susun hasilnya di folder staging (repo + overlay ZIP).
Pemakaian: apply_update.py update.zip staging"""
import json, os, pathlib, re, shutil, sys, zipfile

PROTECTED = ('.git/', '.github/', 'scripts/', 'node_modules/', 'staging/', 'update.zip')
REQUIRED = ['package.json', 'index.html', 'vite.config.js', 'src/main.jsx', 'src/App.jsx']
MAX_BYTES = 200 * 1024 * 1024
def fail(m): print(f'::error::{m}'); sys.exit(1)
def info(m): print(m, flush=True)

zp, out = sys.argv[1], pathlib.Path(sys.argv[2]).resolve()
if not os.path.isfile(zp): fail('update.zip tidak ditemukan di root repository.')
try: z = zipfile.ZipFile(zp)
except zipfile.BadZipFile: fail('update.zip bukan ZIP valid / rusak.')
bad = z.testzip()
if bad: fail(f'Integritas ZIP gagal pada file: {bad}')

members, total = [], 0
for i in z.infolist():
    n = i.filename.replace('\\', '/')
    p = pathlib.PurePosixPath(n)
    if n.startswith('/') or '..' in p.parts or re.match(r'^[A-Za-z]:', n): fail(f'Path berbahaya ditolak: {n}')
    if (i.external_attr >> 16) & 0o170000 == 0o120000: fail(f'Symlink ditolak: {n}')
    total += i.file_size
    if total > MAX_BYTES: fail('Ukuran ZIP terlalu besar (>200MB setelah ekstraksi).')
    if i.is_dir() or n.startswith('__MACOSX/') or p.name == '.DS_Store': continue
    if any(n == x or n.startswith(x) for x in PROTECTED if x != 'update.zip') or n == 'update.zip':
        print(f'::warning::File dilindungi, dilewati: {n}'); continue
    members.append((i, n))
names = [n for _, n in members]
if not names: fail('ZIP kosong.')
if 'package.json' not in names:
    tops = {n.split('/')[0] for n in names}
    hint = f' ZIP tampaknya dibungkus folder "{next(iter(tops))}/". Kompres ISI folder, bukan foldernya.' if len(tops) == 1 else ''
    fail('package.json tidak ada di root ZIP.' + hint)

out_parent = out.parent
if out.exists(): shutil.rmtree(out)
shutil.copytree('.', out, ignore=shutil.ignore_patterns('.git', 'node_modules', 'dist', 'staging', 'update.zip'))
old = json.load(open(out / 'package.json'))
for i, n in members:
    dest = (out / n).resolve()
    if out not in dest.parents: fail(f'Path keluar dari project: {n}')
    dest.parent.mkdir(parents=True, exist_ok=True)
    with z.open(i) as s, open(dest, 'wb') as d: shutil.copyfileobj(s, d)
for r in REQUIRED:
    if not (out / r).is_file(): fail(f'File wajib tidak ada setelah update: {r}')
new = json.load(open(out / 'package.json'))
if new.get('name') != 'abah-lalas-family': fail('package.json: name harus "abah-lalas-family".')
if new.get('abah', {}).get('updateFormat') != 1: fail('Versi format update tidak kompatibel (butuh abah.updateFormat = 1).')
info(f'Versi sebelumnya: {old.get("version")}  ->  versi baru: {new.get("version")}')
info(f'{len(members)} file diterapkan ke staging.')
