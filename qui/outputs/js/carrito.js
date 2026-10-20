import { productos } from './datos-productos.js';
import { estadoCatalogo } from './estado.js';
import { elementos } from './dom.js';
import { configuracionTienda } from './configuracion.js';
import { activarImagenesAlternativas, formatearPrecio } from './utilidades.js';

// Recupera los artículos después de navegar entre la tienda y el carrito.
try {
  const carritoGuardado = JSON.parse(localStorage.getItem('tolosa-carrito') || '[]');
  if (Array.isArray(carritoGuardado)) estadoCatalogo.carrito = carritoGuardado;
} catch {
  estadoCatalogo.carrito = [];
}

/** Guarda la selección localmente para conservarla al cambiar de página. */
function guardarCarrito() {
  try {
    localStorage.setItem('tolosa-carrito', JSON.stringify(estadoCatalogo.carrito));
  } catch {
    // El carrito actual sigue operativo aunque el navegador bloquee el almacenamiento.
  }
}

/** Busca la ficha completa asociada a una línea del carrito. */
function obtenerProducto(idProducto) {
  return productos.find((producto) => producto.id === idProducto);
}

/** Cuenta unidades, no referencias, para mostrar el total junto a la bolsa. */
function actualizarContador() {
  const unidades = estadoCatalogo.carrito.reduce((total, linea) => total + linea.cantidad, 0);
  elementos.contadorBolsa.textContent = unidades;
  document.querySelectorAll('.floating-cart-count').forEach((contador) => {
    contador.textContent = unidades;
  });
  if (elementos.enlaceBolsa) {
    elementos.enlaceBolsa.setAttribute('aria-label', `Ver carrito, ${unidades} ${unidades === 1 ? 'producto' : 'productos'}`);
  }
}

/** Añade una unidad o incrementa la cantidad del producto ya seleccionado. */
export function agregarProductoAlCarrito(idProducto) {
  cambiarCantidadProducto(idProducto, 1);
}

/** Suma o resta unidades desde la tienda y sincroniza carrito, contador y vistas. */
export function cambiarCantidadProducto(idProducto, cambio) {
  const lineaExistente = estadoCatalogo.carrito.find((linea) => linea.productoId === idProducto);
  if (!lineaExistente && cambio > 0) {
    estadoCatalogo.carrito.push({ productoId: idProducto, cantidad: cambio });
  } else if (lineaExistente) {
    lineaExistente.cantidad += cambio;
    if (lineaExistente.cantidad <= 0) {
      estadoCatalogo.carrito = estadoCatalogo.carrito.filter((linea) => linea.productoId !== idProducto);
    }
  }

  guardarCarrito();
  actualizarContador();
  if (elementos.contenidoCarrito) mostrarCarrito();
  document.dispatchEvent(new CustomEvent('tolosa:carrito-actualizado'));
}

