import { Link } from 'react-router-dom';
import { Leaf, Plus, Sprout, Sun, Warehouse } from 'lucide-react';
import { ars, cn, photo, qtyLabel } from '@/lib/utils';
import { deEstacion, type Product } from '@/data/products';
import { stepOf, unitOf, unitPrice, useShop } from '@/store/shop';
import { QtyStepper } from './QtyStepper';

export function Badges({ p, className }: { p: Product; className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {p.minorista.antes && <span className="rounded-md bg-tierra-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">-{Math.round((1 - p.minorista.precio / p.minorista.antes) * 100)}%</span>}
      {deEstacion(p) && (
        <span className="flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-amber-950 shadow-sm">
          <Sun size={11} /> De estación
        </span>
      )}
      {p.cultivo === 'agroecologico' && (
        <span className="flex items-center gap-1 rounded-md bg-huerta-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
          <Leaf size={11} /> Agroecológico
        </span>
      )}
    </div>
  );
}

export function ProductCard({ p, className }: { p: Product; className?: string }) {
  const mode = useShop((s) => s.mode);
  const qty = useShop((s) => s.carts[s.mode][p.slug] ?? 0);
  const setQty = useShop((s) => s.setQty);
  const add = useShop((s) => s.add);
  const toast = useShop((s) => s.toast);
  const price = unitPrice(p, mode);
  const { paso, minimo } = stepOf(p, mode);
  const unidad = unitOf(p, mode);
  const may = mode === 'mayorista' ? p.mayorista : undefined;

  return (
    <Link
      to={`/producto/${p.slug}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-pop',
        qty > 0 ? 'border-huerta-500/60 ring-1 ring-huerta-500/40' : 'border-huerta-900/10',
        className,
      )}
      data-product={p.slug}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-huerta-50">
        <img
          src={photo(p.slug)}
          alt={p.nombre}
          loading="lazy"
          className={cn('h-full w-full transition duration-500 group-hover:scale-105', p.fit === 'contain' ? 'object-contain p-3' : 'object-cover')}
        />
        <Badges p={p} className="absolute left-2.5 top-2.5" />
        {qty > 0 && <span className="absolute right-2.5 top-2.5 rounded-full bg-huerta-700 px-2.5 py-1 text-[12px] font-bold text-white shadow">{qtyLabel(qty, unidad)}</span>}
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-huerta-700/80">
          {p.origen === 'invernadero' ? <Warehouse size={13} /> : <Sprout size={13} />}
          {p.origen === 'invernadero' ? 'Invernadero' : 'A campo'} · Cosecha de {p.cosecha}
        </div>
        <h3 className="mt-1 font-sans text-[16px] font-bold leading-tight text-huerta-950">{p.nombre}</h3>
        <p className="mt-0.5 line-clamp-1 text-[13px] text-huerta-900/60">{p.variedad}</p>

        <div className="mt-3">
          {may ? (
            <>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-tierra-600">{may.bulto}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-[21px] font-extrabold tabular-nums text-huerta-950">{ars(price)}</span>
                {may.kg && <span className="text-[12px] text-huerta-900/60">{ars(price / may.kg)}/kg</span>}
              </div>
              <div className="text-[11.5px] text-huerta-900/55">{may.stock} bultos disponibles hoy</div>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-[21px] font-extrabold tabular-nums text-huerta-950">{ars(price)}</span>
                <span className="text-[13px] text-huerta-900/60">
                  / {p.minorista.unidad}
                  {p.minorista.detalle ? ` (${p.minorista.detalle})` : ''}
                </span>
              </div>
              {p.minorista.antes && <div className="text-[12px] text-huerta-900/45 line-through tabular-nums">{ars(p.minorista.antes)}</div>}
            </>
          )}
        </div>

        <div className="mt-auto pt-3">
          {qty === 0 ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                add(p.slug, minimo);
                toast(`${p.nombre} · ${qtyLabel(minimo, unidad)} agregado`);
              }}
              className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-huerta-600 text-[14px] font-bold text-white transition hover:bg-huerta-700"
            >
              <Plus size={17} strokeWidth={2.6} /> Agregar
            </button>
          ) : (
            <>
              <QtyStepper value={qty} step={paso} min={0} onChange={(n) => setQty(p.slug, n < minimo ? 0 : n)} label={qtyLabel(qty, unidad)} />
              <div className="mt-1.5 text-center text-[12px] tabular-nums text-huerta-900/60">
                {qtyLabel(qty, unidad)} × {ars(price)} = <b className="text-[13.5px] text-huerta-800">{ars(qty * price)}</b>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
