# SAII - Sistema Administrativo del Instituto de Informática

> [!IMPORTANT]
> ## INSTRUCCIÓN PRINCIPAL PARA ANTIGRAVITY / AGENTES DE IA
>
> El punto de entrada oficial para trabajar con agentes es este archivo: `README.md`.
>
> Cuando el usuario escriba:
>
> ```text
> Lee README.md y haz la Fase X.
> ```
>
> el agente debe interpretar que **no necesita que el usuario le repita todos los detalles de la fase**.
>
> **Primera instrucción obligatoria:** leer los archivos `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md` y `SAII_ESTADO_Y_PROMPTS.md`. También debe leer `AGENTS.md` si existe en el proyecto, porque contiene reglas técnicas obligatorias para agentes.
>
> Si la fase solicitada tiene un documento específico, el agente debe leerlo también aunque el usuario no lo mencione. Para la **Fase 5**, debe leer `SAII_ASISTENCIA_ALUMNOS.md`.
>
> Después de leer la documentación, debe ejecutar **solo la Fase X**, respetar las restricciones del proyecto, probar los cambios y actualizar `SAII_BACKLOG.md` con el resumen que el propio agente elabore al terminar.

## Descripción General

SAII es un sistema web administrativo académico completo para el Instituto de Informática de la Universidad Nacional de Piura. Está diseñado inicialmente con HTML, CSS y JavaScript puro (Vanilla JS) para construir un frontend funcional con datos mock. El alcance final del proyecto contempla backend real en PHP con arquitectura MVC y base de datos MySQL.

El sistema proporciona una solución profesional para la gestión integral de estudiantes, cursos, docentes, grupos académicos, matrículas, asistencia de alumnos, calificaciones, certificados académicos, reportes, usuarios, roles y configuración institucional.

---

## Documentación para trabajar con agentes de IA

El usuario **solo debe dar este prompt corto** en Antigravity:

```text
Lee README.md y haz la Fase X.
```

Con esa instrucción, el agente debe usar este `README.md` como puerta de entrada y, por obligación de este documento, leer los demás archivos de soporte:

*Documentación de la Etapa Frontend:*
- `SAII_CONTEXTO_CONTINUIDAD.md` — contexto, estado actual, frontend actual, backend futuro y continuidad.
- `SAII_BACKLOG.md` — mapa general de fases, estado de avance y bitácora de ejecución de fases frontend.
- `SAII_ESTADO_Y_PROMPTS.md` — detalle operativo de cada fase y reglas para ejecutar `Haz la Fase X` en frontend.
- `AGENTS.md` — reglas obligatorias para agentes de IA (frontend y backend).
- `SAII_ASISTENCIA_ALUMNOS.md` — especificación completa de la Fase 5.

*Documentación de la Etapa Backend y Base de Datos:*
- `SAII_BACKEND_CONTEXTO.md` — contexto de la etapa backend, riesgos y estrategia de integración.
- `SAII_BACKEND_BACKLOG.md` — backlog de fases backend (B0 a B10) y su respectiva bitácora.
- `SAII_BACKEND_ESTADO_Y_PROMPTS.md` — prompts operativos detallados por cada fase backend.
- `SAII_BACKEND_DB_SCHEMA.md` — diseño relacional de base de datos MySQL, diccionario de 17 tablas, scripts DDL y DML (seeds).
- `SAII_BACKEND_API_CONTRATO.md` — contrato de endpoints JSON de la API PHP y mapeo de funciones de DataManager.
- `SAII_BACKEND_SEGURIDAD.md` — checklist de seguridad, validación de variables, sesiones seguras, CSRF e inyección SQL.
- `SAII_BACKEND_MIGRACION_MOCK.md` — mapeo, reestructuración y normalización de mockData en JS a registros SQL.
- `README_BACKEND_SETUP.md` — guía paso a paso de instalación local, phpMyAdmin y ejecución del servidor.


El agente debe ejecutar solo la fase solicitada, sin pedir que se le repitan detalles ya documentados.

Para la Fase 5, el agente debe saber por este `README.md` que también debe leer:

```text
SAII_ASISTENCIA_ALUMNOS.md
```

---

## Alcance por etapas

### Etapa actual: Frontend funcional con datos mock

- HTML5.
- CSS3.
- JavaScript puro / Vanilla JS.
- CSS personalizado propio.
- Datos simulados en `public/js/data.js`.
- Lógica principal en `public/js/app.js`.
- Sin conexión real a backend durante estas fases frontend.

