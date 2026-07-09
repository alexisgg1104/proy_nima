# AGENTS.md — Reglas para agentes de IA en SAII

## Propósito de este documento

Este archivo es la guía principal para cualquier agente de IA que trabaje en el proyecto **SAII** dentro de Antigravity.

El objetivo es que el usuario pueda dar una instrucción corta como:

```text
Lee README.md y haz la Fase X.
```

Cuando el agente reciba una instrucción así, **no debe pedir que se le vuelva a explicar la fase**. Debe leer primero `README.md`, obedecer la instrucción inicial de ese archivo, leer la documentación referenciada, ubicar la fase solicitada, ejecutar únicamente esa fase y respetar el alcance definido.

---

## Orden obligatorio de lectura para el agente

El punto de entrada oficial es `README.md`. Antes de modificar código, el agente debe hacer esto:

1. Leer `README.md`.
2. Obedecer la primera instrucción del `README.md`: leer `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md` y `SAII_ESTADO_Y_PROMPTS.md`.
3. Leer este `AGENTS.md` si está presente, porque define reglas técnicas obligatorias.
4. Si la fase tiene un documento específico referenciado, leerlo también. Para la **Fase 5**, leer `SAII_ASISTENCIA_ALUMNOS.md`.

> [!IMPORTANT]
> El usuario no tiene que volver a escribir todo el prompt de la fase. Si dice **“Lee README.md y haz la Fase X”**, el agente debe buscar la Fase X en `SAII_ESTADO_Y_PROMPTS.md` y ejecutarla.

---

## Regla de ejecución por fase

- Ejecutar **solo la fase indicada** por el usuario.
- No mezclar varias fases.
- No avanzar a la siguiente fase sin autorización.
- No pedir detalles que ya estén definidos en los `.md`.
- No cambiar el alcance funcional de la fase.
- No eliminar funcionalidades existentes que ya estén operativas.
- No trabajar directo sobre `main`; usar rama por fase cuando se vaya a subir a GitHub.
- Al finalizar una fase, actualizar el resumen correspondiente en la **bitácora de fases** de `SAII_BACKLOG.md`.

Si aparece una contradicción entre documentos, resolver así:

1. Gana primero `AGENTS.md` para reglas generales, límites técnicos y forma de trabajo.
2. Gana `SAII_CONTEXTO_CONTINUIDAD.md` para estado real del proyecto y continuidad.
3. Gana `SAII_ESTADO_Y_PROMPTS.md` para tareas concretas de cada fase.
4. Gana el documento específico de la fase si existe. Para Fase 5, gana `SAII_ASISTENCIA_ALUMNOS.md`.
5. Si todavía hay contradicción fuerte, hacer la mínima implementación segura y explicar la decisión al final.

---

## Proyecto

**SAII** — Sistema Administrativo del Instituto de Informática.

Institución: **Universidad Nacional de Piura — Facultad de Ingeniería Industrial**.

---

## Alcance general del proyecto

SAII tendrá dos etapas principales:

### Etapa actual — Frontend funcional con datos mock

La etapa actual trabaja principalmente el frontend interactivo en:

```text
public/index.html
public/css/styles.css
public/js/data.js
public/js/app.js
```

Durante esta etapa se usan datos simulados en JavaScript para poder presentar, probar y validar el flujo académico sin depender todavía del backend.

### Etapa posterior — Backend real

El proyecto **sí tendrá backend real** más adelante. Su planificación oficial está definida en `SAII_BACKEND_BACKLOG.md`.

La etapa posterior debe contemplar:

- PHP con arquitectura Modelo-Vista-Controlador (MVC).
- Base de datos MySQL.
- Login real y control de sesiones.
- API o controladores para CRUD reales.
- Persistencia de alumnos, docentes, cursos, grupos, matrículas, asistencias, notas, certificados, usuarios, roles y configuración.

> [!NOTE]
> El agente solo debe implementar código PHP o alterar la base de datos cuando el usuario solicite explícitamente una fase de backend (ej: "Lee README.md y haz la Fase B1").

---

## Stack tecnológico obligatorio para las fases actuales de frontend

