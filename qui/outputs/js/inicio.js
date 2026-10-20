/** Inicializa los elementos compartidos por las páginas sin lógica de catálogo. */
import { iniciarCarrito } from './carrito.js';

/** Mantiene operativo el menú desplegable en móviles. */
function iniciarNavegacion() {
  const boton = document.querySelector('.menu-toggle');
  const navegacion = document.querySelector('.main-nav');
  boton.addEventListener('click', () => {
    const abierto = navegacion.classList.toggle('open');
    boton.setAttribute('aria-expanded', String(abierto));
  });
  navegacion.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => navegacion.classList.remove('open'));
  });
}

iniciarNavegacion();
iniciarCarrito();
