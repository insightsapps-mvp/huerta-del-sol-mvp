import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Building2, CalendarDays, ChevronRight, Clock, Leaf, MessageCircle, Refrigerator, ShoppingBasket, Sprout, Store, Warehouse } from 'lucide-react';
import { BRAND, waLink } from '@/config/brand';
import { PRODUCTS, categoryById, productBySlug } from '@/data/products';
import { Badges, ProductCard } from '@/components/ProductCard';
import { QtyStepper } from '@/components/QtyStepper';
import { stepOf, unitOf, unitPrice, useShop } from '@/store/shop';
import { ars, cn, photo, qtyLabel } from '@/lib/utils';

const MESES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function Producto() {
  const { slug = '' } = useParams();
  const p = productBySlug(slug);
  const mode = useShop((s) => s.mode);
  const setMode = useShop((s) => s.setMode);
  const inCart = useShop((s) => s.carts[s.mode][slug] ?? 0);
  const add = useShop((s) => s.add);
  const toast = useShop((s) => s.toast);
  const openDrawer = useShop((s) => s.openDrawer);
  const [qty, setQty] = useState(1);

  const wholesale = mode === 'mayorista' && !!p?.mayorista;
  useEffect(() => {
    if (p) setQty(stepOf(p, mode).minimo);
  }, [slug, mode, p]);

  if (!p)
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-[28px] font-bold">Producto no encontrado</h1>
        <Link to="/productos" className="btn-primary mt-6">
          Ver productos
        </Link>
      </div>
    );

  const cat = categoryById(p.categoria)!;
  const price = unitPrice(p, wholesale ? 'mayorista' : 'minorista');
  const { paso, minimo } = stepOf(p, wholesale ? 'mayorista' : 'minorista');
  const unidad = unitOf(p, wholesale ? 'mayorista' : 'minorista');
  const mes = new Date().getMonth() + 1;
  const related = PRODUCTS.filter((x) => x.categoria === p.categoria && x.slug !== p.slug && (mode === 'minorista' || x.mayorista)).slice(0, 4);

  const addNow = () => {
    // Los bolsones son solo venta al público: si estaba en mayorista, cambia de modo
    if (mode === 'mayorista' && !p.mayorista) setMode('minorista');
    add(p.slug, qty);
    toast(`${qtyLabel(qty, unidad)} de ${p.nombre} agregado · ${ars(qty * price)}`);
  };

  return (
    <div className="container-x pt-6">
      <nav className="mb-4 flex items-center gap-1 text-[13px] text-huerta-900/60" aria-label="Ruta">
        <Link to="/" className="hover:text-huerta-900">
          Inicio
        </Link>
        <ChevronRight size={14} />
        <Link to={`/productos/${cat.id}`} className="hover:text-huerta-900">
          {cat.nombre}
        </Link>
        <ChevronRight size={14} /> <span className="font-semibold text-huerta-900">{p.nombre}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative self-start overflow-hidden rounded-3xl bg-huerta-50">
          <img src={photo(p.slug)} alt={p.nombre} className={cn('aspect-[4/3] w-full', p.fit === 'contain' ? 'object-contain p-6' : 'object-cover')} />
          <Badges p={p} className="absolute left-4 top-4 [&>span]:text-[12px]" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium text-huerta-700">
            <span className="flex items-center gap-1.5">
              {p.origen === 'invernadero' ? <Warehouse size={15} /> : <Sprout size={15} />}
              {p.origen === 'invernadero' ? 'Cultivo en invernadero' : 'Cultivo a campo'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} /> Cosechado {p.cosecha}
            </span>
            {p.cultivo === 'agroecologico' && (
              <span className="flex items-center gap-1.5">
                <Leaf size={15} /> Agroecológico
              </span>
            )}
          </div>
          <h1 className="mt-2 text-[34px] font-bold leading-tight sm:text-[44px]">{p.nombre}</h1>
          <p className="text-[16px] text-huerta-900/65">{p.variedad}</p>
          <p className="mt-4 text-[15.5px] leading-relaxed text-huerta-900/80">{p.descripcion}</p>

          {/* Selector de tipo de compra */}
          {p.mayorista && (
            <div className="mt-6 grid grid-cols-2 gap-2">
              {(['minorista', 'mayorista'] as const).map((m) => {
                const on = (m === 'mayorista') === wholesale;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      'rounded-2xl border-2 p-3 text-left transition',
                      on ? (m === 'mayorista' ? 'border-tierra-500 bg-tierra-50' : 'border-huerta-600 bg-huerta-50') : 'border-huerta-900/10 bg-white hover:border-huerta-900/25',
                    )}
                  >
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-huerta-900/60">
                      {m === 'mayorista' ? <Building2 size={14} /> : <Store size={14} />} {m === 'mayorista' ? 'Mayorista' : 'Al público'}
                    </span>
                    <span className="mt-1 block text-[20px] font-extrabold tabular-nums">{ars(m === 'mayorista' ? p.mayorista!.precio : p.minorista.precio)}</span>
                    <span className="block text-[12.5px] text-huerta-900/60">{m === 'mayorista' ? p.mayorista!.bulto : `por ${p.minorista.unidad}${p.minorista.detalle ? ` (${p.minorista.detalle})` : ''}`}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="card mt-4 p-5">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-[36px] font-extrabold leading-none tabular-nums">{ars(price)}</span>
              <span className="text-[15px] text-huerta-900/60">
                {wholesale ? p.mayorista!.bulto : `por ${p.minorista.unidad}${p.minorista.detalle ? ` (${p.minorista.detalle})` : ''}`}
              </span>
              {!wholesale && p.minorista.antes && <span className="text-[15px] text-huerta-900/45 line-through tabular-nums">{ars(p.minorista.antes)}</span>}
            </div>
            {wholesale && p.mayorista!.kg && <div className="mt-1 text-[13px] text-huerta-900/60">Equivale a {ars(price / p.mayorista!.kg)} por kg · {p.mayorista!.stock} bultos disponibles hoy</div>}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <QtyStepper size="lg" tone="outline" value={qty} step={paso} min={minimo} onChange={(n) => setQty(Math.max(minimo, n))} label={qtyLabel(qty, unidad)} className="sm:w-[190px]" />
              <button onClick={addNow} className={cn('flex-1', wholesale ? 'btn-accent' : 'btn-primary')} data-add-detail>
                <ShoppingBasket size={19} /> Agregar · {ars(qty * price)}
              </button>
            </div>
            <div className="mt-2 text-[13px] tabular-nums text-huerta-900/60">
              {qtyLabel(qty, unidad)} × {ars(price)} = <b className="text-huerta-900">{ars(qty * price)}</b>
            </div>
            {inCart > 0 && (
              <button onClick={() => openDrawer(true)} className="mt-3 flex w-full items-center justify-between rounded-xl bg-huerta-50 px-3 py-2.5 text-[13.5px] font-semibold text-huerta-800">
                <span>
                  Ya tenés {qtyLabel(inCart, unidad)} en el pedido · {ars(inCart * price)}
                </span>
                <span>Ver pedido →</span>
              </button>
            )}
          </div>

          {wholesale && (
            <div className="card mt-4 overflow-hidden">
              <div className="border-b border-huerta-900/10 px-5 py-3 text-[14px] font-bold">Precio por volumen (sobre el total de bultos del pedido)</div>
              <table className="w-full text-[14px]">
                <tbody>
                  {[{ desde: 1, descuento: 0 }, ...BRAND.mayorista.tramos].map((t, i, arr) => (
                    <tr key={t.desde} className="border-t border-huerta-900/5 first:border-0">
                      <td className="px-5 py-2.5 text-huerta-900/70">
                        {arr[i + 1] ? `${t.desde} a ${arr[i + 1].desde - 1} bultos` : `${t.desde} bultos o más`}
                      </td>
                      <td className="px-5 py-2.5 text-right font-bold tabular-nums">{ars(price * (1 - t.descuento))}</td>
                      <td className="w-20 px-5 py-2.5 text-right text-[12.5px] font-semibold text-huerta-700">{t.descuento ? `-${t.descuento * 100}%` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-[14px] font-bold">
                <CalendarDays size={17} className="text-huerta-700" /> Temporada
              </div>
              <div className="mt-3 grid grid-cols-12 gap-1">
                {MESES.map((m, i) => {
                  const on = p.temporada.includes(i + 1);
                  return (
                    <div key={i} className="text-center">
                      <div className={cn('h-6 rounded', on ? 'bg-huerta-500' : 'bg-huerta-100', i + 1 === mes && 'ring-2 ring-tierra-500 ring-offset-1')} />
                      <div className={cn('mt-1 text-[10.5px]', i + 1 === mes ? 'font-bold text-tierra-600' : 'text-huerta-900/50')}>{m}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-[14px] font-bold">
                <Refrigerator size={17} className="text-huerta-700" /> Conservación
              </div>
              <p className="mt-2 text-[14px] text-huerta-900/70">{p.conservacion}</p>
            </div>
          </div>

          <a href={waLink(`Hola! Consulta por ${p.nombre} (${wholesale ? p.mayorista!.bulto : p.minorista.unidad})`)} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-huerta-700 hover:underline">
            <MessageCircle size={17} /> Consultar por WhatsApp
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-[28px] font-bold">Más {cat.nombre.toLowerCase()}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((x) => (
              <ProductCard key={x.slug} p={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
