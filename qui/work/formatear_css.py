from pathlib import Path
source = Path('outputs/styles.css').read_text(encoding='utf-8')
result = []
indent = 0
buffer = ''
for char in source:
    if char == '{':
        selector = buffer.strip()
        result.append('  ' * indent + selector + ' {')
        buffer = ''
        indent += 1
    elif char == ';':
        declaration = buffer.strip()
        if declaration:
            result.append('  ' * indent + declaration + ';')
        buffer = ''
    elif char == '}':
        declaration = buffer.strip()
        if declaration:
            result.append('  ' * indent + declaration)
        indent = max(0, indent - 1)
        result.append('  ' * indent + '}')
        buffer = ''
    else:
        buffer += char
if buffer.strip():
    result.append('  ' * indent + buffer.strip())
formatted = '\n'.join(result)
# Add section labels so the stylesheet can be scanned and maintained by role.
labels = [
    (':root', '/* 1. Variables de color y tipografía */\n:root'),
    ('* {', '/* 2. Base, enlaces y controles */\n* {'),
    ('.announcement {', '/* 3. Aviso superior y encabezado */\n.announcement {'),
    ('.hero {', '/* 4. Portada principal */\n.hero {'),
    ('.trust-strip {', '/* 5. Franja de beneficios */\n.trust-strip {'),
    ('.section-wrap {', '/* 6. Catálogo y filtros */\n.section-wrap {'),
    ('.story {', '/* 7. Historia de marca y contacto */\n.story {'),
    ('.footer {', '/* 8. Pie de página */\n.footer {'),
    ('.product-dialog {', '/* 9. Ventana de detalle del producto */\n.product-dialog {'),
    ('@media(max-width:850px)', '/* 10. Ajustes para pantallas medianas */\n@media(max-width:850px)'),
    ('@media(max-width:620px)', '/* 11. Ajustes para móviles */\n@media(max-width:620px)')
]
for old, new in labels:
    formatted = formatted.replace(old, new, 1)
Path('outputs/styles.css').write_text(formatted + '\n', encoding='utf-8')
