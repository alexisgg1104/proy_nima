# SAII - Sistema Administrativo del Instituto de Informática

## Descripción General

SAII es un sistema web administrativo académico completo para el Instituto de Informática de la Universidad Nacional de Piura. Diseñado con HTML, CSS y JavaScript puro (Vanilla JS), proporciona una solución robusta y profesional para la gestión integral de estudiantes, cursos, docentes, matrículas, asistencia, calificaciones y certificados académicos.

## Características Principales

### 1. **Autenticación y Roles**
- Sistema de login con simulación de credenciales
- 4 roles de usuario: Administrador, Secretaria Académica, Docente, Coordinador Académico
- Control de acceso basado en roles
- Menú adaptativo según permisos del usuario

### 2. **Dashboard Principal**
- 8 KPI cards con métricas clave del sistema
- Gráficos de aprobados vs desaprobados
- Barra de progreso de notas registradas
- Accesos rápidos a funciones principales
- Feed de actividad reciente

### 3. **Gestión de Alumnos**
- CRUD completo de estudiantes
- Búsqueda avanzada por código, DNI, nombres
- Filtros por estado, ciclo y promoción
- Validación de datos (código 10 dígitos, DNI 8 dígitos)
- Modal para crear/editar estudiantes

### 4. **Cursos y Módulos**
- Vista de cursos en grid cards
- Información de módulos por curso
- Verificación de porcentajes (deben sumar 100%)
- 3 cursos predefinidos con módulos detallados:
  - Computación Básica (Windows 20%, Word 40%, Excel 40%)
  - Microsoft Office (6 módulos)
  - Computación para Ingenieros (7 módulos)

### 5. **Gestión de Docentes**
- Tabla de docentes con especialidades
- Búsqueda y filtrado
- Estados activo/inactivo
- Especialidades: Ofimática, Programación, Diseño, Matemática/Matlab

### 6. **Grupos Académicos**
- Creación de grupos por curso y modalidad
- Modalidades: Curso regular y Examen de suficiencia
- Estados: Abierto, En curso, Terminado, Cerrado
- Asignación de docentes y horarios

### 7. **Matrículas**
- Interface de doble panel para matrícula de alumnos
- Búsqueda de alumnos disponibles
- Control de cupo máximo
- Tabla de alumnos matriculados
- Función para remover alumnos

### 8. **Asistencia**
- Registro por grupo y fecha
- Estados: Presente, Tarde, Falta, Justificado
- Colores diferenciados para cada estado
- Resumen de asistencia
- Observaciones por alumno

### 9. **Registro de Notas**
- Tabla tipo Excel académico
- Módulos como columnas con pesos porcentuales
- Cálculo automático de promedio ponderado
- Validación de notas (0-20)
- Estados: Aprobado (>=11) / Desaprobado (<11)
- Cerrar acta y exportar

### 10. **Certificados y Constancias**
- Vista previa del certificado
- Dos tipos: Curso regular y Examen de suficiencia
- Datos completos: alumno, promedio, horas, período
- Generación de código único
- Funciones de impresión y descarga simuladas

### 11. **Reportes**
- 6 tarjetas KPI con estadísticas
- Tabla de reporte detallado por grupo
- Conteos de aprobados/desaprobados
- Promedios generales
- Estadísticas de certificados y asistencia

### 12. **Usuarios y Roles**
- Gestión de usuarios del sistema
- Visualización de roles y permisos
- Último acceso de usuarios
- Control de estado activo/inactivo

### 13. **Configuración**
- Datos del instituto
- Parámetros académicos (nota mínima: 11, asistencia mínima: 70%)
- Preferencias del sistema
- Período académico actual

## Tecnología

- **Frontend**: HTML5, CSS3, JavaScript Puro (ES6+)
- **Framework**: Ninguno (Vanilla JS)
- **Diseño Responsivo**: Tailwind CSS (estructura CSS personalizada)
- **Datos**: Mock data en JavaScript
- **Almacenamiento**: LocalStorage para tema (dark mode)

## Estructura de Archivos

```
/vercel/share/v0-project/
├── public/
│   ├── index.html          # HTML principal
│   ├── css/
│   │   └── styles.css      # Estilos completos
│   └── js/
│       ├── data.js         # Datos simulados y DataManager
│       └── app.js          # Lógica de aplicación (SAIIApp)
├── app/
│   ├── layout.tsx          # Layout de Next.js
│   └── page.tsx            # Página que renderiza el HTML
└── README.md               # Este archivo
```

## Características de Diseño

