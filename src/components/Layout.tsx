import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Building2, CheckCircle2, Menu, MessageCircle, Search, ShoppingBasket, Store, Trash2, Truck, X } from 'lucide-react';
import { BRAND, waLink } from '@/config/brand';
import { CATEGORIES } from '@/data/products';
import { ars, cn, photo, qtyLabel } from '@/lib/utils';
import { stepOf, unitOf, useCart, useShop, type Mode } from '@/store/shop';
import { QtyStepper } from './QtyStepper';

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <img src="/favicon.svg" alt="" className="h-10 w-10" />
      <span className="leading-none">
        <span className={cn('block font-display text-[21px] font-bold', light ? 'text-white' : 'text-huerta-900')}>{BRAND.name}</span>
        <span className={cn('block text-[11px] font-medium', light ? 'text-huerta-100/80' : 'text-huerta-700/70')}>Productores hortícolas</span>
      </span>
    </Link>
  );
}

export function ModeToggle({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  const mode = useShop((s) => s.mode);
  const setMode = useShop((s) => s.setMode);
  const toast = useShop((s) => s.toast);
  const opts: { v: Mode; label: string; icon: typeof Store }[] = [
    { v: 'minorista', label: 'Minorista', icon: Store },
    { v: 'mayorista', label: 'Mayorista', icon: Building2 },
  ];
  return (
    <div className={cn('inline-flex rounded-xl bg-huerta-100/80 p-1', className)} role="tablist" aria-label="Tipo de compra">
      {opts.map((o) => (
        <button
          key={o.v}
          role="tab"
          aria-selected={mode === o.v}
          onClick={() => {
            if (mode === o.v) return;
            setMode(o.v);
            toast(o.v === 'mayorista' ? 'Precios mayoristas por bulto activados' : 'Precios al público activados');
          }}
          className={cn(
            'flex items-center gap-1.5 rounded-lg font-semibold transition',
            size === 'sm' ? 'h-9 px-3 text-[13px]' : 'h-10 px-4 text-[14px]',
            mode === o.v ? (o.v === 'mayorista' ? 'bg-tierra-500 text-white shadow' : 'bg-huerta-600 text-white shadow') : 'text-huerta-800 hover:bg-white/60',
          )}
        >
          <o.icon size={16} /> {o.label}
        </button>
      ))}
    </div>
  );
}

function SearchBox({ className, onDone }: { className?: string; onDone?: () => void }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [q, setQ] = useState(new URLSearchParams(search).get('q') ?? '');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/productos?q=${encodeURIComponent(q.trim())}` : '/productos');
    onDone?.();
  };
  return (
    <form onSubmit={submit} className={cn('relative', className)}>
      <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-huerta-700/60" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscá tomate, lechuga, papa…" className="input h-11 rounded-full bg-huerta-50/60 pl-10" aria-label="Buscar productos" />
    </form>
  );
}

function Header() {
  const { items, total, mode } = useCart();
  const openDrawer = useShop((s) => s.openDrawer);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setMenu(false);
  }, [pathname]);
  return (
    <header className="sticky top-0 z-40 border-b border-huerta-900/10 bg-crema/95 backdrop-blur">
      <div className={cn('text-center text-[12.5px] font-medium text-white', mode === 'mayorista' ? 'bg-tierra-600' : 'bg-huerta-700')}>
        <div className="container-x flex h-9 items-center justify-center gap-2">
          <Truck size={14} className="shrink-0" />
          <span className="truncate">
            {mode === 'mayorista'
              ? `Venta por bulto · Pedido mínimo ${ars(BRAND.mayorista.pedidoMinimo)} · 5% off desde 10 bultos y 10% desde 25`
              : `Cosecha del día · Envío a ${BRAND.envio.zonas} · Gratis desde ${ars(BRAND.envio.gratisDesde)}`}
          </span>
        </div>
      </div>
      <div className="container-x flex h-[72px] items-center gap-3 lg:gap-6">
        <button onClick={() => setMenu(true)} className="-ml-2 grid h-11 w-11 place-items-center rounded-xl lg:hidden" aria-label="Menú">
          <Menu size={22} />
        </button>
        <Logo />
        <SearchBox className="hidden flex-1 md:block" />
        <ModeToggle className="hidden lg:inline-flex" />
        <button onClick={() => openDrawer(true)} className="relative ml-auto flex h-11 items-center gap-2 rounded-xl bg-huerta-900 px-3.5 text-white transition hover:bg-huerta-800 md:ml-0" aria-label="Abrir carrito">
          <ShoppingBasket size={19} />
          <span className="hidden text-[14px] font-bold tabular-nums sm:inline">{ars(total)}</span>
          {items > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-tierra-500 px-1 text-[11px] font-bold">{items}</span>}
        </button>
      </div>
      <nav className="container-x hidden h-12 items-center gap-1 lg:flex">
        <NavLink to="/productos" end className={({ isActive }) => cn('rounded-lg px-3 py-2 text-[14px] font-semibold', isActive ? 'bg-huerta-100 text-huerta-900' : 'text-huerta-800 hover:bg-huerta-50')}>
          Todos los productos
        </NavLink>
        {CATEGORIES.map((c) => (
          <NavLink key={c.id} to={`/productos/${c.id}`} className={({ isActive }) => cn('rounded-lg px-3 py-2 text-[14px] font-semibold', isActive ? 'bg-huerta-100 text-huerta-900' : 'text-huerta-800 hover:bg-huerta-50')}>
            {c.nombre}
          </NavLink>
        ))}
        <NavLink to="/mayoristas" className={({ isActive }) => cn('ml-auto rounded-lg px-3 py-2 text-[14px] font-bold', isActive ? 'bg-tierra-100 text-tierra-700' : 'text-tierra-600 hover:bg-tierra-50')}>
          Mayoristas →
        </NavLink>
      </nav>
      <div className="container-x flex flex-col gap-2 pb-3 lg:hidden">
        <SearchBox className="md:hidden" />
        <ModeToggle size="sm" className="w-full [&>button]:flex-1 [&>button]:justify-center" />
      </div>

      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="anim-fade absolute inset-0 bg-black/40" onClick={() => setMenu(false)} />
          <div className="anim-rise absolute inset-y-0 left-0 flex w-[min(320px,85vw)] flex-col bg-crema p-5 shadow-pop">
            <div className="mb-5 flex items-center justify-between">
              <Logo />
              <button onClick={() => setMenu(false)} className="grid h-11 w-11 place-items-center rounded-xl" aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>
            <Link to="/productos" className="rounded-xl px-3 py-3 font-semibold hover:bg-huerta-50">
              Todos los productos
            </Link>
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/productos/${c.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold hover:bg-huerta-50">
                <img src={photo(c.foto)} alt="" className="h-9 w-9 rounded-lg object-cover" /> {c.nombre}
              </Link>
            ))}
            <Link to="/mayoristas" className="mt-3 rounded-xl bg-tierra-50 px-3 py-3 font-bold text-tierra-700">
              Venta mayorista →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function CartDrawer() {
  const open = useShop((s) => s.drawer);
  const openDrawer = useShop((s) => s.openDrawer);
  const setQty = useShop((s) => s.setQty);
  const navigate = useNavigate();
  const { lines, mode, bruto, descuento, desc, neto, envio, total, faltaMinimo, bultos } = useCart();
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && openDrawer(false);
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = '';
    };
  }, [open, openDrawer]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="anim-fade absolute inset-0 bg-black/40" onClick={() => openDrawer(false)} />
      <aside className="anim-slide absolute inset-y-0 right-0 flex w-[min(440px,100vw)] flex-col bg-crema shadow-pop" aria-label="Carrito">
        <div className="flex items-center justify-between border-b border-huerta-900/10 px-5 py-4">
          <div>
            <h2 className="text-[22px] font-bold">Tu pedido</h2>
            <span className={cn('mt-0.5 inline-block rounded-md px-2 py-0.5 text-[11px] font-bold uppercase', mode === 'mayorista' ? 'bg-tierra-100 text-tierra-700' : 'bg-huerta-100 text-huerta-800')}>
              Compra {mode}
            </span>
          </div>
          <button onClick={() => openDrawer(false)} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-huerta-50" aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-huerta-100 text-huerta-700">
              <ShoppingBasket size={28} />
            </div>
            <p className="font-semibold">Todavía no agregaste nada</p>
            <button
              onClick={() => {
                openDrawer(false);
                navigate('/productos');
              }}
              className="btn-primary"
            >
              Ver productos
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-huerta-900/10 overflow-y-auto px-5">
              {lines.map((l) => {
                const { paso, minimo } = stepOf(l.p, mode);
                const unidad = unitOf(l.p, mode);
                return (
                  <div key={l.p.slug} className="flex gap-3 py-4">
                    <img src={photo(l.p.slug)} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate font-bold">{l.p.nombre}</div>
                          <div className="text-[12.5px] text-huerta-900/60">
                            {mode === 'mayorista' ? l.p.mayorista?.bulto : `${ars(l.price)} / ${l.p.minorista.unidad}`}
                          </div>
                        </div>
                        <button onClick={() => setQty(l.p.slug, 0)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-huerta-900/50 hover:bg-red-50 hover:text-red-600" aria-label={`Quitar ${l.p.nombre}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <QtyStepper size="sm" tone="outline" value={l.qty} step={paso} min={0} onChange={(n) => setQty(l.p.slug, n < minimo ? 0 : n)} label={qtyLabel(l.qty, unidad)} className="w-[150px]" />
                        <span className="font-bold tabular-nums">{ars(l.subtotal)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-huerta-900/10 bg-white px-5 py-4">
              <dl className="space-y-1.5 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-huerta-900/70">Subtotal {mode === 'mayorista' && `(${bultos} bultos)`}</dt>
                  <dd className="tabular-nums">{ars(bruto)}</dd>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between font-semibold text-huerta-700">
                    <dt>Descuento por volumen ({Math.round(desc * 100)}%)</dt>
                    <dd className="tabular-nums">- {ars(descuento)}</dd>
                  </div>
                )}
                {mode === 'minorista' && (
                  <div className="flex justify-between">
                    <dt className="text-huerta-900/70">Envío</dt>
                    <dd className="tabular-nums">{envio === 0 ? <span className="font-semibold text-huerta-700">Gratis</span> : ars(envio)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-huerta-900/10 pt-2 text-[18px] font-extrabold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{ars(total)}</dd>
                </div>
              </dl>
              {mode === 'minorista' && envio > 0 && (
                <p className="mt-2 text-[12.5px] text-huerta-700">Te faltan {ars(BRAND.envio.gratisDesde - neto)} para el envío gratis.</p>
              )}
              {faltaMinimo > 0 && (
                <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 p-2.5 text-[12.5px] font-medium text-amber-900">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" /> Te faltan {ars(faltaMinimo)} para el pedido mínimo mayorista ({ars(BRAND.mayorista.pedidoMinimo)}).
                </p>
              )}
              <button
                disabled={faltaMinimo > 0}
                onClick={() => {
                  openDrawer(false);
                  navigate('/checkout');
                }}
                className={cn('mt-3 w-full', mode === 'mayorista' ? 'btn-accent' : 'btn-primary')}
              >
                {mode === 'mayorista' ? 'Confirmar pedido mayorista' : 'Finalizar compra'} <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Toaster() {
  const toasts = useShop((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id} className="anim-rise flex items-center gap-2.5 rounded-xl bg-huerta-950 px-4 py-3 text-[14px] font-medium text-white shadow-pop">
          <CheckCircle2 size={18} className="text-huerta-300" /> {t.text}
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-huerta-950 text-huerta-100">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-huerta-100/75">
            Somos productores del {BRAND.zona}. Cosechamos todos los días y vendemos directo a familias, verdulerías, restaurantes y mayoristas, sin intermediarios.
          </p>
          <a href={waLink('Hola! Quiero hacer un pedido')} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-4 font-bold text-[#05301a]">
            <MessageCircle size={18} /> {BRAND.whatsappLabel}
          </a>
        </div>
        <div>
          <h4 className="font-sans text-[14px] font-bold uppercase tracking-wider text-white">Comprar</h4>
          <ul className="mt-3 space-y-2 text-[14px] text-huerta-100/75">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/productos/${c.id}`} className="hover:text-white">
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[14px] font-bold uppercase tracking-wider text-white">Empresa</h4>
          <ul className="mt-3 space-y-2 text-[14px] text-huerta-100/75">
            <li>
              <Link to="/mayoristas" className="hover:text-white">
                Venta mayorista
              </Link>
            </li>
            {BRAND.retiros.map((r) => (
              <li key={r.id}>{r.label}</li>
            ))}
            <li>{BRAND.email}</li>
            <li>CUIT {BRAND.cuit}</li>
            <li>
              <Link to="/creditos" className="hover:text-white">
                Créditos de fotos
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[12px] text-huerta-100/50">© {new Date().getFullYear()} {BRAND.name}. Precios en pesos argentinos con IVA incluido.</div>
    </footer>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </div>
  );
}