### Etapa posterior: Backend real

El proyecto final sí tendrá backend real con:

- PHP 8+ y MySQL/MariaDB bajo arquitectura MVC estructurada por capas.
- Persistencia de datos reales para todas las entidades en base de datos.
- Login y sesiones seguras en el servidor, control de roles e integridad de datos.
- Reemplazo progresivo de DataManager por peticiones fetch a la API PHP.
- Para ver el plan completo, fases y prompts del backend, leer `SAII_BACKEND_CONTEXTO.md` y `SAII_BACKEND_BACKLOG.md`.


---

## Características Principales

### 1. **Autenticación y Roles**

- Sistema de login con simulación de credenciales durante la etapa frontend.
- 4 roles de usuario: Administrador, Secretaria Académica, Docente, Coordinador Académico.
- Control de acceso basado en roles.
- Menú adaptativo según permisos del usuario.

### 2. **Dashboard Principal**

- 8 KPI cards con métricas clave del sistema.
- Gráficos de aprobados vs. desaprobados.
- Barra de progreso de notas registradas.
- Accesos rápidos a funciones principales.
- Feed de actividad reciente.

### 3. **Gestión de Alumnos**

- CRUD completo de estudiantes.
- Búsqueda avanzada por código, DNI y nombres.
- Filtros por estado, ciclo y promoción.
- Validación de datos: código de 10 dígitos y DNI de 8 dígitos.
- Modal para crear/editar estudiantes.

### 4. **Cursos y Módulos**

- Vista de cursos en grid cards.
- Información de módulos por curso.
- Verificación de porcentajes, que deben sumar 100%.
- Cursos predefinidos con módulos detallados:
  - Computación Básica: Windows 20%, Word 40%, Excel 40%.
  - Microsoft Office: 6 módulos.
  - Computación para Ingenieros: 7 módulos.

### 5. **Gestión de Docentes**

- Tabla de docentes con especialidades.
- Búsqueda y filtrado.
- Estados activo/inactivo.
- Especialidades como Ofimática, Programación, Diseño, Matemática/Matlab.

### 6. **Grupos Académicos**

- Creación de grupos por curso y modalidad.
- Modalidades: Curso regular y Examen de suficiencia.
- Estados: Abierto, En curso, Terminado, Cerrado.
- Asignación de docentes y horarios.
- Base para matrícula, asistencia de alumnos, registro de notas y certificados.

### 7. **Matrículas**

- Interfaz de doble panel para matrícula de alumnos.
- Búsqueda de alumnos disponibles.
- Control de cupo máximo.
- Tabla de alumnos matriculados.
- Función para remover o retirar alumnos.
- Prevención de matrícula duplicada en el mismo grupo.

### 8. **Control de Asistencia de Alumnos**

- Registro realizado por el docente.
- El docente solo ve sus grupos asignados.
- La lista se genera desde los alumnos matriculados en el grupo.
- Registro por grupo y fecha.
- Estados por alumno:
  - Presente.
  - Tarde.
  - Falta.
  - Justificado.
- Observaciones por alumno.
- Resumen de asistencia:
  - Total matriculados.
  - Presentes.
  - Tardes.
  - Faltas.
  - Justificados.
  - Porcentaje de asistencia efectiva.
- Vista Docente para registrar asistencia.
- Vista Administrador para consultar, observar, cerrar, imprimir o exportar asistencias.
- Vista Secretaria/Coordinador de consulta según permisos.

### 9. **Registro de Notas**

- Tabla tipo Excel académico.
- Módulos como columnas con pesos porcentuales.
- Cada alumno como fila.
- Cálculo automático de promedio ponderado.
- Validación de notas de 0 a 20.
- Estados: Pendiente, Aprobado (>=11) y Desaprobado (<11).
- Cerrar acta y exportar.

### 10. **Certificados y Constancias**

- Vista previa del certificado.
- Dos tipos: Curso regular y Examen de suficiencia.
- Datos completos: alumno, promedio, horas académicas, período.
- Generación de código único.
- Funciones de impresión y descarga simuladas.
- Validación futura con nota aprobatoria y asistencia mínima de alumnos si aplica.

### 11. **Reportes**

- Tarjetas KPI con estadísticas.
- Tabla de reporte detallado por grupo.
- Conteos de aprobados/desaprobados.
- Promedios generales.
- Estadísticas de certificados.
- Estadísticas de asistencia de alumnos.
- Métricas futuras de asistencia por alumno, grupo, curso y docente.

