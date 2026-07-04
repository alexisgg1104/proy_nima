# SAII — Estado actual y prompts por fase

## Propósito

Este archivo concentra el estado actual del proyecto y los prompts operativos por fase.

La finalidad es que en Antigravity baste con decir:

```text
Lee README.md y haz la Fase X.
```

El agente debe leer primero `README.md`. Ese archivo le ordena leer `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md`, este `SAII_ESTADO_Y_PROMPTS.md` y `AGENTS.md` si existe. Después debe ubicar la fase solicitada y ejecutarla sin pedir que se le repitan instrucciones.

---

## Prompt único para Antigravity

Usar este prompt para ejecutar cualquier fase:

```text
Lee README.md y haz la Fase X.
```

Al recibir ese prompt, el agente debe aplicar estas reglas internas:

- Leer primero `README.md`.
- Seguir la primera instrucción del `README.md` y leer `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md`, `SAII_ESTADO_Y_PROMPTS.md` y `AGENTS.md` si existe.
- Aplicar solo la Fase X.
- Buscar el detalle de la fase en este archivo.
- Si la fase tiene documento específico, leerlo también.
- Para Fase 5, leer `SAII_ASISTENCIA_ALUMNOS.md`.
- No avanzar a otra fase.
- No reescribir `app.js` completo.
- No tocar `app/`, `components/` ni `lib/` salvo autorización explícita.
- Trabajar principalmente en `public/`.
- Mantener HTML5, CSS3 y JavaScript puro.
- No implementar backend real en una fase frontend, salvo instrucción explícita.
- Al finalizar, actualizar `SAII_BACKLOG.md` con el resumen de ejecución de la fase.
- Al finalizar indicar archivos modificados, funciones modificadas, pruebas realizadas y pendientes.
```

---

## Regla para fases con documentación específica

Si una fase tiene un documento específico, el agente debe leerlo aunque el usuario no lo mencione.

| Fase | Documento específico |
|---|---|
| Fase 5 | `SAII_ASISTENCIA_ALUMNOS.md` |

> [!IMPORTANT]
> `SAII_ASISTENCIA_DOCENTE.md` no es fuente vigente para Fase 5. Si existe, solo sirve como documento histórico/redirección. La fuente vigente es `SAII_ASISTENCIA_ALUMNOS.md`.

---

## Regla de resumen obligatorio en backlog

Al terminar cualquier fase, el agente debe actualizar `SAII_BACKLOG.md` en:

```text
## Bitácora de ejecución de fases
```

Debe agregar o completar el resumen de la fase con:

- Fecha.
- Rama.
- Commit o mensaje sugerido.
- Estado final.
- Archivos modificados.
- Funciones creadas o modificadas.
- Cambios principales.
- Pruebas realizadas.
- Resultado de consola.
- Pendientes o riesgos.
- Siguiente fase sugerida.

Si por seguridad no edita el backlog, debe entregar el bloque listo para copiar y pegar.

---

## Estado actual

Proyecto: **SAII — Sistema Administrativo del Instituto de Informática**.

Frontend funcional:

- `public/index.html`
- `public/css/styles.css`
- `public/js/data.js`
- `public/js/app.js`

Tecnología obligatoria para la etapa actual:

- HTML5.
- CSS3.
- JavaScript puro / Vanilla JS.
- CSS personalizado propio.
- Datos mock en JavaScript.

No usar durante fases frontend:

- React.
- Tailwind.
- Bootstrap.
- Frameworks externos.
- Backend real improvisado.
- APIs externas.
- Base de datos real.

> [!NOTE]
> El proyecto final sí tendrá backend PHP MVC + MySQL. La regla anterior solo evita que el agente implemente o conecte backend durante las fases actuales de frontend sin autorización explícita.

Servidor local:

```bash
npm run dev
```

Abrir siempre:

```text
http://localhost:3000/index.html
```

No abrir solo:

```text
http://localhost:3000/
```

---

## Git y estado de fases

Ya se hizo:

1. Commit inicial.
2. Commit de Fase 1.
3. Commit de Fase 2.

Fase 1 completada:

- Ajustes globales.
- Header.
- Sidebar.
- Iconos CRUD.
- Estados en español.
- Padding y mejoras visuales generales.

Fase 2 completada:

- Alumnos.
- Docentes.
- Cursos y Módulos.
- Acciones con iconos.
- Mejoras visuales.
- Validaciones básicas.

Pendiente continuar desde:

```text
Fase 3 — Grupos Académicos
```

salvo que el usuario indique otra fase.

---

## Flujo obligatorio para cada fase

1. Usar preferiblemente Claude Sonnet Thinking dentro de Antigravity.
2. Dar el prompt único: `Lee README.md y haz la Fase X`.
3. El agente debe leer los `.md` necesarios.
4. Revisar cambios con Review Changes.
5. Probar manualmente en `http://localhost:3000/index.html`.
6. Revisar consola del navegador.
7. Actualizar `SAII_BACKLOG.md` con el resumen de la fase.
8. Si todo está bien, guardar con Git.
9. No avanzar a la siguiente fase hasta confirmar que la anterior funciona.