- HTML5.
- CSS3.
- JavaScript puro / Vanilla JS.
- CSS personalizado propio.
- Datos mock en JavaScript durante la etapa actual.
- Sin React, Vue, Angular ni otros frameworks JavaScript.
- Sin Tailwind, Bootstrap ni frameworks CSS.

---

## Stack tecnológico obligatorio para las fases de backend

- Backend: PHP 8.0+ sin frameworks (Vanilla PHP).
- Base de datos: MySQL / MariaDB (usando XAMPP y phpMyAdmin en local).
- Acceso a datos: PDO (PHP Data Objects) con consultas preparadas obligatorias.
- Estructura: Patrón MVC con división estricta en capas (Controllers, Models, router index.php).
- Formato de intercambio: Respuestas estructuradas únicamente en formato JSON mediante la cabecera `Content-Type: application/json`.
- Seguridad: Sesiones nativas de PHP seguras, contraseñas con hash (`password_hash`), validación en el servidor, middleware de verificación de roles y protección CSRF.


---

## Prohibiciones durante fases frontend

- **No** usar React, Vue, Angular ni ningún framework JavaScript.
- **No** usar Tailwind, Bootstrap ni ningún framework CSS.
- **No** conectar backend real, APIs externas ni base de datos real durante una fase frontend, salvo instrucción explícita.
- **No** rehacer el proyecto desde cero bajo ninguna circunstancia.
- **No** reemplazar `app.js` completo salvo que sea estrictamente necesario.
- **No** modificar `app/`, `components/` ni `lib/`, salvo indicación explícita del usuario.
- **No** convertir el proyecto a otra arquitectura durante las fases actuales.
- **No** eliminar funcionalidades existentes que ya estén operativas.
- **No** trabajar directo en `main` para nuevas fases.

---

## Estructura del proyecto

El frontend funcional reside en:

```text
public/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── data.js
    └── app.js
```

La carpeta raíz puede tener archivos de Next.js, pero para esta etapa el frontend real interactivo está en:

```text
http://localhost:3000/index.html
```

No validar el frontend principal entrando solo a:

```text
http://localhost:3000/
```

---

## Arquitectura MVC simulada en frontend

| Capa | Archivo(s) | Regla |
|---|---|---|
| **Modelo** | `public/js/data.js` | Datos mock, colecciones, relaciones y funciones `DataManager`. |
| **Vista** | `public/index.html` y vistas renderizadas dinámicamente | Estructura HTML, contenedores y plantillas visibles. |
| **Controlador** | `public/js/app.js` | Lógica de módulos, eventos, renderizado, filtros y validaciones. |
| **Estilos** | `public/css/styles.css` | Diseño institucional, responsive, tablas, modales, badges y tema. |

---

## Reglas de trabajo

1. Mantener la estructura actual del proyecto.
2. Mantener el login funcional.
3. Mantener el modo claro/oscuro.
4. Respetar el toggle de tema y la persistencia en `localStorage`.
5. Mantener la identidad visual institucional.
6. Trabajar por fases pequeñas e incrementales.
7. Las pruebas y tests en el navegador son ejecutados manualmente por el usuario. El agente no debe iniciar subagentes de navegación web ni scripts de pruebas automatizadas por su cuenta.
8. El agente se limitará a estructurar el código y documentar los pasos detallados de prueba.
9. No avanzar sin que la fase actual sea reportada como estable por el usuario tras su validación manual.
10. Al terminar, informar archivos modificados, funciones modificadas y pasos de prueba.
11. Al terminar, pegar el resumen técnico de la fase en `SAII_BACKLOG.md`, dentro de la sección **Bitácora de ejecución de fases**.

---

## Reglas de UI/UX

- Las acciones CRUD deben usar **iconos compactos**, no botones largos de texto.
- No deformar tablas.
- Usar `overflow-x: auto` en tablas grandes.
- Los estados deben mostrarse siempre en español.
- Mantener diseño institucional, limpio, académico y sobrio.
- Evitar tarjetas o tablas saturadas.
- Usar modales cuando la acción necesite detalle, edición o confirmación.
- Mantener responsive en desktop, tablet y móvil.
- Mantener buen contraste en modo claro y modo oscuro.

---

## Regla especial para la Fase 5

La **Fase 5 es Control de Asistencia de Alumnos**.

