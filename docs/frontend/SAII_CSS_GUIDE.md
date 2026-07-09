# Guía de Reglas de CSS y Diseño Responsivo en SAII

Esta guía documenta el sistema de diseño visual, los estilos de CSS puros, la tipografía, los colores y las directrices responsivas del frontend de **SAII**. Su cumplimiento es obligatorio para cualquier modificación del diseño de la aplicación.

---

## 🎨 Paleta de Colores (Diseño Institucional)

SAII utiliza variables CSS para implementar colores semánticos con buen contraste tanto en **Tema Claro** como en **Tema Oscuro**.

### Tema Claro
* `--color-primary`: `#003D82` (Azul institucional de la Universidad Nacional de Piura).
* `--color-primary-light`: `#005FB8` (Variante más brillante para elementos activos).
* `--color-accent-gold`: `#F4A261` (Color oro/naranja suave para estados en espera o alertas).
* `--color-accent-red`: `#E63946` (Color rojo académico para advertencias o notas desaprobatorias).
* `--color-bg-primary`: `#FFFFFF` (Fondo principal de las tarjetas y páginas).
* `--color-bg-secondary`: `#F8FAFC` (Fondo de barras laterales y filas alternas).
* `--color-text-primary`: `#1E293B` (Texto de alto contraste).
* `--color-text-secondary`: `#64748B` (Subtítulos e información complementaria).
* `--color-border`: `#E2E8F0` (Bordes delgados de tablas y tarjetas).

### Tema Oscuro (`html.dark-mode`)
* `--color-bg-primary`: `#0F172A` (Fondo oscuro de pizarra).
* `--color-bg-secondary`: `#1E293B` (Fondo para cabeceras y menús).
* `--color-text-primary`: `#F8FAFC` (Texto claro de alto contraste).
* `--color-text-secondary`: `#94A3B8` (Texto complementario claro).
* `--color-border`: `#334155` (Bordes oscuros suaves).

---

## ✍️ Tipografía

* **Fuente Principal**: Se utiliza **Inter** o **Roboto** importada desde Google Fonts como tipografía por defecto. En su defecto, fuentes san-serif del sistema (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Helvetica Neue`).
* **Jerarquía de Encabezados**:
  - `h1`: `1.75rem` (Títulos de vista principal).
  - `h2`: `1.25rem` (Títulos de tarjetas y cabeceras de modales).
  - `h3`: `0.95rem` (Subsecciones y títulos internos).
* **Cuerpo y Texto**:
  - Párrafos estándar: `0.9rem` con un `line-height` de `1.5` para garantizar la legibilidad académica.
  - Textos complementarios/fechas: `0.775rem`.

---

## 📏 Dimensiones Clave del Diseño

Para garantizar un diseño consistente en todas las vistas:
* **Cabecera Principal (`.header`)**:
  - Escritorio: `height: 70px !important;` (altura espaciosa para roles y menú).
  - Móviles: `height: 64px !important;`.
* **Botones e Íconos Interactivos del Header**:
  - Tamaño de superficie (Touch Target): `44px x 44px` obligatorio tanto en móvil como en escritorio.
  - El selector de simulador de rol, campana, luna de tema y avatar del perfil deben estar alineados a la derecha a este nivel de altura.
* **Margen Interno (Spacing)**:
  - `--spacing-xs`: `4px`
  - `--spacing-sm`: `8px`
  - `--spacing-md`: `16px`
  - `--spacing-lg`: `24px`
  - `--spacing-xl`: `32px`

---

## 📱 Reglas de Diseño Responsivo (Media Queries)

El diseño debe adaptarse sin deformar tablas ni encoger textos excesivamente.

### Breakpoints Estándar
1. **Desktop / Tablet (`@media (max-width: 1024px)`)**:
   - La barra lateral (`.sidebar`) se oculta y pasa a posicionamiento móvil deslizante (`transform: translateX(-100%)`).
   - Se muestra el menú hamburguesa (☰) para alternar el menú lateral.
2. **Mobile / Tablet (`@media (max-width: 768px)`)**:
   - Previsualizador de Certificados: Cambia `#certificatePreview` a `display: block` y `.certificate-diploma-wrapper` a `display: inline-block` con `zoom: 0.5` y `transform: none` para centrar y evitar desbordes a la izquierda.
   - Panel de notificaciones: Pasa a `position: fixed` centrado a `left: 50%` y `transform: translateX(-50%)` para evitar salir de los bordes laterales del celular.
3. **Mobile Estricto (`@media (max-width: 576px)`)**:
   - Cabeceras de Modales: Los títulos largos truncan con puntos suspensivos (`max-width: 50% !important; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;`) para evitar que los botones se encimen.
   - Altura de Cabecera: `64px !important`.
   - Rejillas de Filtros: Filtros en Alumnos y Grupos van al 50% de ancho en la misma fila. Filtros de Reportes y Asistencias van en rejilla de 2 columnas de ancho igual.
   - Botones de Agregar: Reducidos a la mitad del tamaño de ancho y alineados a la derecha.

---

## 🚫 Prohibiciones Técnicas

* **No usar Tailwind, Bootstrap ni frameworks externos**. Todo el CSS debe ser Vanilla CSS en `public/css/styles.css`.
* **No usar placeholders**. Todas las vistas deben renderizar datos formateados legibles y limpios.
* **No usar posicionamientos absolutos en modales que vayan a pantalla completa** sin neutralizar la propiedad `transform` (`transform: none !important;`).
* **No deformar las tablas**. Usar `overflow-x: auto;` y `-webkit-overflow-scrolling: touch;` en los contenedores de las tablas grandes para permitir deslizamiento táctil horizontal fluido.
