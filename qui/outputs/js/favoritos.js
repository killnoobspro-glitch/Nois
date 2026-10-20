/** Lista persistente de productos que cada cliente quiere guardar. */
const claveAlmacenamiento = 'tolosa-favoritos';
let favoritos = [];

try {
  const guardados = JSON.parse(localStorage.getItem(claveAlmacenamiento) || '[]');
  if (Array.isArray(guardados)) favoritos = guardados.map(Number);
} catch {
  favoritos = [];
}

/** Indica si el producto ya está en la lista de favoritos. */
export function esFavorito(idProducto) {
  return favoritos.includes(Number(idProducto));
}

/** Alterna el favorito y conserva la lista incluso después de cerrar la página. */
export function alternarFavorito(idProducto) {
  const id = Number(idProducto);
  favoritos = esFavorito(id) ? favoritos.filter((favorito) => favorito !== id) : [...favoritos, id];
  try {
    localStorage.setItem(claveAlmacenamiento, JSON.stringify(favoritos));
  } catch {
    // La lista sigue activa durante esta visita si el almacenamiento está bloqueado.
  }
  return esFavorito(id);
}

/** Devuelve una copia para que otros módulos no muten la lista compartida. */
export function obtenerFavoritos() {
  return [...favoritos];
}
