/**
 * Estado compartido de la interfaz.
 * Cada módulo consulta o actualiza estos valores al interactuar con el catálogo.
 */
export const estadoCatalogo = {
  categoria: 'Todos',
  metal: 'todos',
  publico: 'todos',
  busqueda: '',
  orden: 'destacados',
  soloFavoritos: false,
  carrito: []
};