El docente es quien registra la asistencia de sus alumnos por grupo, fecha y sesión.

La Fase 5 **no** es control de asistencia docente ni horas dictadas del docente.

Documento obligatorio para la Fase 5:

```text
SAII_ASISTENCIA_ALUMNOS.md
```

Nomenclatura técnica recomendada para Fase 5:

- Colección principal: `studentAttendance[]`.
- Registros de alumnos por sesión: `records[]`.
- ID de sesión/lista: `ATT001`, `ATT002`, etc.
- Estado por alumno: `presente`, `tarde`, `falta`, `justificado`.
- Estado de la lista de asistencia: `borrador`, `registrada`, `cerrada`, `observada`.
- Relación con grupo: `groupId`.
- Relación con docente: `teacherId`.
- Relación con alumno: `studentId`.

No crear estructuras duplicadas con nombres alternativos si ya se está usando la nomenclatura anterior.

---

## Prompt mínimo válido para Antigravity

Para ejecutar cualquier fase, el usuario debe escribir únicamente:

```text
Lee README.md y haz la Fase X.
```
O para fases de backend:
```text
Lee README.md y haz la Fase Bx.
```

El agente debe interpretar `X` o `Bx` como el número de fase, leer el `README.md` y seguir las referencias internas:
- Para fases frontend: buscar el prompt operativo correspondiente en `SAII_ESTADO_Y_PROMPTS.md`.
- Para fases backend: buscar el prompt operativo correspondiente en `SAII_BACKEND_ESTADO_Y_PROMPTS.md`.
- Para la Fase 5: leer adicionalmente `SAII_ASISTENCIA_ALUMNOS.md`.


---

## Formato obligatorio de respuesta al finalizar una fase

Al terminar, el agente debe responder con este formato:

```text
Fase aplicada: Fase X — nombre de la fase

Archivos modificados:
- public/js/app.js
- public/js/data.js
- public/css/styles.css
- public/index.html, si aplica
- SAII_BACKLOG.md, si se actualizó la bitácora

Funciones modificadas o creadas:
- nombreFuncion1()
- nombreFuncion2()

Cómo probar:
1. Ejecutar npm run dev
2. Abrir http://localhost:3000/index.html
3. Iniciar sesión con el rol correspondiente
4. Ir al módulo modificado
5. Probar acciones principales
6. Revisar consola del navegador

Validaciones realizadas:
- Login no se rompió
- Sidebar funciona
- Modo claro/oscuro funciona
- No hay errores JS visibles en consola
- La fase solicitada funciona

Comandos Git para subir cambios:
1. git checkout -b alexis/fase-X-nombre-fase
2. git add .
3. git commit -m "feat: fase X descripcion"
4. git push -u origin alexis/fase-X-nombre-fase

Resumen para pegar en SAII_BACKLOG.md:
- Fecha:
- Rama:
- Commit:
- Fase:
- Archivos modificados:
- Funciones modificadas:
- Pruebas realizadas:
- Pendientes o riesgos:
```

---

## Reglas Generales de Negocio y Base de Datos

- **Regla de Integridad de Datos (Auditoría)**: Un dato grabado en la base de datos no debe ser borrado físicamente. Esta es una regla de negocio inmutable. En su lugar, el registro debe ser desactivado cambiando su estado (por ejemplo, a `'inactive'`), permaneciendo en la tabla correspondiente para fines de auditoría e historial.

---

## Arquitectura, Seguridad, Lógica y Componentes de SAII

Para mantener la robustez, limpieza y escalabilidad del proyecto **SAII**, cualquier agente de IA debe adherirse estrictamente a las siguientes especificaciones técnicas de diseño e implementación:

### 1. Arquitectura y División de Responsabilidades (Clean Architecture)
El sistema divide su lógica de negocio de la siguiente manera:
* **Base de Datos**: Los DDL estructurados residen en `database/schema.sql`. Las semillas iniciales residen en `database/seeds.sql`. Toda modificación del esquema debe soportar una auto-migración en `config/Database.php`.
* **Backend (Vanilla PHP MVC)**:
  - **Modelos**: Residen en `app/Models/`. Representan tablas de la base de datos y contienen únicamente consultas SQL mediante PDO.
  - **Controladores**: Residen en `app/Controllers/`. Manejan la validación de entrada, autenticación/autorización y devuelven respuestas estructuradas únicamente en formato JSON.
  - **Router**: El archivo `public/index.php` actúa como el despachador único y manejador del enrutamiento.
