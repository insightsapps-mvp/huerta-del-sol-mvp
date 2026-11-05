import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...i: ClassValue[]) => twMerge(clsx(i));

/** $ 12.345 (pesos, sin decimales) */
export const ars = (n: number) => '$ ' + Math.round(n).toLocaleString('es-AR');

/** 1,5 kg · 2 atados · 1 bandeja */
export function qtyLabel(q: number, unidad: string) {
  const n = Number.isInteger(q) ? String(q) : q.toLocaleString('es-AR', { maximumFractionDigits: 2 });
  if (unidad === 'kg') return `${n} kg`;
  const plural: Record<string, string> = { unidad: 'unidades', atado: 'atados', bandeja: 'bandejas', bolsón: 'bolsones', bulto: 'bultos' };
  return `${n} ${q === 1 ? unidad : plural[unidad] ?? unidad}`;
}

export function downloadCSV(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export const photo = (slug: string) => `/img/p/${slug}.webp`;
