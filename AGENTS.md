# AGENTS.md — Reglas para la IA (SAII)

## Proyecto

**SAII** — Sistema Administrativo del Instituto de Informática.

## Stack tecnológico obligatorio

- HTML5
- CSS3
- JavaScript puro / Vanilla JS
- Datos mock en JavaScript (sin backend real)

## Prohibiciones

- **No** usar React, Vue, Angular ni ningún framework JS.
- **No** usar Tailwind, Bootstrap ni ningún framework CSS.
- **No** conectar backend real ni APIs externas.
- **No** rehacer el proyecto desde cero bajo ninguna circunstancia.
- **No** reemplazar `app.js` completo salvo que sea estrictamente necesario.

## Estructura del proyecto

El frontend funcional reside en:

```
public/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── data.js
    └── app.js
```

## Arquitectura MVC

| Capa        | Archivo(s)                                      |
|-------------|--------------------------------------------------|
| **Modelo**      | `public/js/data.js`                          |
| **Vista**       | `public/index.html` y las vistas renderizadas dinámicamente |
| **Controlador** | `public/js/app.js`                           |

## Reglas de trabajo

1. **Mantener la estructura actual** del proyecto en todo momento.
2. **Mantener el login funcional** — no romper el flujo de autenticación.
3. **Mantener el modo claro/oscuro** — respetar el toggle y los estilos asociados.
4. **Mantener la identidad visual institucional** — colores, tipografía y logotipo del instituto.
5. **Trabajar por fases pequeñas** — cambios incrementales y controlados.
6. **Probar después de cada fase** — verificar que nada se rompe antes de avanzar.

## Reglas de UI/UX

- Las acciones CRUD deben usar **iconos compactos** (no botones de texto largo).
- **No deformar tablas** — respetar anchos y proporciones.
- Usar **overflow horizontal** (`overflow-x: auto`) en tablas grandes.
- Los **estados** (activo, inactivo, pendiente, etc.) siempre deben mostrarse **en español**.
