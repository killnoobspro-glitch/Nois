import { productos, categorias } from './datos-productos.js';
import { estadoCatalogo } from './estado.js';
import { elementos } from './dom.js';
import { iniciarCarrito } from './carrito.js';
import { esFavorito } from './favoritos.js';
import { mostrarCatalogo } from './vista-catalogo.js';

/** Calcula qué productos corresponden a los filtros activos. */
function obtenerProductosVisibles() {
  const consulta = estadoCatalogo.busqueda.trim().toLocaleLowerCase('es');
  const filtrados = productos.filter((producto) => {
    const coincideCategoria = estadoCatalogo.categoria === 'Todos' || producto.categoria === estadoCatalogo.categoria;
    const coincideMetal = estadoCatalogo.metal === 'todos' || producto.metal === estadoCatalogo.metal;
    const coincidePublico = estadoCatalogo.publico === 'todos' || producto.publico === estadoCatalogo.publico;
    const coincideFavorito = !estadoCatalogo.soloFavoritos || esFavorito(producto.id);
    const texto = `${producto.nombre} ${producto.categoria} ${producto.metal} ${producto.publico}`.toLocaleLowerCase('es');
    return coincideCategoria && coincideMetal && coincidePublico && coincideFavorito && texto.includes(consulta);
  });
  if (estadoCatalogo.orden === 'menor-precio') filtrados.sort((a, b) => a.precio - b.precio);
  if (estadoCatalogo.orden === 'mayor-precio') filtrados.sort((a, b) => b.precio - a.precio);
  return filtrados;
}

/** Actualiza la vista con el catálogo filtrado. */
function actualizarCatalogo() {
  mostrarCatalogo(obtenerProductosVisibles());
}

/** Crea los botones de categoría y conecta sus cambios. */
function mostrarFiltrosCategoria() {
  elementos.filtrosCategoria.innerHTML = categorias.map((categoria) => `
    <button class="filter-chip ${estadoCatalogo.categoria === categoria ? 'active' : ''}"
      data-categoria="${categoria}" aria-pressed="${estadoCatalogo.categoria === categoria}">${categoria}</button>
  `).join('');
  elementos.filtrosCategoria.querySelectorAll('[data-categoria]').forEach((boton) => {
    boton.addEventListener('click', () => {
      estadoCatalogo.categoria = boton.dataset.categoria;
      mostrarFiltrosCategoria();
      actualizarCatalogo();
    });
  });
}

/** Restaura los filtros y la búsqueda para volver a ver la colección completa. */
function limpiarFiltros() {
  estadoCatalogo.categoria = 'Todos';
  estadoCatalogo.metal = 'todos';
  estadoCatalogo.publico = 'todos';
  estadoCatalogo.busqueda = '';
  estadoCatalogo.orden = 'destacados';
  estadoCatalogo.soloFavoritos = false;
  elementos.busqueda.value = '';
  elementos.filtroMetal.value = 'todos';
  elementos.filtroPublico.value = 'todos';
  elementos.orden.value = 'destacados';
  elementos.botonFavoritos.setAttribute('aria-pressed', 'false');
  elementos.botonFavoritos.textContent = '♡ Ver favoritos';
  mostrarFiltrosCategoria();
  actualizarCatalogo();
}

/** Conecta formularios, detalle, menú y eventos de módulos relacionados. */
function conectarControles() {
  elementos.busqueda.addEventListener('input', (evento) => {
    estadoCatalogo.busqueda = evento.target.value;
    actualizarCatalogo();
  });
  elementos.filtroMetal.addEventListener('change', (evento) => {
    estadoCatalogo.metal = evento.target.value;
    actualizarCatalogo();
  });
  elementos.filtroPublico.addEventListener('change', (evento) => {
    estadoCatalogo.publico = evento.target.value;
    actualizarCatalogo();
  });
  elementos.orden.addEventListener('change', (evento) => {
    estadoCatalogo.orden = evento.target.value;
    actualizarCatalogo();
  });
  elementos.botonFavoritos.addEventListener('click', () => {
    estadoCatalogo.soloFavoritos = !estadoCatalogo.soloFavoritos;
    elementos.botonFavoritos.setAttribute('aria-pressed', String(estadoCatalogo.soloFavoritos));
    elementos.botonFavoritos.textContent = estadoCatalogo.soloFavoritos ? '♥ Mostrando favoritos' : '♡ Ver favoritos';
    actualizarCatalogo();
  });
  elementos.botonLimpiar.addEventListener('click', limpiarFiltros);
  elementos.botonCerrarVentana.addEventListener('click', () => elementos.ventanaProducto.close());
  elementos.ventanaProducto.addEventListener('click', (evento) => {
    if (evento.target === elementos.ventanaProducto) elementos.ventanaProducto.close();
  });
  elementos.botonMenu.addEventListener('click', () => {
    const abierto = elementos.navegacion.classList.toggle('open');
    elementos.botonMenu.setAttribute('aria-expanded', String(abierto));
  });
  elementos.navegacion.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => elementos.navegacion.classList.remove('open'));
  });
  document.addEventListener('tolosa:carrito-actualizado', actualizarCatalogo);
  document.addEventListener('tolosa:favoritos-actualizados', actualizarCatalogo);
}

/** Inicializa la página exclusiva de tienda y dibuja su primera vista. */
function iniciarTienda() {
  iniciarCarrito();
  conectarControles();
  mostrarFiltrosCategoria();
  actualizarCatalogo();
}

iniciarTienda();