* **Frontend (Vanilla HTML/CSS/JS)**:
  - **Modelos/Datos**: `public/js/data.js` maneja la abstracción de datos (`DataManager`) y soporta indistintamente llamadas al API REST o simulación local mediante datos ficticios (`USE_MOCK = true/false`).
  - **Controladores/Vistas**: `public/js/app.js` maneja el enrutamiento visual, la carga de vistas dinámicas, el renderizado de tablas, la validación de formularios en el cliente y la interactividad.

### 2. Normas de Seguridad Obligatorias
* **Control de Concurrencia (Sesión Única)**: Al iniciar sesión, se graba en la base de datos el `session_id` del PHP actual y el timestamp `last_activity`. Si el usuario intenta iniciar sesión desde otro dispositivo mientras la última actividad tiene menos de 5 minutos, la autenticación es rechazada con un código `409 Conflict`.
* **Prevención CSRF**: Las peticiones de modificación de datos (`POST`, `PUT`, `DELETE`) validan estrictamente el token CSRF contenido en la cabecera `X-CSRF-TOKEN` contra el token almacenado en la sesión, excepto para los endpoints de `/api/auth/login` y `/api/auth/logout`.
* **Prevención de Inyección SQL**: Queda estrictamente prohibido concatenar variables en consultas SQL. Se deben usar únicamente consultas parametrizadas y preparadas con PDO (`prepare` y `execute`).
* **Seguridad de Archivos**: Los archivos delicados generados por el servidor (ej. copias de seguridad SQL o certificados) se almacenan en carpetas protegidas por un archivo `.htaccess` conteniendo `Deny from all`. Su descarga se realiza exclusivamente mediante transmisión binaria segura controlada por el backend en controladores autorizados.
* **Verificación de Roles (Rbac)**: Los endpoints protegidos en los controladores validan los privilegios llamando a `$this->requireAuth(['admin', ...])`. En el frontend, `loadView()` redirige automáticamente al usuario si no posee el permiso en su matriz de roles.

### 3. Consistencia de Interfaz y Componentes (UI/UX)
* **Rejillas y Tablas**: Las tablas de datos deben ser responsive (`.table-responsive`) y estructuradas obligatoriamente bajo la clase `.data-table`.
* **Badges Semánticos**: Los estados y badges se estilizan con la clase base `.badge-status` acompañada de su modificador semántico (`badge-active`, `badge-inactive`, `badge-pending`, `badge-rejected`, `badge-inprogress`, `badge-finished`), garantizando una consistencia visual absoluta en todos los módulos.
* **Iconografía Lineal**: Queda terminantemente prohibido utilizar emojis coloridos o pesados en tablas o botones interactivos de celdas. Se deben usar símbolos Unicode lineales y estilizados (ej. `🔎`, `📥`, `🗑`, `✏️`, `🔑`) o iconos SVG vectoriales con trazo fino.
* **Acciones en Celdas**: Las operaciones se colocan bajo un contenedor `<div class="action-icons">` en botones de iconos compactos `.icon-btn` con clase de color específica. No se permite insertar texto como "Editar" o "Eliminar" en celdas de tablas.

---

## Regla sobre el resumen en el backlog

Al terminar cada fase:
- Para fases frontend: el agente debe actualizar `SAII_BACKLOG.md` en la sección `## Bitácora de ejecución de fases`.
- Para fases backend: el agente debe actualizar `SAII_BACKEND_BACKLOG.md` en la sección `## Bitácora de ejecución de fases de backend`.

Debe agregar un resumen breve pero útil con:

- fecha;
- fase ejecutada;
- rama usada;
- commit o mensaje sugerido;
- archivos modificados;
- funciones creadas o modificadas;
- pruebas manuales realizadas;
- errores corregidos;
- pendientes o riesgos.

Si el usuario todavía no quiere que el agente edite el backlog, entonces el agente debe entregar el bloque listo para copiar y pegar.
