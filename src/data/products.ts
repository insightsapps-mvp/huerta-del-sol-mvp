export type CategoryId = 'hojas' | 'frutos' | 'raices' | 'coles' | 'aromaticas' | 'frutas' | 'bolsones';
export type Cultivo = 'agroecologico' | 'convencional';
export type Origen = 'invernadero' | 'campo';

export interface Category {
  id: CategoryId;
  nombre: string;
  bajada: string;
  foto: string; // slug de la foto
}

export interface Product {
  slug: string;
  nombre: string;
  variedad: string;
  categoria: CategoryId;
  cultivo: Cultivo;
  origen: Origen;
  /** meses de cosecha (1-12) */
  temporada: number[];
  descripcion: string;
  conservacion: string;
  /** venta al público */
  minorista: { unidad: 'kg' | 'unidad' | 'atado' | 'bandeja' | 'bolsón'; detalle?: string; precio: number; antes?: number; paso: number; minimo: number };
  /** venta por bulto (no disponible para bolsones) */
  mayorista?: { bulto: string; kg?: number; precio: number; stock: number };
  cosecha: 'hoy' | 'ayer';
  destacado?: boolean;
  fit?: 'cover' | 'contain';
}

export const CATEGORIES: Category[] = [
  { id: 'hojas', nombre: 'Hojas verdes', bajada: 'Lechuga, acelga, espinaca, apio y puerro', foto: 'lechuga' },
  { id: 'frutos', nombre: 'Frutos de huerta', bajada: 'Tomate, pimiento, berenjena, zapallito…', foto: 'tomate' },
  { id: 'raices', nombre: 'Raíces y bulbos', bajada: 'Papa, batata, zanahoria, cebolla, ajo', foto: 'zanahoria' },
  { id: 'coles', nombre: 'Coles', bajada: 'Brócoli, coliflor y repollo', foto: 'brocoli' },
  { id: 'aromaticas', nombre: 'Aromáticas', bajada: 'Albahaca, perejil y cilantro', foto: 'albahaca' },
  { id: 'frutas', nombre: 'Frutas', bajada: 'Frutilla, cítricos y palta', foto: 'frutilla' },
  { id: 'bolsones', nombre: 'Bolsones', bajada: 'Surtidos armados para la semana', foto: 'bolson-familiar' },
];

const TODO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const PV = [9, 10, 11, 12, 1, 2, 3]; // primavera-verano
const OI = [4, 5, 6, 7, 8, 9]; // otoño-invierno

