# Tolosá — estructura del proyecto

La web estática separa páginas, módulos JavaScript, estilos e imágenes. La portada, la tienda y el carrito son páginas independientes; el carrito y los favoritos se conservan en el navegador.

## Carpetas

```text
outputs/
├── index.html                   Entrada de la web; redirige a la portada
├── styles.css                   Importa las hojas de estilos
├── estilos/                     CSS por vista y diseño responsivo
├── paginas/
│   ├── index.html               Portada
│   ├── tienda.html              Catálogo
│   └── carrito.html             Carrito y cotización
├── js/
│   ├── catalogos/               Un módulo de productos por categoría
│   ├── catalogo.js              Control de filtros
│   ├── vista-catalogo.js        Tarjetas y detalle de productos
│   ├── carrito.js               Cantidades y cotización
│   ├── favoritos.js             Favoritos guardados
│   ├── datos-productos.js       Une los catálogos por categoría
│   ├── configuracion.js         Saludo y teléfono de WhatsApp
│   ├── estado.js                Estado de la interfaz
│   ├── dom.js                   Selectores HTML
│   ├── utilidades.js            Precios e imágenes alternativas
│   └── inicio.js                Menú y arranque común
└── images/
    ├── logo-tolosa.jpg
    ├── whatsapp.svg
    └── catalogo/                Fotos agrupadas en carpetas por categoría
```

## Agregar fotos y productos

Cada producto ya tiene un nombre de archivo preparado. Copia la foto a la carpeta de su categoría usando ese nombre y aparecerá automáticamente; si todavía no has puesto la foto, se verá la ilustración provisional de esa categoría.

Consulta [la guía de imágenes](images/catalogo/README.md) para ver las carpetas, los nombres preparados y el modelo de producto. Para agregar o editar productos, abre el archivo de esa categoría dentro de `js/catalogos/`. No necesitas buscar la entrada dentro de un arreglo grande.

Las categorías actuales son balinería, herrajes, dijes, pulsos, cadenas y tobilleras. Los productos y precios incluidos son ejemplos editables.

## Funciones

- La tienda incluye búsqueda, filtros por categoría, metal y público, orden por precio y favoritos.
- En cada tarjeta puedes sumar o restar unidades. Al llegar a cero, se quita el producto del carrito.
- Carrito y favoritos se conservan tras recargar o cambiar de página en el mismo navegador.
- Los accesos flotantes a carrito y WhatsApp aparecen en todas las vistas.
- La cotización prepara el saludo, productos, cantidades, medidas, pesos y valores para WhatsApp.

## Personalización y publicación

1. Actualiza `telefonoWhatsApp` y `saludoCotizacion` en `js/configuracion.js`.
2. Cambia los colores y las fuentes al inicio de `estilos/base.css`.
3. Abre `outputs` con un servidor local como Live Server. Los módulos JavaScript no se cargan al abrir la página como archivo local.
4. Al publicar, conserva juntas todas las carpetas y páginas de `outputs`.

> La página es estática y no procesa pagos. El inventario, los precios, los pesos y las medidas deben reemplazarse por los datos reales de la joyería.