### 12. **Usuarios y Roles**

- Gestión de usuarios del sistema.
- Visualización de roles y permisos.
- Último acceso de usuarios.
- Control de estado activo/inactivo.
- Roles principales:
  - Administrador.
  - Secretaria Académica.
  - Docente.
  - Coordinador Académico.

### 13. **Configuración**

- Datos del instituto.
- Parámetros académicos:
  - Nota mínima: 11.
  - Asistencia mínima de alumnos si aplica.
- Preferencias del sistema.
- Período académico actual.
- Datos de contacto y responsable académico.

---

## Tecnología

### Frontend actual

- **Frontend:** HTML5, CSS3, JavaScript Puro (ES6+).
- **Framework:** Ninguno. Proyecto en Vanilla JS.
- **Diseño responsivo:** CSS personalizado propio.
- **Datos:** Mock data en JavaScript.
- **Almacenamiento:** LocalStorage para tema y configuraciones ligeras.

### Backend futuro

- **Backend:** PHP.
- **Arquitectura:** Modelo-Vista-Controlador (MVC).
- **Base de datos:** MySQL.
- **Estado:** Pendiente para etapa posterior.

> [!IMPORTANT]
> Durante las fases actuales de frontend no usar React, Vue, Angular, Tailwind, Bootstrap ni librerías externas de estilos. Tampoco implementar backend real salvo instrucción explícita.

---

## Estructura de Archivos

```text
/vercel/share/v0-project/
├── public/
│   ├── index.html          # HTML principal
│   ├── css/
│   │   └── styles.css      # Estilos completos
│   └── js/
│       ├── data.js         # Datos simulados y DataManager
│       └── app.js          # Lógica de aplicación SAIIApp
├── app/
│   ├── layout.tsx          # Andamiaje de Next.js
│   └── page.tsx            # Página que renderiza o sirve el HTML
├── AGENTS.md
├── SAII_CONTEXTO_CONTINUIDAD.md
├── SAII_BACKLOG.md
├── SAII_ESTADO_Y_PROMPTS.md
├── SAII_ASISTENCIA_ALUMNOS.md
└── README.md
```

---

## Características de Diseño

### Paleta de Colores

