const fs = await import('node:fs');
const ruta = 'outputs/styles.css';
const origen = fs.readFileSync(ruta, 'utf8');
const lineas = [];
let nivel = 0;
let fragmento = '';
for (const caracter of origen) {
  if (caracter === '{') {
    lineas.push(`${'  '.repeat(nivel)}${fragmento.trim()} {`);
    fragmento = '';
    nivel++;
  } else if (caracter === ';') {
    const declaracion = fragmento.trim();
    if (declaracion) lineas.push(`${'  '.repeat(nivel)}${declaracion};`);
    fragmento = '';
  } else if (caracter === '}') {
    const declaracion = fragmento.trim();
    if (declaracion) lineas.push(`${'  '.repeat(nivel)}${declaracion}`);
    nivel = Math.max(0, nivel - 1);
    lineas.push(`${'  '.repeat(nivel)}}`);
    fragmento = '';
  } else {
    fragmento += caracter;
  }
}
if (fragmento.trim()) lineas.push(`${'  '.repeat(nivel)}${fragmento.trim()}`);
let css = lineas.join('\n');
const secciones = [
  [':root {', '/* 1. Variables de color y tipografía */\n:root {'],
  ['* {', '/* 2. Estilos base y controles */\n* {'],
  ['.announcement {', '/* 3. Aviso superior y navegación */\n.announcement {'],
  ['.hero {', '/* 4. Portada principal */\n.hero {'],
  ['.trust-strip {', '/* 5. Franja de beneficios */\n.trust-strip {'],
  ['.section-wrap {', '/* 6. Catálogo y filtros */\n.section-wrap {'],
  ['.story {', '/* 7. Historia de marca y contacto */\n.story {'],
  ['.footer {', '/* 8. Pie de página */\n.footer {'],
  ['.product-dialog {', '/* 9. Ventana de detalle del producto */\n.product-dialog {'],
  ['@media(max-width:850px) {', '/* 10. Ajustes para pantallas medianas */\n@media(max-width:850px) {'],
  ['@media(max-width:620px) {', '/* 11. Ajustes para móviles */\n@media(max-width:620px) {']
];
for (const [busqueda, reemplazo] of secciones) css = css.replace(busqueda, reemplazo);
fs.writeFileSync(ruta, `${css}\n`, 'utf8');
