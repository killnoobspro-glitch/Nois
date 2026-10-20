import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const ruta = 'outputs/styles.css';
const css = readFileSync(ruta, 'utf8');
const marcas = [
  '/* 4. Portada principal */',
  '/* 6. Catálogo y filtros */',
  '/* 7. Historia de marca y contacto */',
  '/* 10. Ajustes para pantallas medianas */'
].map((marca) => css.indexOf(marca));
if (marcas.some((posicion) => posicion < 0)) throw new Error('No se encontraron todas las secciones CSS esperadas.');
mkdirSync('outputs/estilos', { recursive: true });
const limites = [0, ...marcas, css.length];
const nombres = ['base.css', 'portada.css', 'tienda.css', 'secciones.css', 'responsivo.css'];
nombres.forEach((nombre, indice) => {
  writeFileSync(`outputs/estilos/${nombre}`, css.slice(limites[indice], limites[indice + 1]).trim() + '\n', 'utf8');
});
writeFileSync(ruta, [
  "@import url('./estilos/base.css');",
  "@import url('./estilos/portada.css');",
  "@import url('./estilos/tienda.css');",
  "@import url('./estilos/secciones.css');",
  "@import url('./estilos/responsivo.css');",
  ''
].join('\n'), 'utf8');
