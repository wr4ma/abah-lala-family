// hour: 0-24. speed: jam game per detik nyata (0.05 => 1 hari = 8 menit)
export const clock = { hour: 8, speed: 0.05 };
export const fmt = (h) => String(Math.floor(h) % 24).padStart(2, '0') + ':' + String(Math.floor((h % 1) * 60)).padStart(2, '0');
