# SAII — Contexto de continuidad

## ¿Qué es SAII?
**SAII** (Sistema Administrativo del Instituto de Informática) es un sistema web institucional diseñado para la Facultad de Ingeniería Industrial de la Universidad Nacional de Piura (UNP).

---

## Alcance real del trabajo final
El proyecto final será un sistema completo con:
- **Frontend** de diseño limpio y responsivo.
- **Backend** estructurado con PHP utilizando una arquitectura Modelo-Vista-Controlador (MVC).
- **Base de datos** relacional (MySQL).
- Flujo de Login y control de accesos.
- Operaciones CRUD, validaciones avanzadas, y seguridad.
- Documentación académica y exposición final.

> [!NOTE]
> Actualmente se está desarrollando y culminando la etapa de **frontend funcional interactivo con datos mock** en memoria (sin conexión a base de datos real).

---

## Frontend actual y stack tecnológico

El frontend reside exclusivamente en el directorio `public/` con la siguiente estructura y tecnologías:
- **Ubicación:** 
  - [public/index.html](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/public/index.html)
  - [public/css/styles.css](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/public/css/styles.css)
  - [public/js/data.js](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/public/js/data.js) (Modelo y persistencia mock)
  - [public/js/app.js](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/public/js/app.js) (Controlador y lógica de vistas)
- **Tecnología obligatoria:** HTML5, CSS3, JavaScript puro / Vanilla JS.
- **Restricción estricta:** No usar React, Vue, Angular, Tailwind, Bootstrap ni librerías de estilos externas.

---

## Servidor y pruebas locales
- **Servidor local:** Se ejecuta desde la raíz del proyecto mediante el comando:
  ```bash
  npm run dev
  ```
- **Acceso:** Abrir siempre **`http://localhost:3000/index.html`**. 
  > [!IMPORTANT]
  > No ingresar directamente a la raíz `http://localhost:3000/` ya que el Next.js de la raíz es un andamiaje inactivo; el frontend real interactivo está en la ruta de `index.html`.

---

## Historial de Git y Estado del Proyecto
- **Git status:** Ya se han realizado con éxito los commits de:
  1. Commit Inicial.
  2. **Fase 1:** Ajustes globales, header, sidebar institucional, cambio de botones de texto de acciones a iconos compactos, traducción de estados al español y ajustes de paddings generales.
  3. **Fase 2:** CRUD completo y modal de detalle para Alumnos y Docentes (combinando nombres/apellidos, y manteniendo filtros de estado, ciclo y promoción), así como la visualización y edición dinámica de Cursos y Módulos con validación de porcentaje acumulado (debe sumar exactamente 100%).

- **Próximo paso:** Continuar desde la **Fase 3 — Grupos Académicos**.

---

## Cambios en el alcance del Módulo de Asistencia
El módulo de Asistencia ha sido redefinido formalmente:
- **Enfoque original:** Asistencia de alumnos.
- **Enfoque nuevo:** **"Control de Asistencia Docente y Horas Dictadas"**. Su objetivo es digitalizar el control físico de asistencia del docente evaluador o instructor para cursos regulares y exámenes de suficiencia, registrando horas dictadas y enlace de Meet por sesión. (Ver especificación detallada en [SAII_ASISTENCIA_DOCENTE.md](file:///c:/Users/manue/Downloads/saii-frontend-development%20(2)/SAII_ASISTENCIA_DOCENTE.md)).

---

## Flujo obligatorio de desarrollo por fases
1. Desarrollar de manera incremental y controlada fase por fase.
2. Probar manualmente cada cambio en `http://localhost:3000/index.html` y comprobar la consola del navegador para evitar errores de JS.
3. Guardar el avance con Git tras confirmar el correcto funcionamiento de la fase:
   ```bash
   git add .
   git commit -m "feat: fase X completada [descripción]"
   ```
4. No avanzar a la siguiente fase hasta que la anterior esté confirmada y estable.