export const PRODUCTS: Product[] = [
  // Hojas verdes
  { slug: 'lechuga', nombre: 'Lechuga mantecosa', variedad: 'Planta entera', categoria: 'hojas', cultivo: 'agroecologico', origen: 'invernadero', temporada: TODO, cosecha: 'hoy', destacado: true,
    descripcion: 'Hojas tiernas y crocantes, cosechadas a primera hora. Ideal para ensaladas y sándwiches.', conservacion: 'Heladera, envuelta en papel húmedo, hasta 5 días.',
    minorista: { unidad: 'unidad', precio: 1200, paso: 1, minimo: 1 }, mayorista: { bulto: 'Jaula x 12 plantas', precio: 10800, stock: 140 } },
  { slug: 'acelga', nombre: 'Acelga', variedad: 'Penca blanca y roja', categoria: 'hojas', cultivo: 'agroecologico', origen: 'campo', temporada: TODO, cosecha: 'hoy',
    descripcion: 'Atados grandes de hoja verde intensa y penca firme. Para tartas, rellenos y salteados.', conservacion: 'Heladera, en bolsa abierta, hasta 4 días.',
    minorista: { unidad: 'atado', detalle: 'aprox. 800 g', precio: 1500, paso: 1, minimo: 1 }, mayorista: { bulto: 'Bolsa x 10 atados', precio: 11000, stock: 90 } },
  { slug: 'espinaca', nombre: 'Espinaca', variedad: 'Hoja ancha', categoria: 'hojas', cultivo: 'agroecologico', origen: 'campo', temporada: OI, cosecha: 'hoy',
    descripcion: 'Hoja tierna, lavada en origen. Rica en hierro: cruda en ensaladas o salteada.', conservacion: 'Heladera, hasta 3 días.',
    minorista: { unidad: 'atado', detalle: 'aprox. 500 g', precio: 1800, paso: 1, minimo: 1 }, mayorista: { bulto: 'Bolsa x 10 atados', precio: 13500, stock: 60 } },
  { slug: 'apio', nombre: 'Apio', variedad: 'Planta entera', categoria: 'hojas', cultivo: 'convencional', origen: 'campo', temporada: TODO, cosecha: 'ayer',
    descripcion: 'Tallos crujientes y aromáticos. Para caldos, salsas y jugos verdes.', conservacion: 'Heladera, envuelto en film, hasta 10 días.',
    minorista: { unidad: 'unidad', precio: 1900, paso: 1, minimo: 1 }, mayorista: { bulto: 'Jaula x 12 plantas', precio: 17500, stock: 45 } },
  { slug: 'puerro', nombre: 'Puerro', variedad: 'Atado x 3', categoria: 'hojas', cultivo: 'convencional', origen: 'campo', temporada: OI, cosecha: 'ayer', fit: 'contain',
    descripcion: 'Sabor suave y dulce. Base de sopas, tartas y salteados.', conservacion: 'Heladera, hasta 2 semanas.',
    minorista: { unidad: 'atado', detalle: '3 unidades', precio: 1600, paso: 1, minimo: 1 }, mayorista: { bulto: 'Caja x 10 atados', precio: 12000, stock: 38 } },

  // Frutos de huerta
  { slug: 'tomate', nombre: 'Tomate redondo', variedad: 'Larga vida, de invernadero', categoria: 'frutos', cultivo: 'convencional', origen: 'invernadero', temporada: TODO, cosecha: 'hoy', destacado: true,
    descripcion: 'Tomate firme y jugoso, madurado en planta. Calibre parejo, ideal para ensalada y salsa.', conservacion: 'A temperatura ambiente hasta madurar; luego heladera.',
    minorista: { unidad: 'kg', precio: 2400, antes: 2800, paso: 0.5, minimo: 0.5 }, mayorista: { bulto: 'Cajón 18 kg', kg: 18, precio: 30600, stock: 220 } },
  { slug: 'pimiento', nombre: 'Pimiento', variedad: 'Rojo, verde y amarillo', categoria: 'frutos', cultivo: 'convencional', origen: 'invernadero', temporada: PV, cosecha: 'hoy', destacado: true,
    descripcion: 'Pimientos carnosos de tres colores. Para asar, rellenar o en crudo.', conservacion: 'Heladera, hasta 1 semana.',
    minorista: { unidad: 'kg', precio: 3900, paso: 0.5, minimo: 0.5 }, mayorista: { bulto: 'Cajón 10 kg', kg: 10, precio: 31000, stock: 85 } },
  { slug: 'berenjena', nombre: 'Berenjena', variedad: 'Violeta', categoria: 'frutos', cultivo: 'agroecologico', origen: 'invernadero', temporada: PV, cosecha: 'hoy',
    descripcion: 'Piel brillante y pulpa firme, sin semillas amargas. Para escabeche, milanesas y a la parrilla.', conservacion: 'Lugar fresco, hasta 5 días.',
    minorista: { unidad: 'kg', precio: 2600, paso: 0.5, minimo: 0.5 }, mayorista: { bulto: 'Cajón 12 kg', kg: 12, precio: 24000, stock: 70 } },
  { slug: 'zapallito', nombre: 'Zapallito', variedad: 'Largo rayado (zucchini)', categoria: 'frutos', cultivo: 'agroecologico', origen: 'campo', temporada: PV, cosecha: 'hoy',
    descripcion: 'Zucchini tierno de piel fina. Para tartas, budines y salteados.', conservacion: 'Heladera, hasta 5 días.',
    minorista: { unidad: 'kg', precio: 2200, antes: 2600, paso: 0.5, minimo: 0.5 }, mayorista: { bulto: 'Cajón 15 kg', kg: 15, precio: 24000, stock: 95 } },
  { slug: 'pepino', nombre: 'Pepino', variedad: 'Holandés', categoria: 'frutos', cultivo: 'convencional', origen: 'invernadero', temporada: PV, cosecha: 'hoy',
    descripcion: 'Pepino crocante y fresco, piel fina. Para ensaladas y conservas.', conservacion: 'Heladera, hasta 1 semana.',
    minorista: { unidad: 'kg', precio: 2400, paso: 0.5, minimo: 0.5 }, mayorista: { bulto: 'Cajón 15 kg', kg: 15, precio: 27000, stock: 60 } },
  { slug: 'chaucha', nombre: 'Chaucha', variedad: 'Redonda, sin hilo', categoria: 'frutos', cultivo: 'agroecologico', origen: 'campo', temporada: PV, cosecha: 'hoy',
    descripcion: 'Chauchas tiernas, sin hilo. Hervidas, salteadas o en ensalada rusa.', conservacion: 'Heladera, hasta 4 días.',
    minorista: { unidad: 'kg', precio: 4800, paso: 0.5, minimo: 0.5 }, mayorista: { bulto: 'Cajón 8 kg', kg: 8, precio: 30400, stock: 30 } },
  { slug: 'anco', nombre: 'Zapallo anco', variedad: 'Butternut', categoria: 'frutos', cultivo: 'convencional', origen: 'campo', temporada: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], cosecha: 'ayer',
    descripcion: 'Pulpa naranja, dulce y cremosa. Para puré, horno y sopas.', conservacion: 'Lugar fresco y seco, hasta 2 meses entero.',
    minorista: { unidad: 'kg', precio: 1300, paso: 1, minimo: 1 }, mayorista: { bulto: 'Bolsa 20 kg', kg: 20, precio: 19000, stock: 120 } },

  // Raíces y bulbos
  { slug: 'papa', nombre: 'Papa', variedad: 'Negra y colorada, lavada', categoria: 'raices', cultivo: 'convencional', origen: 'campo', temporada: TODO, cosecha: 'ayer', destacado: true,
    descripcion: 'Papa lavada de calibre mediano. Para hervir, freír y al horno.', conservacion: 'Lugar oscuro, fresco y seco, hasta 3 semanas.',
    minorista: { unidad: 'kg', precio: 1200, antes: 1400, paso: 1, minimo: 1 }, mayorista: { bulto: 'Bolsa 25 kg', kg: 25, precio: 21000, stock: 300 } },
  { slug: 'batata', nombre: 'Batata', variedad: 'Colorada', categoria: 'raices', cultivo: 'convencional', origen: 'campo', temporada: [3, 4, 5, 6, 7, 8, 9, 10, 11], cosecha: 'ayer',
    descripcion: 'Batata dulce de pulpa amarilla. Al horno, en puré o en fritas.', conservacion: 'Lugar fresco y seco, fuera de la heladera.',
    minorista: { unidad: 'kg', precio: 1500, paso: 1, minimo: 1 }, mayorista: { bulto: 'Bolsa 20 kg', kg: 20, precio: 22000, stock: 110 } },
  { slug: 'zanahoria', nombre: 'Zanahoria', variedad: 'Lavada', categoria: 'raices', cultivo: 'agroecologico', origen: 'campo', temporada: TODO, cosecha: 'hoy',
    descripcion: 'Zanahoria dulce y crocante, lavada. Para rallar, cocinar o jugos.', conservacion: 'Heladera, sin hojas, hasta 3 semanas.',
    minorista: { unidad: 'kg', precio: 1400, paso: 0.5, minimo: 0.5 }, mayorista: { bulto: 'Bolsa 20 kg', kg: 20, precio: 20000, stock: 180 } },
  { slug: 'remolacha', nombre: 'Remolacha', variedad: 'Con hojas', categoria: 'raices', cultivo: 'agroecologico', origen: 'campo', temporada: TODO, cosecha: 'hoy',
    descripcion: 'Remolacha roja de pulpa intensa; las hojas se usan como acelga.', conservacion: 'Heladera, hasta 2 semanas.',
    minorista: { unidad: 'kg', precio: 1600, paso: 0.5, minimo: 0.5 }, mayorista: { bulto: 'Bolsa 18 kg', kg: 18, precio: 20500, stock: 75 } },
  { slug: 'cebolla', nombre: 'Cebolla', variedad: 'Blanca, morada y valenciana', categoria: 'raices', cultivo: 'convencional', origen: 'campo', temporada: TODO, cosecha: 'ayer',
    descripcion: 'Cebollas de guarda, firmes y secas. Base de todas las comidas.', conservacion: 'Lugar seco y ventilado, hasta 1 mes.',
    minorista: { unidad: 'kg', precio: 1300, paso: 1, minimo: 1 }, mayorista: { bulto: 'Bolsa 25 kg', kg: 25, precio: 23000, stock: 240 } },
  { slug: 'ajo', nombre: 'Ajo', variedad: 'Colorado, en cabeza', categoria: 'raices', cultivo: 'agroecologico', origen: 'campo', temporada: TODO, cosecha: 'ayer',
    descripcion: 'Cabezas grandes de ajo colorado, sabor intenso.', conservacion: 'Lugar seco y aireado, hasta 3 meses.',
    minorista: { unidad: 'kg', precio: 6500, paso: 0.25, minimo: 0.25 }, mayorista: { bulto: 'Caja 10 kg', kg: 10, precio: 52000, stock: 40 } },
  { slug: 'rabanito', nombre: 'Rabanito', variedad: 'Atado', categoria: 'raices', cultivo: 'agroecologico', origen: 'campo', temporada: [3, 4, 5, 6, 7, 8, 9, 10, 11], cosecha: 'hoy',
    descripcion: 'Rabanitos picantes y crocantes. En ensalada o encurtidos.', conservacion: 'Heladera, sin hojas, hasta 1 semana.',
    minorista: { unidad: 'atado', detalle: 'aprox. 12 unidades', precio: 1300, paso: 1, minimo: 1 }, mayorista: { bulto: 'Caja x 20 atados', precio: 18000, stock: 25 } },

  // Coles
  { slug: 'brocoli', nombre: 'Brócoli', variedad: 'Cabeza grande', categoria: 'coles', cultivo: 'agroecologico', origen: 'campo', temporada: OI.concat([10]), cosecha: 'hoy', destacado: true,
    descripcion: 'Cabezas compactas, verde oscuro. Al vapor, en tartas o salteado.', conservacion: 'Heladera, hasta 5 días.',
    minorista: { unidad: 'unidad', detalle: 'aprox. 500 g', precio: 2500, paso: 1, minimo: 1 }, mayorista: { bulto: 'Caja x 12 unidades', precio: 22000, stock: 50 } },
  { slug: 'coliflor', nombre: 'Coliflor', variedad: 'Blanca', categoria: 'coles', cultivo: 'convencional', origen: 'campo', temporada: OI, cosecha: 'ayer',
    descripcion: 'Coliflor blanca y firme. Gratinada, en buñuelos o al vapor.', conservacion: 'Heladera, hasta 1 semana.',
    minorista: { unidad: 'unidad', detalle: 'aprox. 1 kg', precio: 2800, paso: 1, minimo: 1 }, mayorista: { bulto: 'Caja x 8 unidades', precio: 18500, stock: 28 } },
  { slug: 'repollo', nombre: 'Repollo', variedad: 'Crespo', categoria: 'coles', cultivo: 'convencional', origen: 'campo', temporada: OI.concat([10, 11]), cosecha: 'ayer',
    descripcion: 'Repollo crespo de hojas tiernas. Para ensaladas, chucrut y guisos.', conservacion: 'Heladera, hasta 2 semanas.',
    minorista: { unidad: 'unidad', detalle: 'aprox. 1,5 kg', precio: 2000, paso: 1, minimo: 1 }, mayorista: { bulto: 'Bolsa x 10 unidades', precio: 15000, stock: 35 } },

  // Aromáticas
  { slug: 'albahaca', nombre: 'Albahaca', variedad: 'Genovesa', categoria: 'aromaticas', cultivo: 'agroecologico', origen: 'invernadero', temporada: PV, cosecha: 'hoy',
    descripcion: 'Hojas grandes y perfumadas. Para pesto, pizzas y ensaladas caprese.', conservacion: 'En un vaso con agua, fuera de la heladera.',
    minorista: { unidad: 'atado', precio: 1400, paso: 1, minimo: 1 }, mayorista: { bulto: 'Caja x 20 atados', precio: 20000, stock: 30 } },
  { slug: 'perejil', nombre: 'Perejil', variedad: 'Crespo', categoria: 'aromaticas', cultivo: 'agroecologico', origen: 'campo', temporada: TODO, cosecha: 'hoy',
    descripcion: 'Atados frondosos y frescos. Para chimichurri, salsas y guisos.', conservacion: 'Heladera, envuelto en papel húmedo.',
    minorista: { unidad: 'atado', precio: 900, paso: 1, minimo: 1 }, mayorista: { bulto: 'Caja x 30 atados', precio: 19500, stock: 55 } },
  { slug: 'cilantro', nombre: 'Cilantro', variedad: 'Hoja', categoria: 'aromaticas', cultivo: 'agroecologico', origen: 'campo', temporada: TODO, cosecha: 'hoy',
    descripcion: 'Aroma fresco y cítrico. Para guacamole, ceviche y salsas.', conservacion: 'Heladera, en vaso con agua, hasta 5 días.',
    minorista: { unidad: 'atado', precio: 1000, paso: 1, minimo: 1 }, mayorista: { bulto: 'Caja x 30 atados', precio: 21000, stock: 40 } },

  // Frutas
  { slug: 'frutilla', nombre: 'Frutilla', variedad: 'Bandeja 500 g', categoria: 'frutas', cultivo: 'convencional', origen: 'invernadero', temporada: [8, 9, 10, 11, 12, 1], cosecha: 'hoy', destacado: true,
    descripcion: 'Frutillas dulces y perfumadas, cosechadas maduras. Plena temporada.', conservacion: 'Heladera, sin lavar, hasta 3 días.',
    minorista: { unidad: 'bandeja', detalle: '500 g', precio: 3900, antes: 4500, paso: 1, minimo: 1 }, mayorista: { bulto: 'Cajón x 12 bandejas', kg: 6, precio: 40000, stock: 48 } },
  { slug: 'limon', nombre: 'Limón', variedad: 'Eureka', categoria: 'frutas', cultivo: 'convencional', origen: 'campo', temporada: TODO, cosecha: 'ayer',
    descripcion: 'Limones jugosos de cáscara fina.', conservacion: 'Lugar fresco, hasta 2 semanas.',
    minorista: { unidad: 'kg', precio: 2200, paso: 0.5, minimo: 0.5 }, mayorista: { bulto: 'Cajón 18 kg', kg: 18, precio: 28000, stock: 65 } },
  { slug: 'naranja', nombre: 'Naranja', variedad: 'Para jugo', categoria: 'frutas', cultivo: 'convencional', origen: 'campo', temporada: [5, 6, 7, 8, 9, 10, 11], cosecha: 'ayer',
    descripcion: 'Naranjas jugosas y dulces, ideales para exprimir.', conservacion: 'Lugar fresco, hasta 2 semanas.',
    minorista: { unidad: 'kg', precio: 1700, paso: 1, minimo: 1 }, mayorista: { bulto: 'Bolsa 18 kg', kg: 18, precio: 22500, stock: 90 } },
  { slug: 'palta', nombre: 'Palta', variedad: 'Hass', categoria: 'frutas', cultivo: 'convencional', origen: 'campo', temporada: TODO, cosecha: 'ayer',
    descripcion: 'Palta Hass cremosa, lista para comer en 2 o 3 días.', conservacion: 'Ambiente hasta madurar; luego heladera.',
    minorista: { unidad: 'unidad', precio: 1900, paso: 1, minimo: 1 }, mayorista: { bulto: 'Caja 4 kg (aprox. 18 u.)', kg: 4, precio: 34000, stock: 20 } },

  // Bolsones (solo minorista)
  { slug: 'bolson-familiar', nombre: 'Bolsón familiar', variedad: '10 kg surtidos', categoria: 'bolsones', cultivo: 'agroecologico', origen: 'campo', temporada: TODO, cosecha: 'hoy', destacado: true,
    descripcion: 'Verduras de estación para una familia de 4 durante la semana: tomate, papa, cebolla, zanahoria, zapallito, lechuga, acelga y aromáticas.', conservacion: 'Guardar cada verdura según su tipo.',
    minorista: { unidad: 'bolsón', detalle: '10 kg', precio: 22000, antes: 25500, paso: 1, minimo: 1 } },
  { slug: 'bolson-verde', nombre: 'Bolsón verde', variedad: '5 kg de hojas y coles', categoria: 'bolsones', cultivo: 'agroecologico', origen: 'campo', temporada: TODO, cosecha: 'hoy',
    descripcion: 'Lechuga, acelga, espinaca, brócoli, puerro y perejil. Para comer más verde.', conservacion: 'Heladera, en bolsas abiertas.',
    minorista: { unidad: 'bolsón', detalle: '5 kg', precio: 14000, paso: 1, minimo: 1 } },
];

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);

/** ¿Está en temporada este mes? */
export const deEstacion = (p: Product, month = new Date().getMonth() + 1) => p.temporada.length < 12 && p.temporada.includes(month);
