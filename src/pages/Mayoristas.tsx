import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { BadgePercent, CheckCircle2, ClipboardList, Download, Moon, Receipt, Search, ShoppingBasket, Truck } from 'lucide-react';
import { BRAND } from '@/config/brand';
import { CATEGORIES, PRODUCTS } from '@/data/products';
import { useShop } from '@/store/shop';
import { ars, cn, downloadCSV, photo } from '@/lib/utils';

export default function Mayoristas() {
  const setMode = useShop((s) => s.setMode);
  const add = useShop((s) => s.add);
  const mode = useShop((s) => s.mode);
  const toast = useShop((s) => s.toast);
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [sent, setSent] = useState(false);
  const list = useMemo(
    () => PRODUCTS.filter((p) => p.mayorista && (!cat || p.categoria === cat) && p.nombre.toLowerCase().includes(q.toLowerCase())),
    [cat, q],
  );

  const exportar = () =>
    downloadCSV('lista-precios-mayorista.csv', [
      ['Producto', 'Variedad', 'Categoría', 'Bulto', 'Precio bulto', 'Precio por kg', `-5% (10+ bultos)`, `-10% (25+ bultos)`],
      ...PRODUCTS.filter((p) => p.mayorista).map((p) => [
        p.nombre,
        p.variedad,
        CATEGORIES.find((c) => c.id === p.categoria)!.nombre,
        p.mayorista!.bulto,
        p.mayorista!.precio,
        p.mayorista!.kg ? Math.round(p.mayorista!.precio / p.mayorista!.kg) : '',
        Math.round(p.mayorista!.precio * 0.95),
        Math.round(p.mayorista!.precio * 0.9),
      ]),
    ]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <img src="/img/hero/hero-cajones.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-tierra-900/90 via-tierra-800/75 to-tierra-700/30" />
        <div className="container-x relative py-16 text-white sm:py-24">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-bold uppercase tracking-wider">Venta mayorista</span>
          <h1 className="mt-4 max-w-2xl text-[38px] font-bold leading-[1.05] sm:text-[56px]">Verdura por bulto, directo de la quinta</h1>
          <p className="mt-4 max-w-xl text-[17px] text-white/85">Para verdulerías, restaurantes, comedores y distribuidores. Precio de productor, cosecha del día y entrega en la madrugada.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#lista" className="btn bg-white text-tierra-700 hover:bg-tierra-50">
              Ver lista de precios
            </a>
            <a href="#alta" className="btn border border-white/40 text-white hover:bg-white/10">
              Abrir cuenta mayorista
            </a>
          </div>
        </div>
      </section>

      <section className="container-x mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { i: BadgePercent, t: 'Descuento por volumen', s: '5% desde 10 bultos · 10% desde 25' },
          { i: Moon, t: 'Entrega en la madrugada', s: 'Llegás a abrir con mercadería fresca' },
          { i: Receipt, t: 'Factura A y cuenta corriente', s: 'Pago a 7 días con aprobación' },
          { i: Truck, t: `Pedido mínimo ${ars(BRAND.mayorista.pedidoMinimo)}`, s: 'Envío sin cargo o retiro en Mercado Central' },
        ].map((b) => (
          <div key={b.t} className="card p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-tierra-100 text-tierra-600">
              <b.i size={20} />
            </span>
            <div className="mt-3 text-[15px] font-bold">{b.t}</div>
            <div className="text-[13px] text-huerta-900/60">{b.s}</div>
          </div>
        ))}
      </section>

      <section className="container-x mt-14">
        <h2 className="text-[30px] font-bold">Cómo funciona</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            { n: 1, t: 'Armá el pedido', s: 'Activá la compra mayorista y sumá bultos desde la tienda o esta lista. El descuento se aplica solo.' },
            { n: 2, t: 'Confirmá antes de las 18 h', s: 'Cosechamos y armamos tus bultos de madrugada con lo que pediste.' },
            { n: 3, t: 'Recibilo o retiralo', s: 'Te lo llevamos sin cargo o lo retirás en nuestro puesto del Mercado Central.' },
          ].map((s) => (
            <div key={s.n} className="card p-5">
              <span className="font-display text-[40px] font-bold leading-none text-tierra-500">{s.n}</span>
              <div className="mt-2 text-[17px] font-bold">{s.t}</div>
              <p className="mt-1 text-[14px] text-huerta-900/65">{s.s}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="lista" className="container-x mt-14 scroll-mt-48">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[30px] font-bold">Lista de precios mayorista</h2>
            <p className="text-[14.5px] text-huerta-900/65">Precios por bulto con IVA incluido · actualizada hoy</p>
          </div>
          <button onClick={exportar} className="btn-secondary">
            <Download size={17} /> Descargar lista (Excel/CSV)
          </button>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <label className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-huerta-900/50" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar en la lista" className="input h-11 pl-9" />
          </label>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <button onClick={() => setCat('')} className={cn('chip', !cat ? 'border-tierra-500 bg-tierra-500 text-white' : 'border-huerta-900/15 bg-white')}>
              Todas
            </button>
            {CATEGORIES.filter((c) => c.id !== 'bolsones').map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} className={cn('chip', cat === c.id ? 'border-tierra-500 bg-tierra-500 text-white' : 'border-huerta-900/15 bg-white')}>
                {c.nombre}
              </button>
            ))}
          </div>
        </div>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-[14px]">
            <thead className="bg-huerta-50 text-left text-[12px] uppercase tracking-wide text-huerta-900/60">
              <tr>
                <th className="px-4 py-3 font-semibold">Producto</th>
                <th className="px-4 py-3 font-semibold">Bulto</th>
                <th className="px-4 py-3 text-right font-semibold">Precio</th>
                <th className="px-4 py-3 text-right font-semibold">Por kg</th>
                <th className="px-4 py-3 text-right font-semibold">10+ bultos</th>
                <th className="px-4 py-3 text-right font-semibold">25+ bultos</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.slug} className="border-t border-huerta-900/5">
                  <td className="px-4 py-2.5">
                    <Link to={`/producto/${p.slug}`} className="flex items-center gap-3 font-semibold hover:underline">
                      <img src={photo(p.slug)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span>
                        {p.nombre}
                        <span className="block text-[12px] font-normal text-huerta-900/55">{p.variedad}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-huerta-900/75">{p.mayorista!.bulto}</td>
                  <td className="px-4 py-2.5 text-right font-bold tabular-nums">{ars(p.mayorista!.precio)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-huerta-900/60">{p.mayorista!.kg ? ars(p.mayorista!.precio / p.mayorista!.kg) : '—'}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{ars(p.mayorista!.precio * 0.95)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{ars(p.mayorista!.precio * 0.9)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => {
                        if (mode !== 'mayorista') setMode('mayorista');
                        add(p.slug, 1);
                        toast(`1 bulto de ${p.nombre} agregado · ${ars(p.mayorista!.precio)}`);
                      }}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-tierra-500 px-3 text-[13px] font-bold text-white hover:bg-tierra-600"
                    >
                      <ShoppingBasket size={15} /> Sumar bulto
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="alta" className="container-x mt-14 scroll-mt-48">
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-card md:grid-cols-[1fr_1.2fr]">
          <div className="bg-huerta-900 p-8 text-white">
            <ClipboardList size={30} className="text-huerta-300" />
            <h2 className="mt-4 text-[30px] font-bold leading-tight">Abrí tu cuenta mayorista</h2>
            <p className="mt-3 text-[15px] text-huerta-100/80">Con la cuenta aprobada accedés a cuenta corriente, precios especiales por volumen fijo semanal y un vendedor asignado.</p>
            <ul className="mt-5 space-y-2 text-[14px] text-huerta-100/90">
              <li className="flex gap-2">
                <CheckCircle2 size={17} className="shrink-0 text-huerta-300" /> Respuesta en 24 h hábiles
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={17} className="shrink-0 text-huerta-300" /> Sin costo de alta
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={17} className="shrink-0 text-huerta-300" /> Podés comprar mientras tanto con transferencia
              </li>
            </ul>
          </div>
          <div className="p-6 sm:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <CheckCircle2 size={44} className="text-huerta-600" />
                <h3 className="text-[24px] font-bold">¡Solicitud enviada!</h3>
                <p className="text-[14.5px] text-huerta-900/70">Un vendedor te contacta por WhatsApp en menos de 24 h hábiles.</p>
                <button
                  onClick={() => {
                    setMode('mayorista');
                    window.scrollTo({ top: 0 });
                  }}
                  className="btn-accent mt-2"
                >
                  Empezar a comprar por bulto
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="label">Razón social</span>
                  <input required className="input" placeholder="Verdulería El Tomate SRL" />
                </label>
                <label>
                  <span className="label">CUIT</span>
                  <input required className="input" placeholder="30-12345678-9" inputMode="numeric" />
                </label>
                <label>
                  <span className="label">Tipo de negocio</span>
                  <select className="input">
                    <option>Verdulería</option>
                    <option>Restaurante / bar</option>
                    <option>Comedor / institución</option>
                    <option>Distribuidor</option>
                    <option>Supermercado</option>
                  </select>
                </label>
                <label>
                  <span className="label">Contacto</span>
                  <input required className="input" placeholder="Nombre y apellido" />
                </label>
                <label>
                  <span className="label">WhatsApp</span>
                  <input required className="input" placeholder="11 5555-1234" inputMode="tel" />
                </label>
                <label className="sm:col-span-2">
                  <span className="label">Compra semanal estimada</span>
                  <select className="input">
                    <option>Menos de 20 bultos</option>
                    <option>20 a 50 bultos</option>
                    <option>Más de 50 bultos</option>
                  </select>
                </label>
                <button className="btn-accent sm:col-span-2">Enviar solicitud</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
