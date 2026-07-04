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
> Sí existirá backend en el proyecto final. Sin embargo, la etapa actual se centra en terminar el **frontend funcional interactivo con datos mock**. El agente no debe improvisar backend real dentro de una fase frontend, salvo instrucción explícita del usuario o fase backend definida.

---

## Etapa actual

Actualmente se está desarrollando y culminando la etapa de:

```text
Frontend funcional interactivo con datos mock en memoria
```

Esto significa:

- Las pantallas deben funcionar visual e interactivamente.
- Los datos viven en `public/js/data.js`.
- La lógica principal vive en `public/js/app.js`.
- Las acciones CRUD pueden ser simuladas sobre arreglos mock.
- Todavía no se exige conexión a MySQL ni PHP para estas fases.

---

## Etapa posterior de backend

La etapa backend deberá implementarse más adelante con:

```text
PHP + MVC + MySQL
```

Esa etapa deberá convertir los módulos mock en módulos persistentes reales:

- Autenticación y sesiones.
- Alumnos.
- Docentes.
- Cursos.
- Módulos.
- Grupos académicos.
- Matrículas.
- Asistencia de alumnos.
- Registro de notas.
- Certificados.
- Reportes.
- Usuarios.
- Roles.
- Configuración.

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

Ya se han realizado con éxito los commits de:

1. Commit inicial.
2. **Fase 1:** Ajustes globales, header, sidebar institucional, cambio de botones de texto de acciones a iconos compactos, traducción de estados al español y ajustes de paddings generales.
3. **Fase 2:** CRUD completo y modal de detalle para Alumnos y Docentes, combinando nombres/apellidos y manteniendo filtros de estado, ciclo y promoción. También se trabajó la visualización y edición dinámica de Cursos y Módulos con validación de porcentaje acumulado, que debe sumar exactamente 100%.

Próximo paso documentado:

```text
Fase 3 — Grupos Académicos
```

salvo que el usuario indique otra fase.

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
