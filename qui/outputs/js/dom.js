/**
 * Referencias a los elementos del documento que usan los módulos.
 * Centralizar selectores facilita mantener el HTML y JavaScript sincronizados.
 */
export const elementos = {
  filtrosCategoria: document.querySelector('#filtros-categoria'),
  botonFavoritos: document.querySelector('#ver-favoritos'),
  busqueda: document.querySelector('#busqueda'),
  filtroMetal: document.querySelector('#filtro-metal'),
  filtroPublico: document.querySelector('#filtro-publico'),
  orden: document.querySelector('#orden-catalogo'),
  cuadrillaProductos: document.querySelector('#cuadrilla-productos'),
  contadorResultados: document.querySelector('#contador-resultados'),
  totalCatalogo: document.querySelector('#total-catalogo'),
  mensajeVacio: document.querySelector('#estado-vacio'),
  botonLimpiar: document.querySelector('#limpiar-filtros'),
  contadorBolsa: document.querySelector('#contador-bolsa'),
  enlaceBolsa: document.querySelector('.bag-link'),
  ventanaProducto: document.querySelector('#dialogo-producto'),
  contenidoVentana: document.querySelector('#contenido-dialogo'),
  contenidoCarrito: document.querySelector('#contenido-carrito'),
  totalCarrito: document.querySelector('#total-carrito'),
  botonCotizar: document.querySelector('#cotizar-carrito'),
  enlaceWhatsApp: document.querySelector('#contacto-whatsapp'),
  botonCerrarVentana: document.querySelector('.dialog-close'),
  botonMenu: document.querySelector('.menu-toggle'),
  navegacion: document.querySelector('.main-nav')
};


