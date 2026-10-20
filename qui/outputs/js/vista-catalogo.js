import { productos } from './datos-productos.js';
import { estadoCatalogo } from './estado.js';
import { elementos } from './dom.js';
import { activarImagenesAlternativas, formatearPrecio } from './utilidades.js';
import { agregarProductoAlCarrito, cambiarCantidadProducto } from './carrito.js';
import { alternarFavorito, esFavorito } from './favoritos.js';

/** Construye una tarjeta con precio, detalles y estado de carrito/favorito. */
function crearTarjetaProducto(producto) {
  const unidades = estadoCatalogo.carrito.find((linea) => linea.productoId === producto.id)?.cantidad ?? 0;
  const favorito = esFavorito(producto.id);
  const etiqueta = unidades ? `EN TU BOLSA · ${unidades}` : (producto.etiqueta || producto.metal.toUpperCase());

  return `
    <article class="product-card ${unidades ? 'is-selected' : ''}">
      <div class="product-image" data-abrir-producto="${producto.id}" role="button" tabindex="0" aria-label="Ver ${producto.nombre}">
        <img loading="lazy" src="${producto.foto}" data-imagen-alternativa="${producto.fotoAlternativa}" alt="${producto.nombre}, joya en ${producto.metal.toLowerCase()}" />
        <span class="product-tag">${etiqueta}</span>
        <span class="quick-view">VER DETALLES&nbsp; ↗</span>
      </div>
      <button class="favorite-toggle ${favorito ? 'is-favorite' : ''}" type="button" data-favorito="${producto.id}"
        aria-label="${favorito ? 'Quitar de' : 'Agregar a'} favoritos: ${producto.nombre}" aria-pressed="${favorito}">♥</button>
      <div class="product-meta">
        <span class="product-category">${producto.categoria} · ${producto.metal}</span>
        <h3 class="product-title">${producto.nombre}</h3>
        <div class="product-price">${formatearPrecio(producto.precio)}</div>
        <div class="product-details"><span>${producto.peso}</span><span>${producto.medida}</span></div>
        ${unidades
          ? `<div class="product-quantity-row">
              <span class="in-cart-note">EN TU CARRITO</span>
              <div class="product-quantity-controls" aria-label="Cantidad de ${producto.nombre}">
                <button type="button" data-cambio-cantidad="-1" data-producto-id="${producto.id}" aria-label="Restar una unidad de ${producto.nombre}">−</button>
                <span aria-live="polite">${unidades}</span>
                <button type="button" data-cambio-cantidad="1" data-producto-id="${producto.id}" aria-label="Sumar una unidad de ${producto.nombre}">+</button>
              </div>
            </div>`
          : `<button class="add-product-button" type="button" data-agregar-producto="${producto.id}">
              <span>Agregar al carrito</span><span aria-hidden="true">＋</span>
            </button>`}
      </div>
    </article>
  `;
}

/** Dibuja resultados y vuelve a conectar los controles de cada tarjeta. */
export function mostrarCatalogo(productosVisibles) {
  elementos.cuadrillaProductos.innerHTML = productosVisibles.map(crearTarjetaProducto).join('');
  elementos.contadorResultados.textContent = `${productosVisibles.length} ${productosVisibles.length === 1 ? 'pieza' : 'piezas'} para descubrir`;
  elementos.totalCatalogo.textContent = `${String(productosVisibles.length).padStart(2, '0')} PIEZAS`;
  elementos.mensajeVacio.hidden = productosVisibles.length > 0;
  elementos.cuadrillaProductos.hidden = productosVisibles.length === 0;
  activarImagenesAlternativas(elementos.cuadrillaProductos);

  elementos.cuadrillaProductos.querySelectorAll('[data-abrir-producto]').forEach((tarjeta) => {
    const abrir = () => mostrarDetalleProducto(Number(tarjeta.dataset.abrirProducto));
    tarjeta.addEventListener('click', abrir);
    tarjeta.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        abrir();
      }
    });
  });
  elementos.cuadrillaProductos.querySelectorAll('[data-agregar-producto]').forEach((boton) => {
    boton.addEventListener('click', () => {
      agregarProductoAlCarrito(Number(boton.dataset.agregarProducto));
    });
  });
  elementos.cuadrillaProductos.querySelectorAll('[data-cambio-cantidad]').forEach((boton) => {
    boton.addEventListener('click', () => {
      cambiarCantidadProducto(Number(boton.dataset.productoId), Number(boton.dataset.cambioCantidad));
    });
  });
  elementos.cuadrillaProductos.querySelectorAll('[data-favorito]').forEach((boton) => {
    boton.addEventListener('click', () => {
      alternarFavorito(Number(boton.dataset.favorito));
      document.dispatchEvent(new CustomEvent('tolosa:favoritos-actualizados'));
    });
  });
}

/** Abre la ficha de detalle y permite guardar favorito o añadir unidades. */
function mostrarDetalleProducto(idProducto) {
  const producto = productos.find((elemento) => elemento.id === idProducto);
  if (!producto) return;
  const cantidad = estadoCatalogo.carrito.find((linea) => linea.productoId === idProducto)?.cantidad ?? 0;
  const favorito = esFavorito(idProducto);

  elementos.contenidoVentana.innerHTML = `
    <div class="dialog-product">
        <img src="${producto.foto}" data-imagen-alternativa="${producto.fotoAlternativa}" alt="${producto.nombre}" />
      <div class="dialog-info">
        <span class="product-category">${producto.categoria} · ${producto.metal} · ${producto.publico}</span>
        <h2>${producto.nombre}</h2>
        <p class="dialog-price">${formatearPrecio(producto.precio)}</p>
        <p>Una pieza con carácter y elegancia, elegida para acompañarte en cada ocasión.</p>
        <p class="dialog-detail"><b>Peso:</b> ${producto.peso}</p>
        <p class="dialog-detail"><b>Medida:</b> ${producto.medida}</p>
        <p class="dialog-detail"><b>Material:</b> ${producto.metal}</p>
        <button class="favorite-detail ${favorito ? 'is-favorite' : ''}" id="favorito-detalle" type="button" aria-pressed="${favorito}">${favorito ? '♥ Guardado en favoritos' : '♡ Guardar en favoritos'}</button>
        <button class="button button-dark" id="agregar-bolsa">${cantidad ? `Agregar otra unidad · ${cantidad} en bolsa` : 'Agregar a mi bolsa'} <span>＋</span></button>
      </div>
    </div>
  `;

  activarImagenesAlternativas(elementos.contenidoVentana);
  document.querySelector('#agregar-bolsa').addEventListener('click', (evento) => {
    agregarProductoAlCarrito(idProducto);
    const cantidadActual = estadoCatalogo.carrito.find((linea) => linea.productoId === idProducto)?.cantidad ?? 0;
    evento.currentTarget.innerHTML = `Agregado · ${cantidadActual} en bolsa <span>✓</span>`;
  });
  document.querySelector('#favorito-detalle').addEventListener('click', (evento) => {
    const favoritoActual = alternarFavorito(idProducto);
    document.dispatchEvent(new CustomEvent('tolosa:favoritos-actualizados'));
    evento.currentTarget.classList.toggle('is-favorite', favoritoActual);
    evento.currentTarget.setAttribute('aria-pressed', String(favoritoActual));
    evento.currentTarget.textContent = favoritoActual ? '♥ Guardado en favoritos' : '♡ Guardar en favoritos';
  });
  elementos.ventanaProducto.showModal();
}