/** Dibuja el resumen del carrito y calcula el valor estimado de la selección. */
function mostrarCarrito() {
  const lineasValidas = estadoCatalogo.carrito
    .map((linea) => ({ ...linea, producto: obtenerProducto(linea.productoId) }))
    .filter((linea) => linea.producto);

  if (lineasValidas.length === 0) {
    elementos.contenidoCarrito.innerHTML = '<p class="cart-empty">Tu bolsa está vacía. Explora el catálogo y agrega las piezas que quieras cotizar.</p>';
    elementos.totalCarrito.textContent = '';
    elementos.botonCotizar.disabled = true;
    return;
  }

  elementos.contenidoCarrito.innerHTML = lineasValidas.map(({ producto, cantidad }) => `
    <article class="cart-item">
      <img class="cart-item-image" src="${producto.foto}" data-imagen-alternativa="${producto.fotoAlternativa}" alt="">
      <div class="cart-item-copy">
        <h3>${producto.nombre}</h3>
        <p>${producto.categoria} · ${producto.metal} · ${producto.publico}</p>
        <p>Medida: ${producto.medida} &nbsp;·&nbsp; Peso: ${producto.peso}</p>
        <strong>${formatearPrecio(producto.precio * cantidad)}</strong>
      </div>
      <div class="cart-item-controls" aria-label="Cantidad de ${producto.nombre}">
        <button type="button" data-accion="restar" data-id="${producto.id}" aria-label="Quitar una unidad">−</button>
        <span>${cantidad}</span>
        <button type="button" data-accion="sumar" data-id="${producto.id}" aria-label="Agregar una unidad">+</button>
        <button type="button" class="cart-remove" data-accion="eliminar" data-id="${producto.id}" aria-label="Quitar ${producto.nombre} del carrito">Quitar</button>
      </div>
    </article>
  `).join('');
  activarImagenesAlternativas(elementos.contenidoCarrito);

  const total = lineasValidas.reduce((suma, linea) => suma + linea.producto.precio * linea.cantidad, 0);
  elementos.totalCarrito.innerHTML = `<span>Total estimado</span><strong>${formatearPrecio(total)}</strong>`;
  elementos.botonCotizar.disabled = false;

  elementos.contenidoCarrito.querySelectorAll('[data-accion]').forEach((boton) => {
    boton.addEventListener('click', () => cambiarLineaCarrito(Number(boton.dataset.id), boton.dataset.accion));
  });
}

/** Cambia unidades o elimina una línea y vuelve a dibujar el resumen. */
function cambiarLineaCarrito(idProducto, accion) {
  if (accion === 'eliminar') {
    estadoCatalogo.carrito = estadoCatalogo.carrito.filter((linea) => linea.productoId !== idProducto);
    guardarCarrito();
    actualizarContador();
    mostrarCarrito();
    return;
  }
  cambiarCantidadProducto(idProducto, accion === 'sumar' ? 1 : -1);
}

/** Forma el texto con separación visual y lo abre listo para enviar por WhatsApp. */
function cotizarPorWhatsApp() {
  const lineas = estadoCatalogo.carrito.map(({ productoId, cantidad }) => {
    const producto = obtenerProducto(productoId);
    if (!producto) return null;
    return [
      `💎 ${producto.nombre} × ${cantidad}`,
      `   Metal: ${producto.metal} · Categoría: ${producto.categoria}`,
      `   Medida: ${producto.medida}`,
      `   Peso: ${producto.peso}`,
      `   Precio unitario: ${formatearPrecio(producto.precio)}`,
      `   Subtotal: ${formatearPrecio(producto.precio * cantidad)}`
    ].join('\n');
  }).filter(Boolean);

  if (lineas.length === 0) return;
  const total = estadoCatalogo.carrito.reduce((suma, linea) => {
    const producto = obtenerProducto(linea.productoId);
    return suma + (producto ? producto.precio * linea.cantidad : 0);
  }, 0);
  const mensaje = `${configuracionTienda.saludoCotizacion}\n\n${lineas.join('\n\n✨\n\n')}\n\n🧾 Total estimado: ${formatearPrecio(total)}\n\nQuedo atento/a. ¡Gracias!`;
  const url = `https://wa.me/${configuracionTienda.telefonoWhatsApp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** Conecta el acceso al carrito, el botón de cotización y el contacto general. */
export function iniciarCarrito() {
  if (elementos.botonCotizar) elementos.botonCotizar.addEventListener('click', cotizarPorWhatsApp);
  if (elementos.enlaceWhatsApp) {
    elementos.enlaceWhatsApp.href = `https://wa.me/${configuracionTienda.telefonoWhatsApp}?text=${encodeURIComponent('Hola, quisiera recibir asesoría sobre su colección.')}`;
  }
  document.querySelectorAll('.whatsapp-flotante').forEach((enlace) => {
    enlace.href = `https://wa.me/${configuracionTienda.telefonoWhatsApp}?text=${encodeURIComponent('Hola, quisiera recibir asesoría sobre su colección.')}`;
  });
  actualizarContador();
  if (elementos.contenidoCarrito) mostrarCarrito();
}
