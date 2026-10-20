# Fotografías del catálogo

Coloca aquí las fotos de los productos. Las tarjetas ya tienen una ruta preparada para cada producto; si guardas la imagen con ese nombre y extensión, aparecerá automáticamente sin cambiar su entrada de catálogo.

## Carpetas y nombres preparados

| Categoría | Carpeta | Fotos de ejemplo esperadas |
|---|---|---|
| Balinería | `balineria/` | `anillo-sello-norte.jpg`, `anillo-balines.jpg` |
| Herrajes | `herrajes/` | `argollas-alba.jpg`, `broche-flor-antigua.jpg` |
| Dijes | `dijes/` | `dije-aura.jpg`, `dije-estrella-serena.jpg` |
| Pulsos | `pulsos/` | `pulso-eslabon-luz.jpg`, `pulso-nudo-marino.jpg` |
| Cadenas | `cadenas/` | `cadena-tejido-clasico.jpg`, `cadena-punto-fino.jpg` |
| Tobilleras | `tobilleras/` | `tobillera-destello.jpg`, `tobillera-cadena-suave.jpg` |

Las rutas de imagen se definen en el módulo de la categoría correspondiente dentro de `js/catalogos/`. Por ejemplo, el producto `Cadena Tejido Clásico` usa `images/catalogo/cadenas/cadena-tejido-clasico.jpg`.

## Agregar una foto

1. Copia la foto optimizada a la carpeta de su categoría.
2. Usa el nombre preparado de la tabla, o cambia el valor `foto` del producto en su archivo JavaScript.
3. Se aceptan JPG, PNG, WEBP o SVG si también actualizas la extensión de `foto`.

Cada categoría incluye un `placeholder.svg`. Mientras la foto real no exista, la página muestra esa ilustración para evitar una imagen rota.

## Agregar un nuevo producto

Añade otro objeto al arreglo de productos de la categoría en `js/catalogos/`. Cada objeto debe tener un `id` único y estos campos:

```js
{
  id: 13,
  nombre: 'Nombre de la joya',
  categoria: 'Cadenas',
  metal: 'Plata',
  publico: 'Unisex',
  precio: 180000,
  peso: '4.2 g',
  medida: '50 cm',
  etiqueta: 'NUEVO',
  foto: '../images/catalogo/cadenas/nombre-de-la-joya.jpg',
  fotoAlternativa: '../images/catalogo/cadenas/placeholder.svg'
}
```

Para una categoría nueva, crea su carpeta dentro de `images/catalogo/`, su módulo en `js/catalogos/`, importa ese arreglo en `js/datos-productos.js` y agrega el nombre a `categorias` en ese mismo archivo.
