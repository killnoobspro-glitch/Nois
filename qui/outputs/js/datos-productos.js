import { productosBalineria } from './catalogos/balineria.js';
import { productosHerrajes } from './catalogos/herrajes.js';
import { productosDijes } from './catalogos/dijes.js';
import { productosPulsos } from './catalogos/pulsos.js';
import { productosCadenas } from './catalogos/cadenas.js';
import { productosTobilleras } from './catalogos/tobilleras.js';

/**
 * Punto único de acceso al inventario completo.
 * Los productos están separados por categoría en la carpeta catalogos/.
 */
export const productos = [
  ...productosBalineria,
  ...productosHerrajes,
  ...productosDijes,
  ...productosPulsos,
  ...productosCadenas,
  ...productosTobilleras
];

/** Categorías que aparecen como filtros en la tienda. */
export const categorias = [
  'Todos',
  'Balinería',
  'Herrajes',
  'Dijes',
  'Pulsos',
  'Cadenas',
  'Tobilleras'
];