---

## Regla principal

- No pedir cambios masivos.
- No aplicar varias fases juntas.
- No reescribir `app.js` completo.
- No tocar `app/`, `components/` ni `lib/`.
- Trabajar principalmente en `public/`.
- Mantener HTML5, CSS3 y JavaScript puro.
- Mantener diseño institucional.
- Mantener login, sidebar y modo claro/oscuro funcionando.
- Al terminar una fase, explicar cómo probarla.
- Al terminar una fase, subir/pegar el resumen en `SAII_BACKLOG.md`.

---

## Flujo recomendado de GitHub desde Antigravity

Desde la terminal de **Antigravity** se debe seguir este flujo cada vez que se quiera subir cambios a GitHub.

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

Ejemplos:

```powershell
git checkout -b alexis/fase-3-grupos-academicos
git checkout -b alexis/fase-4-redisenio-matriculas
git checkout -b alexis/fase-5-asistencia-alumnos
git checkout -b alexis/fase-6-registro-notas
git checkout -b alexis/fase-7-certificados-reportes
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
git commit -m "feat: fase 3 grupos academicos"
git commit -m "feat: fase 4 redisenio matriculas"
git commit -m "feat: fase 5 asistencia alumnos"
git commit -m "feat: fase 6 registro de notas"
git commit -m "feat: fase 7 certificados reportes usuarios configuracion"
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

> Regla de buena práctica: no trabajar directamente sobre `main`, no hacer merge sin revisar cambios y no avanzar a la siguiente fase hasta comprobar que la fase actual funciona correctamente.

---

# Prompts operativos por fase

## Fase 1 — Ajustes globales

Estado: **Completada**.

Si el usuario pide ejecutar de nuevo esta fase, el agente no debe rehacer todo. Debe revisar lo existente, corregir solo inconsistencias y no romper las fases posteriores.

### Objetivo

Ajustar estructura visual global del frontend.

### Tareas base

1. Revisar header.
2. Revisar sidebar.
3. Usar iconos compactos en acciones CRUD.
4. Mostrar estados en español.
5. Ajustar paddings, separación, responsive y consistencia visual.

### Restricciones

- No rehacer proyecto.
- No cambiar stack.
- No romper login ni navegación.

### Al finalizar

Actualizar `SAII_BACKLOG.md` con resumen de la revisión o corrección.

---

## Fase 2 — Alumnos, Docentes, Cursos y Módulos

Estado: **Completada**.

Si el usuario pide ejecutar de nuevo esta fase, el agente debe revisar y corregir solo lo faltante.

### Objetivo

Consolidar CRUD y visualización de Alumnos, Docentes, Cursos y Módulos.

### Tareas base

1. Alumnos con tabla, búsqueda, filtros, modal y validaciones.
2. Docentes con tabla, búsqueda, filtros, modal y validaciones.
3. Cursos con visualización, edición y validación.
4. Módulos con porcentajes que deben sumar 100%.
5. Acciones con iconos compactos.

### Restricciones

- No tocar Matrículas, Asistencia, Notas ni Certificados salvo que sea imprescindible para no romper referencias.

### Al finalizar

Actualizar `SAII_BACKLOG.md` con resumen de la revisión o corrección.

---

## Fase 3 pendiente — Grupos Académicos

### Prompt operativo

Lee `AGENTS.md`, `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md` y `SAII_ESTADO_Y_PROMPTS.md`.

Aplica solo la **Fase 3: Grupos Académicos**.

### Objetivo

Mejorar el módulo de Grupos Académicos sin tocar matrículas, asistencia, notas ni certificados.

### Tareas

1. Corregir la columna Acciones de grupos con iconos horizontales compactos:
   - Ver grupo.
   - Editar grupo.
   - Cerrar grupo.
   - Desactivar o eliminar grupo.
2. Agregar modal funcional para el botón **Abrir Nuevo Grupo**.
3. El modal debe tener:
   - Código de grupo.
   - Curso.
   - Modalidad.
   - Docente asignado.
   - Fecha de inicio.
   - Fecha de fin.
   - Horas académicas.
   - Cupo máximo.
   - Estado.
   - Aula o laboratorio.
   - Horario.
   - Observaciones.
4. Modalidades:
   - Curso regular.
   - Examen de suficiencia.
5. Estados:
   - Abierto.
   - En curso.
   - Terminado.
   - Cerrado.
6. Si modalidad es **Curso regular**, mostrar campos de fechas, horario, horas, cupo y docente.
7. Si modalidad es **Examen de suficiencia**, mostrar fecha examen, hora, aula, evaluador/docente y curso evaluado.
8. Validar:
   - Código obligatorio.
   - Curso obligatorio.
   - Docente obligatorio.
   - Cupo mayor a cero.
   - Fechas válidas.
   - Estado obligatorio.
9. Al guardar, agregar el grupo a los datos mock y actualizar la tabla.
10. Mostrar toast de éxito.
11. Mantener diseño institucional, limpio y sobrio.
12. Dejar datos compatibles con Matrículas, Asistencia de Alumnos y Registro de Notas.

### Restricciones

- No tocar Matrículas.
- No tocar Asistencia.
- No tocar Registro de Notas.
- No tocar Certificados.
- No reescribir `app.js` completo.
- No tocar archivos de `app/`, `components/` ni `lib/`.
- Mantener HTML5, CSS3 y JavaScript puro.
- Usar estilos de iconos existentes de Fase 1.

### Trabajar principalmente en

- `public/js/app.js`
- `public/js/data.js`, si faltan datos mock.
- `public/css/styles.css`, si hace falta.
- `public/index.html`, solo si es estrictamente necesario.
- `SAII_BACKLOG.md`, al final para registrar resumen.

### Al finalizar

1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar abrir, ver, editar, cerrar y desactivar grupo.
4. Actualiza `SAII_BACKLOG.md` con el resumen de la fase.
5. No avances a Fase 4.

### Commit sugerido

```powershell
git add .
git commit -m "feat: fase 3 grupos academicos"
```

---

## Fase 4 pendiente — Matrículas

### Prompt operativo

Lee `AGENTS.md`, `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md` y `SAII_ESTADO_Y_PROMPTS.md`.

Aplica solo la **Fase 4: Matrículas**.

### Objetivo

Rediseñar el módulo Matrículas sin tocar asistencia, notas ni certificados.

### Tareas

1. Rediseñar la card resumen del grupo/curso.
2. La card resumen debe tener padding, bordes redondeados y buena separación visual.
3. Mostrar:
   - Grupo.
   - Curso.
   - Docente.
   - Modalidad.
   - Cupo máximo.
   - Matriculados.
   - Cupos disponibles.
   - Estado.
4. La búsqueda de alumnos debe estar arriba en una card compacta.
5. Los resultados de búsqueda deben mostrar máximo 3 a 5 alumnos.
6. Cada resultado debe tener icono de agregar.
7. La tabla **Alumnos Matriculados** debe estar abajo y ocupar todo el ancho.
8. Columnas:
   - Código.
   - Alumno.
   - DNI.
   - Ciclo.
   - Promoción.
   - Fecha de matrícula.
   - Estado.
   - Acciones.
9. Acciones con iconos:
   - Ver matrícula.
   - Editar matrícula.
   - Retirar alumno.
10. No permitir alumno duplicado en el mismo grupo.
11. Mostrar mensaje si el alumno ya está matriculado.
12. Actualizar contador de cupos.
13. Mantener diseño limpio, académico y responsivo.
14. Dejar la matrícula como fuente para la Fase 5: asistencia solo debe listar alumnos matriculados.

### Restricciones

- No tocar Asistencia.
- No tocar Registro de Notas.
- No tocar Certificados.
- No reescribir `app.js` completo.
- No tocar `app/`, `components/` ni `lib/`.

### Al finalizar

1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar matrícula.
4. Actualiza `SAII_BACKLOG.md` con el resumen de la fase.
5. No avances a Fase 5.

### Commit sugerido

```powershell
git add .
git commit -m "feat: fase 4 redisenio matriculas"
```

---

## Fase 5 pendiente — Control de Asistencia de Alumnos

### Prompt operativo

Lee `AGENTS.md`, `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md`, `SAII_ESTADO_Y_PROMPTS.md` y `SAII_ASISTENCIA_ALUMNOS.md`.

Aplica solo la **Fase 5: Control de Asistencia de Alumnos**.

### Objetivo

Implementar el módulo donde el **docente registra la asistencia de los alumnos matriculados** en sus grupos asignados.

### Importante

Este módulo **sí es asistencia de alumnos**.  
El docente registra la asistencia, pero el sujeto de asistencia es el alumno.

La fuente de verdad para esta fase es:

```text
SAII_ASISTENCIA_ALUMNOS.md
```

No implementar control de horas dictadas del docente en esta fase.

### Vista Docente

1. La pantalla debe llamarse **Control de Asistencia de Alumnos**.
2. El docente solo debe ver sus grupos asignados.
3. Debe seleccionar un grupo académico.
4. Debe seleccionar o crear una fecha de asistencia.
5. Al seleccionar, mostrar una card institucional con:
   - Universidad Nacional de Piura.
   - Facultad de Ingeniería Industrial.
   - Instituto de Informática.
   - Control de Asistencia de Alumnos.
   - Modalidad.
   - Grupo.
   - Curso.
   - Docente.
   - Horario.
   - Aula o laboratorio.
   - Fecha de asistencia.
6. La tabla debe listar alumnos matriculados del grupo.
7. Columnas:
   - Código.
   - Alumno.
   - DNI.
   - Estado de asistencia.
   - Hora de llegada, opcional.
   - Observación.
   - Acciones.
8. Estados por alumno:
   - Presente.
   - Tarde.
   - Falta.
   - Justificado.
9. Permitir marcar todos como presentes.
10. Permitir cambiar estado por alumno.
11. Permitir observación por alumno.
12. Calcular resumen automático:
   - Total matriculados.
   - Presentes.
   - Tardes.
   - Faltas.
   - Justificados.
   - Porcentaje de asistencia efectiva.
13. Botones:
   - Guardar borrador.
   - Registrar asistencia.
   - Imprimir lista.
   - Exportar PDF/CSV simulado.
14. No permitir registrar si hay alumnos sin estado.
15. No permitir duplicar asistencia para el mismo grupo y fecha.

### Vista Administrador

1. La pantalla debe llamarse **Asistencias de Alumnos Registradas**.
2. No debe mostrar como pantalla principal el formulario editable del docente.
3. Debe mostrar filtros:
   - Docente.
   - Curso.
   - Grupo.
   - Modalidad.
   - Estado.
   - Fecha.
4. Tabla:
   - Fecha.
   - Grupo.
   - Curso.
   - Docente.
   - Modalidad.
   - Matriculados.
   - Presentes.
   - Tardes.
   - Faltas.
   - Justificados.
   - Estado.
   - Acciones.
5. Acciones:
   - Ver detalle.
   - Observar.
   - Reabrir.
   - Cerrar.
   - Imprimir.
   - Exportar.
6. Ver detalle debe abrir modal con encabezado y tabla completa.
7. Observar permite escribir observación administrativa.
8. Cerrar bloquea la lista.

### Vista Secretaria / Coordinador

1. Puede consultar asistencias según permisos.
2. Puede filtrar y ver detalle.
3. Puede imprimir/exportar si se permite.
4. No registra asistencia como docente.
5. No modifica estados salvo permiso administrativo explícito.

### Estados de lista

- Borrador.
- Registrada.
- Observada.
- Cerrada.

### Validaciones

- Grupo obligatorio.
- Fecha obligatoria.
- Fecha dentro del rango del grupo.
- No duplicar asistencia por grupo y fecha.
- Deben existir alumnos matriculados.
- Cada alumno debe tener estado.
- Estado permitido: Presente, Tarde, Falta, Justificado.
- Si estado es Justificado, observación recomendada.
- No permitir editar una lista Cerrada desde rol Docente.
- Observación máxima de 255 caracteres.

### Datos mock

Agregar o ajustar estructura en `data.js` para:

- `studentAttendance[]`.
- `records[]` dentro de cada lista.
- Estados de lista.
- Estados por alumno.
- Relación con docente.
- Relación con grupo.
- Relación con matrículas.

### Restricciones

- No tocar Registro de Notas.
- No tocar Certificados.
- No implementar backend real.
- No reescribir `app.js` completo.
- No tocar `app/`, `components/` ni `lib/`.

### Al finalizar

1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar como Docente.
4. Indica cómo probar como Administrador.
5. Actualiza `SAII_BACKLOG.md` con el resumen de la fase.
6. No avances a Fase 6.

### Commit sugerido

```powershell
git add .
git commit -m "feat: fase 5 asistencia alumnos"
```

---

## Fase 6 — Registro de Notas

### Prompt operativo

Lee `AGENTS.md`, `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md` y `SAII_ESTADO_Y_PROMPTS.md`.

Aplica solo la **Fase 6: Registro de Notas**.

### Objetivo

Corregir y mejorar el módulo de Registro de Notas diferenciando vista de Docente y vista de Administrador.

### Vista Docente

1. Mostrar pantalla **Registro de Notas**.
2. El docente solo debe registrar notas de sus grupos asignados.
3. Debe tener:
   - Selector de grupo asignado.
   - Card resumen: grupo, curso, docente, modalidad, fechas, horas.
4. La tabla debe ser horizontal.
5. Estructura obligatoria:

```text
Código | Alumno | Módulo 1 | Módulo 2 | Módulo 3 | ... | Promedio | Estado | Acciones
```

6. Cada módulo debe ser una columna.
7. Cada alumno debe ser una fila.
8. No poner módulos como filas.
9. Cada nota debe ser input numérico de 0 a 20.
10. Calcular promedio ponderado con porcentajes.
11. Estado:
    - Pendiente si faltan notas.
    - Aprobado si promedio >= 11.
    - Desaprobado si promedio < 11.
12. Acciones por fila con iconos:
    - Ver detalle.
    - Editar notas.
    - Limpiar notas.
13. Botones generales:
    - Guardar notas.
    - Cerrar acta.
    - Exportar acta.
14. Usar overflow horizontal si la tabla no cabe.

### Vista Administrador

1. Mostrar pantalla **Actas de Notas Registradas**.
2. No mostrar edición directa como pantalla principal.
3. Filtros:
   - Curso.
   - Grupo.
   - Docente.
   - Modalidad.
   - Estado.
4. Tabla:
   - Grupo.
   - Curso.
   - Docente.
   - Modalidad.
   - Matriculados.
   - Notas completas.
   - Promedio del grupo.
   - Estado del acta.
   - Acciones.
5. Acciones:
   - Ver acta.
   - Imprimir.
   - Exportar.
   - Reabrir acta, simulación administrativa.

### Validaciones

- Nota entre 0 y 20.
- No cerrar acta si faltan notas.
- Promedio solo si notas completas.
- Mostrar alerta si hay notas incompletas.

### Restricciones

- No tocar Asistencia.
- No tocar Certificados.
- No implementar backend real.
- No reescribir `app.js` completo.
- No tocar `app/`, `components/` ni `lib/`.

### Al finalizar

1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar cálculo de promedio.
4. Actualiza `SAII_BACKLOG.md` con el resumen de la fase.
5. No avances a Fase 7.

### Commit sugerido

```powershell
git add .
git commit -m "feat: fase 6 registro de notas"
```

---

## Fase 7 pendiente — Certificados, Reportes, Usuarios, Roles y Configuración

### Prompt operativo

Lee `AGENTS.md`, `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md` y `SAII_ESTADO_Y_PROMPTS.md`.

Aplica solo la **Fase 7**.

### Certificados

1. Agregar botón **Generar certificados pendientes**.
2. Generar certificados para alumnos que:
   - tengan curso o examen terminado;
   - tengan nota final >= 11;
   - cumplan asistencia mínima de alumnos si la configuración lo exige;
   - no tengan certificado generado.
3. Estados:
   - Generado.
   - Pendiente.
   - No apto.
4. Acciones con iconos:
   - Ver certificado.
   - Generar certificado individual.
   - Descargar PDF simulado.
   - Imprimir.
   - Anular certificado.
5. Vista previa formal en modal con:
   - Universidad Nacional de Piura.
   - Instituto de Informática.
   - SAII.
   - Código de certificado.
   - Nombre completo del alumno.
   - Código del alumno.
   - DNI.
   - Curso.
   - Modalidad.
   - Fecha inicio y fin si fue curso regular.
   - Fecha examen si fue examen de suficiencia.
   - Horas académicas.
   - Promedio final.
   - Porcentaje de asistencia si aplica.
   - Fecha de emisión.
   - Firma del responsable como placeholder.

### Reportes

1. Agregar sección **Reportes guardados**.
2. CRUD simulado:
   - Crear reporte.
   - Ver reporte.
   - Editar configuración.
   - Eliminar reporte.
   - Exportar PDF.
   - Exportar Excel.
3. Incluir reportes relacionados a:
   - Matrículas.
   - Asistencia de alumnos.
   - Notas.
   - Certificados.
   - Usuarios o actividad simulada si aplica.

### Usuarios y roles

1. CRUD de usuarios.
2. CRUD de roles.
3. Roles:
   - Administrador.
   - Secretaria Académica.
   - Docente.
   - Coordinador Académico.
4. Agregar selector de rol simulado para probar Administrador y Docente.

### Configuración

1. Permitir editar:
   - Nombre del sistema.
   - Nombre del instituto.
   - Período académico actual.
   - Nota mínima aprobatoria.
   - Asistencia mínima de alumnos.
   - Tema por defecto.
   - Datos de contacto.
   - Responsable académico.
2. Acciones:
   - Ver configuración.
   - Editar configuración.
   - Guardar cambios.
   - Restaurar valores por defecto.

### Restricciones

- No reescribir `app.js` completo.
- No tocar `app/`, `components/` ni `lib/`.
- Mantener HTML5, CSS3 y JavaScript puro.
- Mantener diseño institucional.
- No implementar backend real salvo instrucción explícita.

### Al finalizar

1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar certificados pendientes.
4. Indica cómo probar reportes, usuarios, roles y configuración.
5. Actualiza `SAII_BACKLOG.md` con el resumen de la fase.

### Commit sugerido

```powershell
git add .
git commit -m "feat: fase 7 certificados reportes usuarios configuracion"
```

---

# Prompt futuro para backend

Esta sección no debe ejecutarse durante Fases 3–7 salvo que el usuario lo pida explícitamente.

Cuando el usuario indique iniciar backend, crear un plan independiente para:

- PHP MVC.
- MySQL.
- Autenticación real.
- Tablas principales.
- Modelos.
- Controladores.
- Validaciones backend.
- Integración con frontend.
- Migración de datos mock.

Prompt futuro sugerido:

```text
Lee README.md.

Prepara la etapa backend PHP MVC + MySQL para SAII.

No modifiques el frontend funcional sin explicar por qué.
Primero crea la arquitectura, las tablas y el plan de integración.
```
