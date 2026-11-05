import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Check, ChevronRight, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, categoryById, deEstacion, type CategoryId } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { available, unitPrice, useShop } from '@/store/shop';
import { ars, cn } from '@/lib/utils';

const SORTS = [
  { v: 'relevancia', label: 'Más relevantes' },
  { v: 'precio-asc', label: 'Menor precio' },
  { v: 'precio-desc', label: 'Mayor precio' },
  { v: 'nombre', label: 'Nombre (A-Z)' },
];

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function Check2({ on, label, count, onClick }: { on: boolean; label: string; count?: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex min-h-[40px] w-full items-center gap-2.5 rounded-lg px-2 text-left text-[14px] hover:bg-huerta-50">
      <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-md border-2', on ? 'border-huerta-600 bg-huerta-600 text-white' : 'border-huerta-900/25')}>{on && <Check size={13} strokeWidth={3} />}</span>
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-[12px] text-huerta-900/45">{count}</span>}
    </button>
  );
}

export default function Catalogo() {
  const { categoria } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = useShop((s) => s.mode);
  const [sheet, setSheet] = useState(false);

  const q = params.get('q') ?? '';
  const cultivo = params.get('cultivo') ?? '';
  const origen = params.get('origen') ?? '';
  const estacion = params.get('estacion') === '1';
  const ofertas = params.get('ofertas') === '1';
  const orden = params.get('orden') ?? 'relevancia';
  const max = Number(params.get('max') ?? 0);
  const cat = categoria ? categoryById(categoria) : undefined;

  const set = (k: string, v: string | null) => {
    const n = new URLSearchParams(params);
    if (v) n.set(k, v);
    else n.delete(k);
    setParams(n, { replace: true });
  };

  const base = available(mode);
  const priceMax = Math.max(...base.map((p) => unitPrice(p, mode)));
  const filtered = useMemo(() => {
    let l = base.filter((p) => !categoria || p.categoria === categoria);
    if (q) l = l.filter((p) => norm(`${p.nombre} ${p.variedad} ${p.categoria}`).includes(norm(q)));
    if (cultivo) l = l.filter((p) => p.cultivo === cultivo);
    if (origen) l = l.filter((p) => p.origen === origen);
    if (estacion) l = l.filter((p) => deEstacion(p));
    if (ofertas) l = l.filter((p) => p.minorista.antes);
    if (max) l = l.filter((p) => unitPrice(p, mode) <= max);
    const s = [...l];
    if (orden === 'precio-asc') s.sort((a, b) => unitPrice(a, mode) - unitPrice(b, mode));
    if (orden === 'precio-desc') s.sort((a, b) => unitPrice(b, mode) - unitPrice(a, mode));
    if (orden === 'nombre') s.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (orden === 'relevancia') s.sort((a, b) => Number(!!b.destacado) - Number(!!a.destacado));
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, categoria, q, cultivo, origen, estacion, ofertas, max, orden, mode]);

  const active: { label: string; clear: () => void }[] = [];
  if (q) active.push({ label: `“${q}”`, clear: () => set('q', null) });
  if (cultivo) active.push({ label: cultivo === 'agroecologico' ? 'Agroecológico' : 'Convencional', clear: () => set('cultivo', null) });
  if (origen) active.push({ label: origen === 'invernadero' ? 'Invernadero' : 'A campo', clear: () => set('origen', null) });
  if (estacion) active.push({ label: 'De estación', clear: () => set('estacion', null) });
  if (ofertas) active.push({ label: 'En oferta', clear: () => set('ofertas', null) });
  if (max) active.push({ label: `Hasta ${ars(max)}`, clear: () => set('max', null) });

  const countIn = (id: CategoryId) => base.filter((p) => p.categoria === id).length;

  const panel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-sans text-[13px] font-bold uppercase tracking-wider text-huerta-900/60">Categoría</h3>
        <Link to={`/productos?${params.toString()}`} className={cn('flex min-h-[40px] items-center justify-between rounded-lg px-2 text-[14px] font-semibold', !categoria ? 'bg-huerta-100 text-huerta-900' : 'hover:bg-huerta-50')}>
          Todas <span className="text-[12px] font-normal text-huerta-900/45">{base.length}</span>
        </Link>
        {CATEGORIES.filter((c) => countIn(c.id) > 0).map((c) => (
          <Link
            key={c.id}
            to={`/productos/${c.id}?${params.toString()}`}
            className={cn('flex min-h-[40px] items-center justify-between rounded-lg px-2 text-[14px] font-semibold', categoria === c.id ? 'bg-huerta-100 text-huerta-900' : 'hover:bg-huerta-50')}
          >
            {c.nombre} <span className="text-[12px] font-normal text-huerta-900/45">{countIn(c.id)}</span>
          </Link>
        ))}
      </div>
      <div>
        <h3 className="mb-2 font-sans text-[13px] font-bold uppercase tracking-wider text-huerta-900/60">Tipo de cultivo</h3>
        <Check2 on={cultivo === 'agroecologico'} label="Agroecológico" count={base.filter((p) => p.cultivo === 'agroecologico').length} onClick={() => set('cultivo', cultivo === 'agroecologico' ? null : 'agroecologico')} />
        <Check2 on={cultivo === 'convencional'} label="Convencional" count={base.filter((p) => p.cultivo === 'convencional').length} onClick={() => set('cultivo', cultivo === 'convencional' ? null : 'convencional')} />
      </div>
      <div>
        <h3 className="mb-2 font-sans text-[13px] font-bold uppercase tracking-wider text-huerta-900/60">Origen</h3>
        <Check2 on={origen === 'invernadero'} label="Invernadero" count={base.filter((p) => p.origen === 'invernadero').length} onClick={() => set('origen', origen === 'invernadero' ? null : 'invernadero')} />
        <Check2 on={origen === 'campo'} label="A campo" count={base.filter((p) => p.origen === 'campo').length} onClick={() => set('origen', origen === 'campo' ? null : 'campo')} />
      </div>
      <div>
        <h3 className="mb-2 font-sans text-[13px] font-bold uppercase tracking-wider text-huerta-900/60">Destacados</h3>
        <Check2 on={estacion} label="De estación este mes" count={base.filter((p) => deEstacion(p)).length} onClick={() => set('estacion', estacion ? null : '1')} />
        {mode === 'minorista' && <Check2 on={ofertas} label="En oferta" count={base.filter((p) => p.minorista.antes).length} onClick={() => set('ofertas', ofertas ? null : '1')} />}
      </div>
      <div>
        <h3 className="mb-2 font-sans text-[13px] font-bold uppercase tracking-wider text-huerta-900/60">Precio máximo {mode === 'mayorista' ? 'por bulto' : ''}</h3>
        <input
          type="range"
          min={0}
          max={priceMax}
          step={mode === 'mayorista' ? 1000 : 100}
          value={max || priceMax}
          onChange={(e) => set('max', Number(e.target.value) >= priceMax ? null : e.target.value)}
          className="w-full accent-[#336c2a]"
          aria-label="Precio máximo"
        />
        <div className="mt-1 flex justify-between text-[12.5px] text-huerta-900/60">
          <span>$ 0</span>
          <b className="text-huerta-900">{ars(max || priceMax)}</b>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-x pt-6">
      <nav className="mb-3 flex items-center gap-1 text-[13px] text-huerta-900/60" aria-label="Ruta">
        <Link to="/" className="hover:text-huerta-900">
          Inicio
        </Link>
        <ChevronRight size={14} />
        <Link to="/productos" className="hover:text-huerta-900">
          Productos
        </Link>
        {cat && (
          <>
            <ChevronRight size={14} /> <span className="font-semibold text-huerta-900">{cat.nombre}</span>
          </>
        )}
      </nav>
      <div className="mb-5 flex flex-col gap-1">
        <h1 className="text-[32px] font-bold leading-tight sm:text-[40px]">{cat ? cat.nombre : q ? `Resultados para “${q}”` : 'Todos los productos'}</h1>
        <p className="text-[15px] text-huerta-900/65">
          {cat ? cat.bajada : 'Verduras, frutas y aromáticas cosechadas en nuestras quintas.'} · Precios {mode === 'mayorista' ? 'mayoristas por bulto' : 'al público'}
        </p>
      </div>

      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 lg:hidden">
        <button onClick={() => setSheet(true)} className="chip border-huerta-900/15 bg-white">
          <SlidersHorizontal size={15} /> Filtros {active.length > 0 && <span className="rounded-full bg-huerta-600 px-1.5 text-[11px] text-white">{active.length}</span>}
        </button>
        {CATEGORIES.filter((c) => countIn(c.id) > 0).map((c) => (
          <button key={c.id} onClick={() => navigate(categoria === c.id ? `/productos?${params}` : `/productos/${c.id}?${params}`)} className={cn('chip', categoria === c.id ? 'border-huerta-600 bg-huerta-600 text-white' : 'border-huerta-900/15 bg-white')}>
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[200px]">{panel}</div>
        </aside>
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="mr-auto text-[14px] font-semibold text-huerta-900/70">{filtered.length} productos</span>
            {active.map((a) => (
              <button key={a.label} onClick={a.clear} className="chip h-9 border-huerta-600/30 bg-huerta-50 text-[13px] text-huerta-800">
                {a.label} <X size={14} />
              </button>
            ))}
            {active.length > 1 && (
              <button onClick={() => setParams(new URLSearchParams(), { replace: true })} className="text-[13px] font-semibold text-tierra-600 hover:underline">
                Limpiar todo
              </button>
            )}
            <select value={orden} onChange={(e) => set('orden', e.target.value === 'relevancia' ? null : e.target.value)} className="input h-10 w-auto rounded-full text-[14px]" aria-label="Ordenar">
              {SORTS.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <SearchX size={32} className="text-huerta-700" />
              <p className="font-semibold">No encontramos productos con esos filtros</p>
              <button onClick={() => navigate('/productos')} className="btn-secondary">
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="anim-fade absolute inset-0 bg-black/40" onClick={() => setSheet(false)} />
          <div className="anim-rise absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-3xl bg-crema">
            <div className="flex items-center justify-between border-b border-huerta-900/10 px-5 py-3">
              <h2 className="text-[20px] font-bold">Filtros</h2>
              <button onClick={() => setSheet(false)} className="grid h-11 w-11 place-items-center rounded-xl" aria-label="Cerrar filtros">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">{panel}</div>
            <div className="border-t border-huerta-900/10 p-4">
              <button onClick={() => setSheet(false)} className="btn-primary w-full">
                Ver {filtered.length} productos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
