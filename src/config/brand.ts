/** Datos de la empresa. Cambiar acá para personalizar la tienda. */
export const BRAND = {
  name: 'Huerta del Sol',
  tagline: 'Verduras de productor, cosechadas hoy',
  zona: 'Cinturón hortícola de La Plata',
  whatsapp: '5492215550123',
  whatsappLabel: '+54 9 221 555-0123',
  email: 'ventas@huertadelsol.com.ar',
  cuit: '30-71234567-8',
  retiros: [
    { id: 'quinta', label: 'Retiro en la quinta', detalle: 'Ruta 36 km 40, Abasto, La Plata · Lun a Sáb 7 a 14 h' },
    { id: 'mercado', label: 'Retiro en Mercado Central', detalle: 'Nave 4, puesto 112 · Lun a Sáb 4 a 11 h' },
  ],
  envio: {
    zonas: 'La Plata, CABA y Gran Buenos Aires Sur',
    costoMinorista: 3500,
    gratisDesde: 45000,
  },
  mayorista: {
    pedidoMinimo: 250000,
    tramos: [
      { desde: 10, descuento: 0.05 },
      { desde: 25, descuento: 0.1 },
    ],
  },
} as const;

export const waLink = (text: string) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
