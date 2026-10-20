/** Convierte un número en precio legible para Colombia (pesos colombianos). */
export function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
}

/**
 * Sustituye fotos locales que aún no existan por la ilustración de su categoría.
 * Cada elemento debe incluir src y data-imagen-alternativa.
 */
export function activarImagenesAlternativas(contenedor) {
  contenedor.querySelectorAll('img[data-imagen-alternativa]').forEach((imagen) => {
    imagen.addEventListener('error', () => {
      const alternativa = imagen.dataset.imagenAlternativa;
      if (alternativa && !imagen.src.endsWith(alternativa)) imagen.src = alternativa;
    }, { once: true });
  });
}
