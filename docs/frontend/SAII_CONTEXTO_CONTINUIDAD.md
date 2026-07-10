# SAII — Contexto de continuidad

## ¿Qué es SAII?

**SAII** (Sistema Administrativo del Instituto de Informática) es un sistema web institucional diseñado para la Facultad de Ingeniería Industrial de la Universidad Nacional de Piura (UNP).

---

## Alcance real del trabajo final

El proyecto final será un sistema completo con:

- **Frontend** de diseño limpio, responsivo e institucional.
- **Backend real** estructurado con PHP utilizando arquitectura Modelo-Vista-Controlador (MVC).
- **Base de datos relacional MySQL**.
- Flujo de login real y control de accesos.
- Operaciones CRUD, validaciones avanzadas y seguridad.
- Documentación académica y exposición final.

> [!IMPORTANT]
> El backend en PHP MVC y la base de datos relacional MySQL han sido completamente implementados e integrados con el frontend, reemplazando el uso de datos mock.

---

## Etapa actual

Actualmente se ha culminado con éxito tanto la etapa de frontend como la de backend real:

```text
Frontend Vanilla JS + Backend PHP MVC + Base de Datos MySQL (Totalmente Integrados y Asegurados)
```

Esto significa:
- La aplicación se comunica dinámicamente con una API REST real en PHP que expone endpoints JSON.
- Los datos se almacenan en una base de datos MySQL relacional con integridad de datos y llaves foráneas.
- La lógica de cliente en `public/js/app.js` interactúa a través de `public/js/api.js` (`APIClient`) con persistencia nativa de sesiones de PHP y caché relacional en `public/js/data.js`.
- Se han implementado defensas contra XSS y CSRF, logs de errores seguros de producción y políticas de control de sesiones.

---

## Frontend actual y stack tecnológico

El frontend reside principalmente en el directorio `public/`:

```text
public/index.html
public/css/styles.css
public/js/data.js
public/js/app.js
```

Tecnología obligatoria durante esta etapa:

- HTML5.
- CSS3.
- JavaScript puro / Vanilla JS.
- CSS personalizado propio.

Restricción durante esta etapa:

- No usar React.
- No usar Vue.
- No usar Angular.
- No usar Tailwind.
- No usar Bootstrap.
- No usar librerías externas de estilos.
- No conectar backend real durante una fase frontend salvo autorización explícita.

---

## Servidor y pruebas locales

Servidor local:

```bash
npm run dev
```

Acceso correcto:

```text
http://localhost:3000/index.html
```

> [!IMPORTANT]
> No ingresar directamente a `http://localhost:3000/` para validar el frontend principal. El Next.js de la raíz es un andamiaje inactivo; el frontend real interactivo está en `index.html`.

---

## Historial de Git y estado del proyecto

Se han completado todas las fases de desarrollo del proyecto SAII:

### Etapa Frontend:
* **Fases 1 a 7:** Construcción y optimización del diseño interactivo responsivo de todos los módulos del sistema académico con datos mock localizados en memoria.
* **Integración del Tipo de Alumno (studentType) y Depreciación de Ciclo (cycle):** Reemplazo completo del ciclo de estudios por el tipo de alumno en los módulos de Alumnos, Matrículas, Calificaciones, Asistencias, Certificados y Reportes con badges color pastel.
* **Solución de Desborde del Certificado Expandido (Fullscreen):** Implementación de la escala proporcional dinámica (`adjustCertificateScale()`) en JS y CSS, evitando cortes en la visualización en Desktop, Firefox y dispositivos móviles.
* **Internacionalización Completa (i18n) a Inglés:** Traducción dinámica de la interfaz completa en inglés, incluyendo notificaciones específicas por rol, tablas detalladas de reportes, certificados, flujos de firmas y el módulo de copias de seguridad (configuración, historial, detalle y alertas). Refactorización del motor de traducción para procesar nodos de texto individuales en el DOM, resolviendo la traducción de elementos complejos con HTML/SVG anidados (ej. botones interactivos con spans o iconos responsivos).

### Etapa Backend (Fases B0 a B10):
* **Fases B1 a B8:** Diseño de la base de datos MySQL (17 tablas), migración de semillas y lógica de controladores y modelos en PHP con patrón MVC estricto y consultas PDO seguras para todos los módulos.
* **Fase B9:** Integración de la UI a la API REST desactivando mocks y controlando la latencia de red mediante caching local en memoria síncrono.
* **Fase B10:** Implementación del middleware CSRF, sanitización recursiva de JSON saliente en `BaseController`, redirección segura de logs detallados a `/logs/php_errors.log` y manual `DESPLIEGUE.md`.

Próximo paso:
```text
Entrega del software SAII listo para su puesta en marcha o mantenimiento
```

---

## Alcance corregido del módulo de Asistencia

El módulo de Asistencia queda definido formalmente así:

```text
Fase 5 — Control de Asistencia de Alumnos
```

La asistencia será registrada por el **docente** sobre los alumnos matriculados en sus grupos asignados.

El docente debe poder:

