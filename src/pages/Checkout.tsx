import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Banknote, Building2, CheckCircle2, CreditCard, Landmark, MessageCircle, Store, Truck } from 'lucide-react';
import { BRAND, waLink } from '@/config/brand';
import { useCart, useShop } from '@/store/shop';
import { ars, cn, photo, qtyLabel } from '@/lib/utils';

type Entrega = 'envio' | 'quinta' | 'mercado';
type Pago = 'mp' | 'transferencia' | 'efectivo' | 'cc';

function Option({ on, onClick, icon: Icon, title, sub }: { on: boolean; onClick: () => void; icon: typeof Truck; title: string; sub: string }) {
  return (
    <button type="button" onClick={onClick} className={cn('flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition', on ? 'border-huerta-600 bg-huerta-50' : 'border-huerta-900/10 bg-white hover:border-huerta-900/25')}>
      <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', on ? 'bg-huerta-600 text-white' : 'bg-huerta-100 text-huerta-700')}>
        <Icon size={19} />
      </span>
      <span>
        <span className="block text-[15px] font-bold">{title}</span>
        <span className="block text-[13px] text-huerta-900/60">{sub}</span>
      </span>
    </button>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const clear = useShop((s) => s.clear);
  const { mode, lines, bruto, descuento, desc, envio, neto, faltaMinimo, bultos } = useCart();
  const may = mode === 'mayorista';
  const [entrega, setEntrega] = useState<Entrega>('envio');
  const [pago, setPago] = useState<Pago>(may ? 'transferencia' : 'mp');
  const [done, setDone] = useState<{ id: string; total: number } | null>(null);
  const costoEnvio = entrega === 'envio' ? envio : 0;
  const total = neto + costoEnvio;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = (may ? 'M-' : 'P-') + String(Math.floor(10000 + Math.random() * 89999));
    setDone({ id, total });
    clear();
    window.scrollTo({ top: 0 });
  };

  if (done)
    return (
      <div className="container-x max-w-xl py-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-huerta-100 text-huerta-600">
          <CheckCircle2 size={42} />
        </div>
        <h1 className="mt-5 text-[34px] font-bold">¡Pedido recibido!</h1>
        <p className="mt-1 text-[17px] font-bold text-huerta-700">N° {done.id} · {ars(done.total)}</p>
        <p className="mt-3 text-[15px] text-huerta-900/70">
          {may
            ? 'Te enviamos la confirmación y la factura por email. Preparamos los bultos en la madrugada y coordinamos la entrega por WhatsApp.'
            : 'Te avisamos por WhatsApp cuando salga el pedido. Cosechamos a la mañana y entregamos en el día.'}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/productos" className="btn-primary">
            Seguir comprando
          </Link>
          <a href={waLink(`Hola! Hice el pedido ${done.id}`)} target="_blank" rel="noreferrer" className="btn-secondary">
            <MessageCircle size={18} /> Escribirnos
          </a>
        </div>
      </div>
    );

  if (lines.length === 0)
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-[28px] font-bold">Tu pedido está vacío</h1>
        <Link to="/productos" className="btn-primary mt-6">
          Ver productos
        </Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="container-x pt-6">
      <button type="button" onClick={() => navigate(-1)} className="mb-3 flex h-10 items-center gap-1.5 text-[14px] font-semibold text-huerta-900/70 hover:text-huerta-900">
        <ArrowLeft size={17} /> Volver
      </button>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-[34px] font-bold">Finalizar pedido</h1>
        <span className={cn('rounded-lg px-2.5 py-1 text-[12px] font-bold uppercase', may ? 'bg-tierra-100 text-tierra-700' : 'bg-huerta-100 text-huerta-800')}>Compra {mode}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-[22px] font-bold">1. {may ? 'Datos del comercio' : 'Tus datos'}</h2>
            <div className="card grid gap-4 p-5 sm:grid-cols-2">
              {may ? (
                <>
                  <label className="sm:col-span-2">
                    <span className="label">Razón social</span>
                    <input required className="input" placeholder="Verdulería El Tomate SRL" />
                  </label>
                  <label>
                    <span className="label">CUIT</span>
                    <input required className="input" placeholder="30-12345678-9" inputMode="numeric" />
                  </label>
                  <label>
                    <span className="label">Condición frente al IVA</span>
                    <select className="input" defaultValue="ri">
                      <option value="ri">Responsable inscripto (Factura A)</option>
                      <option value="mono">Monotributista (Factura B)</option>
                      <option value="exento">Exento</option>
                    </select>
                  </label>
                </>
              ) : null}
              <label>
                <span className="label">{may ? 'Persona de contacto' : 'Nombre y apellido'}</span>
                <input required className="input" placeholder="María González" autoComplete="name" />
              </label>
              <label>
                <span className="label">WhatsApp</span>
                <input required className="input" placeholder="221 555-1234" inputMode="tel" autoComplete="tel" />
              </label>
              <label className="sm:col-span-2">
                <span className="label">Email</span>
                <input required type="email" className="input" placeholder="maria@email.com" autoComplete="email" />
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-bold">2. Entrega</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Option on={entrega === 'envio'} onClick={() => setEntrega('envio')} icon={Truck} title="Envío a domicilio" sub={may ? 'Sin cargo' : envio === 0 ? 'Gratis en este pedido' : ars(envio)} />
              <Option on={entrega === 'quinta'} onClick={() => setEntrega('quinta')} icon={Store} title={BRAND.retiros[0].label} sub="Sin cargo" />
              <Option on={entrega === 'mercado'} onClick={() => setEntrega('mercado')} icon={Building2} title={BRAND.retiros[1].label} sub="Sin cargo" />
            </div>
            <div className="card mt-3 grid gap-4 p-5 sm:grid-cols-2">
              {entrega === 'envio' ? (
                <>
                  <label className="sm:col-span-2">
                    <span className="label">Dirección</span>
                    <input required className="input" placeholder="Calle 7 N° 1234, La Plata" autoComplete="street-address" />
                  </label>
                  <label>
                    <span className="label">Día de entrega</span>
                    <select className="input">
                      <option>Hoy (pedidos antes de las 10 h)</option>
                      <option>Mañana</option>
                      <option>Pasado mañana</option>
                    </select>
                  </label>
                  <label>
                    <span className="label">Franja horaria</span>
                    <select className="input">
                      {may ? <option>Madrugada (4 a 8 h)</option> : null}
                      <option>Mañana (9 a 13 h)</option>
                      <option>Tarde (14 a 19 h)</option>
                    </select>
                  </label>
                </>
              ) : (
                <p className="text-[14px] text-huerta-900/70 sm:col-span-2">{BRAND.retiros.find((r) => r.id === entrega)!.detalle}</p>
              )}
              <label className="sm:col-span-2">
                <span className="label">Notas (opcional)</span>
                <textarea className="input min-h-[80px] py-3" placeholder={may ? 'Ej: tomate más verde para que aguante en góndola' : 'Ej: tocar timbre B'} />
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-bold">3. Pago</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {!may && <Option on={pago === 'mp'} onClick={() => setPago('mp')} icon={CreditCard} title="Tarjeta o Mercado Pago" sub="Débito, crédito o dinero en cuenta" />}
              <Option on={pago === 'transferencia'} onClick={() => setPago('transferencia')} icon={Landmark} title="Transferencia bancaria" sub="Te enviamos el CBU al confirmar" />
              <Option on={pago === 'efectivo'} onClick={() => setPago('efectivo')} icon={Banknote} title="Efectivo al recibir" sub="Pagás cuando llega el pedido" />
              {may && <Option on={pago === 'cc'} onClick={() => setPago('cc')} icon={Building2} title="Cuenta corriente" sub="A 7 días · requiere aprobación" />}
            </div>
          </section>
        </div>

        <aside>
          <div className="card sticky top-[200px] p-5">
            <h2 className="mb-3 text-[20px] font-bold">Resumen</h2>
            <ul className="max-h-[320px] divide-y divide-huerta-900/10 overflow-y-auto">
              {lines.map((l) => (
                <li key={l.p.slug} className="flex items-center gap-3 py-2.5">
                  <img src={photo(l.p.slug)} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-semibold">{l.p.nombre}</div>
                    <div className="text-[12.5px] text-huerta-900/60">
                      {qtyLabel(l.qty, may ? 'bulto' : l.p.minorista.unidad)} × {ars(l.price)}
                    </div>
                  </div>
                  <span className="text-[14px] font-semibold tabular-nums">{ars(l.subtotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-huerta-900/10 pt-3 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-huerta-900/70">Subtotal{may ? ` (${bultos} bultos)` : ''}</dt>
                <dd className="tabular-nums">{ars(bruto)}</dd>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between font-semibold text-huerta-700">
                  <dt>Descuento por volumen ({Math.round(desc * 100)}%)</dt>
                  <dd className="tabular-nums">- {ars(descuento)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-huerta-900/70">Envío</dt>
                <dd className="tabular-nums">{costoEnvio === 0 ? <span className="font-semibold text-huerta-700">Sin cargo</span> : ars(costoEnvio)}</dd>
              </div>
              <div className="flex justify-between border-t border-huerta-900/10 pt-2 text-[20px] font-extrabold">
                <dt>Total</dt>
                <dd className="tabular-nums">{ars(total)}</dd>
              </div>
            </dl>
            <button disabled={faltaMinimo > 0} className={cn('mt-4 w-full', may ? 'btn-accent' : 'btn-primary')}>
              Confirmar pedido · {ars(total)}
            </button>
            {faltaMinimo > 0 && <p className="mt-2 text-center text-[12.5px] text-amber-800">Faltan {ars(faltaMinimo)} para el pedido mínimo mayorista.</p>}
            <p className="mt-3 text-center text-[12px] text-huerta-900/50">Precios con IVA incluido. Las verduras se pesan al armar el pedido; puede haber una diferencia de ±5%.</p>
          </div>
        </aside>
      </div>
    </form>
  );
}