- **Primario:** #003d82 (Azul institucional - UNP).
- **Primario Claro:** #1e5ba8.
- **Secundario:** #00b4d8 (Celeste).
- **Acentos:** Rojo (#d32f2f), Verde (#4caf50), Oro (#ffc93c).

### Tipografía

- Segoe UI, Tahoma, Geneva, Verdana, sans-serif.
- Pesos: 400 regular, 600 semibold, 700 bold.

### Modo Oscuro

- Tema oscuro completo con paleta oscura.
- Toggle en header.
- Persistencia en localStorage.
- Transiciones suaves.

### Responsive Design

- Desktop: sidebar completo.
- Tablet: sidebar colapsable.
- Mobile: menú hamburguesa.
- Grid dinámico adaptable.

---

## Mock Data

### Estudiantes

- Registros simulados.
- Código institucional.
- DNI.
- Estado activo/inactivo.
- Ciclo.
- Promoción.

### Docentes

- Especialidades variadas.
- Estado activo/inactivo.
- Relación con grupos académicos.

### Cursos

- Cursos predefinidos.
- Módulos configurados.
- Porcentajes que deben sumar 100%.

### Grupos Académicos

- Curso regular.
- Examen de suficiencia.
- Docente asignado.
- Horario.
- Aula/laboratorio.
- Cupo máximo.
- Estado.

### Matrículas

- Relación entre alumnos y grupos.
- Fuente para asistencia de alumnos y notas.

### Asistencia de Alumnos

- Colección recomendada: `studentAttendance[]`.
- Una lista por grupo y fecha.
- Registros por alumno en `records[]`.

### Usuarios

- Roles: admin, secretary, teacher, coordinator.
- Datos mock para simular navegación por rol.

---

## Funcionalidades Implementadas / Planeadas

### Interactividad

- Navegación entre módulos sin recargar página.
- Login y simulación de sesión.
- Cerrar sesión.
- Cambio de tema claro/oscuro.
- Búsqueda en tiempo real.
- Filtros avanzados.
- Validación de formularios.
- Modales para crear/editar/ver detalle.
- Cálculos automáticos.
- Notificaciones toast.
- Breadcrumbs de navegación.
- Confirmaciones antes de acciones destructivas.

### Tablas Dinámicas

- Renderizado de datos.
- Búsqueda integrada.
- Estados con badges coloreados.
- Acciones por fila con iconos.
- Overflow horizontal cuando sea necesario.

### Formularios

- Validación de DNI de 8 dígitos.
- Validación de código de 10 dígitos.
- Validación de email.
- Mensajes de error amigables.
- Campos requeridos.
- Ayuda en campos importantes.

### Cálculos Académicos

- Promedio ponderado automático.
- Estado de aprobación: >=11 aprobado.
- Validación de notas de 0 a 20.
- Cálculos de asistencia de alumnos.
- Cobertura de módulos.

---

## Cómo Usar

### Acceso Inicial

1. Página de login: ingresar usuario, contraseña y seleccionar rol.
2. Credenciales demo: cualquier combinación funciona durante etapa mock.
3. Roles disponibles: Administrador, Secretaria, Docente, Coordinador.

### Navegación

- Sidebar izquierdo: menú de módulos.
- Breadcrumbs: navegación rápida.
- Accesos rápidos en dashboard.
- Búsqueda global en header.

### Módulos

Cada módulo debe tener:

- Tabla o grid con datos.
- Búsqueda y filtros.
- Botones de acción con iconos.
- Validaciones integradas.
- Feedback mediante toasts.

---

## Performance y UX

- Interfaz limpia y profesional.
- Tipografía clara y legible.
- Espaciado y alineación ordenada.
- Bordes redondeados sutiles.
- Sombras suaves.
- Estados visuales claros.
- Feedback inmediato.
- Colores con buen contraste.
- Responsive en todos los dispositivos.

---

## Próximas Mejoras Sugeridas

- [ ] Backend real PHP MVC.
- [ ] Base de datos MySQL.
- [ ] Autenticación real.
- [ ] Exportación real a PDF/Excel.
- [ ] Gráficos interactivos si se autoriza librería.
- [ ] Notificaciones en tiempo real.
- [ ] Auditoría de cambios.
- [ ] Respaldos automáticos.
- [ ] Estadísticas avanzadas.
- [ ] Integración con sistemas externos, si se define en una etapa posterior.

---

## Compatibilidad

- Navegadores modernos: Chrome, Firefox, Safari, Edge.
- Dispositivos: Desktop, Tablet, Mobile.
- Resoluciones: 320px - 2560px+.
- Lenguaje: Español.

---

## Licencia

Proyecto académico - Universidad Nacional de Piura.

---

## Autor

Generado y documentado para el proyecto SAII.  
Fecha base: 29 de Junio, 2026.  
Documentación corregida: 01 de Julio, 2026.

---

## Guía Rápida de Uso

### Login Demo

- Usuario: admin.
- Contraseña: cualquier valor.
- Rol: Administrador, Secretaria, Docente o Coordinador.

### Explorar Módulos

1. **Dashboard:** Resumen de KPIs.
2. **Alumnos:** Crear, buscar, editar estudiantes.
3. **Cursos:** Ver estructura de cursos y módulos.
4. **Docentes:** Gestión del personal académico.
5. **Grupos:** Crear grupos de cursos.
6. **Matrículas:** Asignar alumnos a grupos.
7. **Asistencia:** Registrar asistencia de alumnos.
8. **Notas:** Ingresar calificaciones.
9. **Certificados:** Generar constancias.
10. **Reportes:** Ver estadísticas académicas.
11. **Usuarios:** Gestionar acceso.
12. **Roles:** Gestionar permisos.
13. **Configuración:** Parámetros del sistema.

---

## Flujo para agentes

Al trabajar con Antigravity, el usuario debe escribir únicamente:

```text
Lee README.md y haz la Fase X.
```

El agente debe:

1. Leer este `README.md`.
2. Obedecer la primera instrucción de este archivo y leer `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md`, `SAII_ESTADO_Y_PROMPTS.md` y `AGENTS.md` si existe.
3. Leer el documento específico de la fase si corresponde. Para Fase 5: `SAII_ASISTENCIA_ALUMNOS.md`.
4. Aplicar solo la fase solicitada.
5. Probar la fase en `http://localhost:3000/index.html`.
6. Revisar la consola del navegador.
7. Actualizar `SAII_BACKLOG.md` con el resumen de ejecución.
8. Sugerir commit, rama y Pull Request.

---

**SAII v1.0** — Frontend funcional en evolución, con backend real planificado para etapa posterior.
