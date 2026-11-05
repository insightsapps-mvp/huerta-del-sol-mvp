import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Building2, Clock, Leaf, Receipt, Sprout, Truck } from 'lucide-react';
import { BRAND } from '@/config/brand';
import { CATEGORIES, PRODUCTS, deEstacion } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { ModeToggle } from '@/components/Layout';
import { available, useShop } from '@/store/shop';
import { ars, cn, photo } from '@/lib/utils';

const SLIDES = [
  { img: '/img/hero/hero-invernadero.webp', kicker: 'Del invernadero a tu mesa', title: 'Verdura cosechada hoy, directo del productor', sub: 'Tomate, pimiento, lechuga y más, sin intermediarios y al mejor precio.', cta: 'Comprar ahora', to: '/productos' },
  { img: '/img/hero/hero-cajones.webp', kicker: 'Venta mayorista', title: 'Cajones y bolsas para verdulerías y restaurantes', sub: `Precio por bulto, 5% off desde 10 bultos y 10% desde 25. Pedido mínimo ${ars(BRAND.mayorista.pedidoMinimo)}.`, cta: 'Ver precios mayoristas', to: '/mayoristas' },
  { img: '/img/hero/hero-mercado.webp', kicker: 'Bolsones de la semana', title: 'Bolsón familiar de 10 kg', sub: 'Surtido de estación para una familia de 4. Envío a domicilio en La Plata, CABA y GBA Sur.', cta: 'Ver bolsones', to: '/productos/bolsones' },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6500);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="container-x pt-4 sm:pt-6">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
          {SLIDES.map((s, idx) => (
            <div key={s.img} className="relative flex min-h-[420px] w-full shrink-0 items-end sm:min-h-[460px] sm:items-center" aria-hidden={idx !== i}>
              <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent sm:bg-gradient-to-r sm:from-black/70 sm:via-black/35 sm:to-transparent" />
              <div className="relative max-w-xl p-6 text-white sm:p-12">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold uppercase tracking-wider backdrop-blur">{s.kicker}</span>
                <h1 className="mt-3 text-[34px] font-bold leading-[1.05] sm:text-[52px]">{s.title}</h1>
                <p className="mt-3 text-[15px] text-white/85 sm:text-[17px]">{s.sub}</p>
                <Link to={s.to} tabIndex={idx === i ? 0 : -1} className="btn mt-6 bg-white text-huerta-900 hover:bg-huerta-50">
                  {s.cta} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 right-5 flex gap-1.5">
          {SLIDES.map((s, idx) => (
            <button key={s.img} onClick={() => setI(idx)} aria-label={`Banner ${idx + 1}`} className="grid h-8 w-8 place-items-center">
              <span className={cn('h-2 rounded-full bg-white transition-all', idx === i ? 'w-7' : 'w-2 opacity-60')} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Clock, t: 'Cosecha del día', s: 'Cortamos a la mañana y despachamos en el día' },
    { icon: Sprout, t: 'Directo del productor', s: `Quintas propias en el ${BRAND.zona}` },
    { icon: Truck, t: 'Envío o retiro', s: `Gratis desde ${ars(BRAND.envio.gratisDesde)} · Retiro en quinta o Mercado Central` },
    { icon: Receipt, t: 'Factura A y B', s: 'Cuenta corriente para clientes mayoristas' },
  ];
  return (
    <section className="container-x mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((b) => (
        <div key={b.t} className="card flex items-start gap-3 p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-huerta-100 text-huerta-700">
            <b.icon size={20} />
          </span>
          <div>
            <div className="text-[14.5px] font-bold">{b.t}</div>
            <div className="text-[12.5px] leading-snug text-huerta-900/60">{b.s}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

function SectionHead({ title, sub, to, cta = 'Ver todos' }: { title: string; sub?: string; to?: string; cta?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[28px] font-bold leading-tight sm:text-[34px]">{title}</h2>
        {sub && <p className="mt-1 text-[15px] text-huerta-900/65">{sub}</p>}
      </div>
      {to && (
        <Link to={to} className="hidden shrink-0 items-center gap-1 text-[14px] font-bold text-huerta-700 hover:underline sm:flex">
          {cta} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const mode = useShop((s) => s.mode);
  const list = available(mode);
  const estacion = list.filter((p) => deEstacion(p)).slice(0, 8);
  const destacados = list.filter((p) => p.destacado).slice(0, 8);
  return (
    <>
      <Hero />
      <Benefits />

      <section className="container-x mt-14">
        <SectionHead title="Comprá por categoría" sub="Todo lo que cosechamos, ordenado por tipo de producto" to="/productos" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.filter((c) => mode === 'minorista' || c.id !== 'bolsones').map((c) => {
            const n = list.filter((p) => p.categoria === c.id).length;
            return (
              <Link key={c.id} to={`/productos/${c.id}`} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
                <img src={photo(c.foto)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <div className="font-display text-[19px] font-bold leading-tight">{c.nombre}</div>
                  <div className="text-[12px] text-white/80">{n} productos</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-x mt-14">
        <SectionHead title="De estación" sub="Lo que está en su mejor momento este mes" to="/productos?estacion=1" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {estacion.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      <section className="container-x mt-14">
        <div className="grid overflow-hidden rounded-3xl bg-tierra-600 text-white md:grid-cols-2">
          <div className="relative min-h-[240px]">
            <img src="/img/hero/hero-cajones.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="p-7 sm:p-10">
            <span className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-tierra-100">
              <Building2 size={16} /> Verdulerías · Restaurantes · Distribuidores
            </span>
            <h2 className="mt-3 text-[30px] font-bold leading-tight sm:text-[38px]">Comprá por bulto a precio de productor</h2>
            <ul className="mt-4 space-y-2 text-[15px] text-white/90">
              <li className="flex gap-2">
                <BadgePercent size={18} className="mt-0.5 shrink-0" /> 5% de descuento desde 10 bultos y 10% desde 25
              </li>
              <li className="flex gap-2">
                <Truck size={18} className="mt-0.5 shrink-0" /> Entrega sin cargo o retiro en Mercado Central
              </li>
              <li className="flex gap-2">
                <Receipt size={18} className="mt-0.5 shrink-0" /> Factura A y cuenta corriente con aprobación
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/mayoristas" className="btn bg-white text-tierra-700 hover:bg-tierra-50">
                Lista de precios mayorista <ArrowRight size={18} />
              </Link>
              <ModeToggle size="sm" className="bg-white/15 [&>button]:text-white" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-x mt-14">
        <SectionHead title={mode === 'mayorista' ? 'Los más pedidos por mayoristas' : 'Los más elegidos'} sub="Lo que más sale de la quinta cada semana" to="/productos" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {destacados.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      <section className="container-x mt-14">
        <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-huerta-100 text-huerta-700">
            <Leaf size={26} />
          </span>
          <div className="flex-1">
            <h3 className="text-[22px] font-bold">{PRODUCTS.filter((p) => p.cultivo === 'agroecologico').length} productos agroecológicos</h3>
            <p className="text-[14.5px] text-huerta-900/65">Cultivados sin agroquímicos de síntesis, con control biológico de plagas y abonos orgánicos.</p>
          </div>
          <Link to="/productos?cultivo=agroecologico" className="btn-primary">
            Ver agroecológicos
          </Link>
        </div>
      </section>
    </>
  );
}