- seleccionar uno de sus grupos asignados;
- seleccionar o crear una lista de asistencia por fecha;
- ver los alumnos matriculados del grupo;
- marcar cada alumno como Presente, Tarde, Falta o Justificado;
- agregar observaciones cuando corresponda;
- guardar la lista como borrador;
- registrar o cerrar la asistencia cuando esté completa.

El administrador, secretaria o coordinador podrán consultar asistencias según sus permisos, pero la captura principal de asistencia corresponde al docente.

Documento fuente para Fase 5:

```text
SAII_ASISTENCIA_ALUMNOS.md
```

> [!NOTE]
> Si existe documentación antigua sobre asistencia docente, debe considerarse histórica o descartada para la Fase 5. La Fase 5 vigente es asistencia de alumnos registrada por docente.

---

## Flujo obligatorio de desarrollo por fases

1. Desarrollar de manera incremental y controlada fase por fase.
2. Leer `AGENTS.md` antes de tocar código.
3. Leer `SAII_BACKLOG.md` para conocer el estado y la bitácora.
4. Leer `SAII_ESTADO_Y_PROMPTS.md` para ubicar el prompt operativo de la fase.
5. Si la fase tiene documento específico, leerlo también. Para Fase 5, leer `SAII_ASISTENCIA_ALUMNOS.md`.
6. Probar manualmente cada cambio en `http://localhost:3000/index.html`.
7. Comprobar la consola del navegador para evitar errores de JavaScript.
8. Actualizar `SAII_BACKLOG.md` con el resumen de ejecución de la fase.
9. Guardar el avance con Git solo después de confirmar que la fase funciona.
10. No avanzar a la siguiente fase hasta que la anterior esté confirmada y estable.

---

## Archivos principales que puede modificar el agente

Durante las fases actuales, el agente debe trabajar principalmente en:

```text
public/js/app.js
public/js/data.js
public/css/styles.css
public/index.html
SAII_BACKLOG.md
```

`SAII_BACKLOG.md` puede modificarse al final de cada fase para agregar el resumen de ejecución.

Regla importante:

```text
No tocar app/, components/ ni lib/ durante estas fases, salvo autorización explícita.
```

---

## Flujo recomendado de GitHub desde Antigravity

Desde la terminal de **Antigravity** se debe seguir este flujo cada vez que se quieran subir cambios a GitHub.

Primero entrar a la carpeta del proyecto, si todavía no se está dentro:

```powershell
cd "C:\Users\manue\Downloads\saii-frontend-development (2)"
```

### Flujo recomendado: rama → push → Pull Request → main

#### 1. Asegurarse de estar actualizado con `main`

```powershell
git checkout main
git pull origin main
```

Si la terminal indica que no existe la rama `main` localmente, usar:

```powershell
git fetch origin
git checkout -b main origin/main
```

---

#### 2. Crear una rama nueva para los cambios

Usar un nombre descriptivo. Formato recomendado:

```powershell
git checkout -b alexis/fase-X-nombre-del-cambio
```

Ejemplo:

```powershell
git checkout -b alexis/fase-5-asistencia-alumnos
```

---

#### 3. Trabajar normalmente en el código

Editar archivos, agregar componentes, corregir errores o aplicar la fase correspondiente.

Luego revisar qué cambió:

```powershell
git status
```

---

#### 4. Agregar los cambios

```powershell
git add .
```

---

#### 5. Crear el commit

```powershell
git commit -m "feat: fase X descripcion del cambio"
```

Ejemplos:

```powershell
git commit -m "feat: agregar modulo de reportes"
git commit -m "fix: corregir validacion de asistencia"
git commit -m "ui: mejorar diseno de matriculas"
git commit -m "chore: actualizar configuracion"
```

---

#### 6. Subir la rama a GitHub

```powershell
git push -u origin alexis/fase-X-nombre-del-cambio
```

Cambiar el nombre por el de la rama creada.

---

#### 7. Crear el Pull Request en GitHub

Entrar a:

```text
https://github.com/alexisgg1104/proy_nima
```

GitHub debería mostrar:

```text
Compare & pull request
```

Configurar así:

```text
base: main
compare: alexis/fase-X-nombre-del-cambio
```

Luego presionar:

```text
Create pull request
```

Después, cuando se confirme que todo está correcto:

```text
Merge pull request
Confirm merge
```

---

#### 8. Después del merge, actualizar `main` local

Volver a la terminal:

```powershell
git checkout main
git pull origin main
```

---

## Resumen rápido para cada nueva fase

```powershell
git checkout main
git pull origin main
git checkout -b alexis/fase-X-nombre-del-cambio
```

Trabajar en el código, luego:

```powershell
git status
git add .
git commit -m "feat: descripcion del cambio"
git push -u origin alexis/fase-X-nombre-del-cambio
```

Después crear el Pull Request en GitHub hacia `main`.

---

## Regla de continuidad para agentes

Al iniciar una nueva fase, el agente debe revisar:

1. Estado general de fases en `SAII_BACKLOG.md`.
2. Últimos resúmenes en la sección **Bitácora de ejecución de fases**.
3. Prompt operativo de la fase en `SAII_ESTADO_Y_PROMPTS.md`.
4. Restricciones de `AGENTS.md`.

Así podrá continuar sin que el usuario repita toda la explicación.