### Paleta de Colores
- **Primario**: #003d82 (Azul institucional - UNP)
- **Primario Claro**: #1e5ba8
- **Secundario**: #00b4d8 (Celeste)
- **Acentos**: Rojo (#d32f2f), Verde (#4caf50), Oro (#ffc93c)

### Tipografía
- Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Pesos: 400 (regular), 600 (semi-bold), 700 (bold)

### Modo Oscuro
- Tema oscuro completo con paleta oscura
- Toggle en header
- Persistencia en localStorage
- Transiciones suaves

### Responsive Design
- Desktop: Sidebar completo
- Tablet: Sidebar colapsable
- Mobile: Menú hamburguesa
- Grid dinámico que se adapta a pantalla

## Mock Data

### Estudiantes: 10 registros
- Códigos: 2024001000-2024010000
- Estados: Activo/Inactivo
- Ciclos: I-IV
- Promociones: 2022-2024

### Docentes: 5 registros
- Especialidades variadas
- Todos con estado activo

### Cursos: 3 predefinidos
- Con módulos y porcentajes configurados

### Grupos: 5 grupos académicos
- Modalidades regulares y exámenes de suficiencia

### Usuarios: 4 predefinidos
- Roles: admin, secretary, teacher, coordinator

## Funcionalidades Implementadas

### Interactividad
✅ Navegación entre módulos sin recargar página
✅ Login y simulación de sesión
✅ Cerrar sesión (logout)
✅ Cambio de tema claro/oscuro
✅ Búsqueda en tiempo real
✅ Filtros avanzados
✅ Validación de formularios
✅ Modales para crear/editar
✅ Cálculos automáticos (promedios ponderados)
✅ Notificaciones toast
✅ Breadcrumbs de navegación
✅ Confirmaciones antes de acciones destructivas

### Tablas Dinámicas
✅ Renderizado de datos
✅ Búsqueda integrada
✅ Ordenamiento visual
✅ Estados con badges coloreados
✅ Acciones por fila (editar, eliminar)

### Formularios
✅ Validación de DNI (8 dígitos)
✅ Validación de código (10 dígitos)
✅ Validación de email
✅ Mensajes de error amigables
✅ Campos requeridos
✅ Ayuda en campos importantes

### Cálculos Académicos
✅ Promedio ponderado automático
✅ Estado de aprobación (>=11 aprobado)
✅ Validación de notas (0-20)
✅ Cálculos de asistencia
✅ Cobertura de módulos

## Cómo Usar

### Acceso Inicial
1. Página de login: Ingresar usuario, contraseña y seleccionar rol
2. Credenciales demo: cualquier combinación funciona
3. Roles disponibles: Administrador, Secretaria, Docente, Coordinador

### Navegación
- Sidebar izquierdo: menú de módulos
- Breadcrumbs: navegación rápida
- Accesos rápidos en dashboard
- Búsqueda global en header

### Módulos
Cada módulo tiene:
- Tabla/Grid con datos
- Búsqueda y filtros
- Botones de acción
- Validaciones integradas

## Performance y UX

- Interfaz limpia y profesional
- Tipografía clara y legible
- Espaciamiento y alineación ordenada
- Bordes redondeados sutiles
- Sombras suaves
- Estados visuales claros
- Feedback inmediato (toasts)
- Colores con buen contraste
- Responsive en todos los dispositivos

## Próximas Mejoras (Sugeridas)

- [ ] Backend real (API REST)
- [ ] Base de datos persistente
- [ ] Autenticación real (JWT)
- [ ] Exportación a PDF/Excel
- [ ] Gráficos interactivos (Chart.js)
- [ ] Notificaciones en tiempo real
- [ ] Auditoría de cambios
- [ ] Respaldos automáticos
- [ ] Estadísticas avanzadas
- [ ] Integración con sistemas externos

## Compatibilidad

- Navegadores modernos: Chrome, Firefox, Safari, Edge
- Dispositivos: Desktop, Tablet, Mobile
- Resoluciones: 320px - 2560px+
- Lenguaje: Español

## Licencia

Proyecto académico - Universidad Nacional de Piura

## Autor

Generado por v0 - Vercel AI
Fecha: 29 de Junio, 2026

---

## Guía Rápida de Uso

### Login Demo
- Usuario: admin
- Contraseña: cualquier valor
- Rol: Administrador (o cualquier rol disponible)

### Explorar Módulos
1. **Dashboard**: Resumen de KPIs
2. **Alumnos**: Crear, buscar, editar estudiantes
3. **Cursos**: Ver estructura de cursos y módulos
4. **Docentes**: Gestión del personal académico
5. **Grupos**: Crear grupos de cursos
6. **Matrículas**: Asignar alumnos a grupos
7. **Asistencia**: Registrar asistencias diarias
8. **Notas**: Ingresar calificaciones
9. **Certificados**: Generar constancias
10. **Reportes**: Ver estadísticas académicas
11. **Usuarios**: Gestionar acceso
12. **Configuración**: Parámetros del sistema

---

**SAII v1.0** - Sistema completo, funcional y listo para presentar como primera entrega del proyecto.
