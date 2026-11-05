import { create } from 'zustand';
import { BRAND } from '@/config/brand';
import { PRODUCTS, productBySlug, type Product } from '@/data/products';

export type Mode = 'minorista' | 'mayorista';
type Cart = Record<string, number>;

const ls = {
  get<T>(k: string, fb: T): T {
    try {
      const v = localStorage.getItem(k);
      return v ? (JSON.parse(v) as T) : fb;
    } catch {
      return fb;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* sin storage */
    }
  },
};

interface Toast {
  id: number;
  text: string;
}

interface ShopState {
  mode: Mode;
  carts: Record<Mode, Cart>;
  drawer: boolean;
  toasts: Toast[];
  setMode: (m: Mode) => void;
  setQty: (slug: string, q: number) => void;
  add: (slug: string, q: number) => void;
  clear: () => void;
  openDrawer: (v: boolean) => void;
  toast: (text: string) => void;
}

let tid = 1;
export const useShop = create<ShopState>((set, get) => ({
  mode: ls.get<Mode>('hs_mode', 'minorista'),
  carts: ls.get<Record<Mode, Cart>>('hs_carts', { minorista: {}, mayorista: {} }),
  drawer: false,
  toasts: [],
  setMode: (mode) => {
    ls.set('hs_mode', mode);
    set({ mode });
  },
  setQty: (slug, q) => {
    const { mode, carts } = get();
    const cart = { ...carts[mode] };
    if (q <= 0) delete cart[slug];
    else cart[slug] = Math.round(q * 100) / 100;
    const next = { ...carts, [mode]: cart };
    ls.set('hs_carts', next);
    set({ carts: next });
  },
  add: (slug, q) => get().setQty(slug, (get().carts[get().mode][slug] ?? 0) + q),
  clear: () => {
    const next = { ...get().carts, [get().mode]: {} };
    ls.set('hs_carts', next);
    set({ carts: next });
  },
  openDrawer: (drawer) => set({ drawer }),
  toast: (text) => {
    const id = tid++;
    set({ toasts: [...get().toasts.slice(-2), { id, text }] });
    setTimeout(() => set({ toasts: get().toasts.filter((t) => t.id !== id) }), 3200);
  },
}));

// ───── Precios

/** Precio unitario según el modo (por kg/unidad/atado en minorista, por bulto en mayorista). */
export function unitPrice(p: Product, mode: Mode) {
  return mode === 'mayorista' && p.mayorista ? p.mayorista.precio : p.minorista.precio;
}

/** Descuento por volumen mayorista según la cantidad total de bultos del pedido. */
export function volumeDiscount(totalBultos: number) {
  let d = 0;
  for (const t of BRAND.mayorista.tramos) if (totalBultos >= t.desde) d = t.descuento;
  return d;
}

export interface Line {
  p: Product;
  qty: number;
  price: number;
  subtotal: number;
}

export function cartSummary(cart: Cart, mode: Mode) {
  const lines: Line[] = Object.entries(cart)
    .map(([slug, qty]) => {
      const p = productBySlug(slug);
      if (!p) return null;
      const price = unitPrice(p, mode);
      return { p, qty, price, subtotal: price * qty };
    })
    .filter(Boolean) as Line[];
  const bruto = lines.reduce((s, l) => s + l.subtotal, 0);
  const bultos = mode === 'mayorista' ? lines.reduce((s, l) => s + l.qty, 0) : 0;
  const desc = mode === 'mayorista' ? volumeDiscount(bultos) : 0;
  const descuento = Math.round(bruto * desc);
  const neto = bruto - descuento;
  const items = mode === 'mayorista' ? bultos : lines.length;
  const faltaMinimo = mode === 'mayorista' ? Math.max(0, BRAND.mayorista.pedidoMinimo - neto) : 0;
  const envio = mode === 'mayorista' ? 0 : neto >= BRAND.envio.gratisDesde || neto === 0 ? 0 : BRAND.envio.costoMinorista;
  return { lines, bruto, bultos, desc, descuento, neto, items, faltaMinimo, envio, total: neto + envio };
}

export function useCart() {
  const mode = useShop((s) => s.mode);
  const cart = useShop((s) => s.carts[s.mode]);
  return { mode, cart, ...cartSummary(cart, mode) };
}

/** Productos disponibles para el modo actual. */
export const available = (mode: Mode) => PRODUCTS.filter((p) => mode === 'minorista' || p.mayorista);

/** Paso y mínimo del selector de cantidad. */
export const stepOf = (p: Product, mode: Mode) => (mode === 'mayorista' ? { paso: 1, minimo: 1 } : { paso: p.minorista.paso, minimo: p.minorista.minimo });
export const unitOf = (p: Product, mode: Mode) => (mode === 'mayorista' ? 'bulto' : p.minorista.unidad);
