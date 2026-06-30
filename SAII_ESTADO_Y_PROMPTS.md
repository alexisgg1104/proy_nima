# SAII — Estado actual y prompts pendientes

## Estado actual

Proyecto: SAII — Sistema Administrativo del Instituto de Informática.

Frontend funcional:
- public/index.html
- public/css/styles.css
- public/js/data.js
- public/js/app.js

Tecnología obligatoria:
- HTML5
- CSS3
- JavaScript puro / Vanilla JS

No usar:
- React
- Tailwind
- Bootstrap
- Frameworks externos
- Backend real

Servidor local:
- Ejecutar desde la raíz con npm run dev
- Abrir siempre http://localhost:3000/index.html
- No abrir solo http://localhost:3000/

Git:
Ya se hizo commit inicial.
Ya se hizo commit de Fase 1.
Ya se hizo commit de Fase 2.

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
Fase 3 — Grupos Académicos.

## Flujo obligatorio para cada fase

1. Usar preferiblemente Claude Sonnet Thinking.
2. Pegar solo el prompt de la fase correspondiente.
3. Revisar cambios con Review Changes.
4. Probar manualmente en http://localhost:3000/index.html.
5. Revisar consola del navegador.
6. Si todo está bien, guardar con Git:
   git add .
   git commit -m "mensaje de la fase"
7. No avanzar a la siguiente fase hasta confirmar que la anterior funciona.

## Regla principal

No pedir cambios masivos.
No aplicar varias fases juntas.
No reescribir app.js completo.
No tocar app/, components/ ni lib/.
Trabajar principalmente en public/.

## Fase 3 pendiente — Grupos Académicos

Prompt:

Lee AGENTS.md, SAII_BACKLOG.md, SAII_ASISTENCIA_DOCENTE.md y SAII_ESTADO_Y_PROMPTS.md.

Aplica solo la Fase 3: Grupos Académicos.

Objetivo:
Mejorar el módulo de Grupos Académicos sin tocar matrículas, asistencia, notas ni certificados.

Tareas:
1. Corregir la columna Acciones de grupos con iconos horizontales compactos:
   - Ver grupo
   - Editar grupo
   - Cerrar grupo
   - Desactivar o eliminar grupo
2. Agregar modal funcional para el botón “Abrir Nuevo Grupo”.
3. El modal debe tener:
   - Código de grupo
   - Curso
   - Modalidad
   - Docente asignado
   - Fecha de inicio
   - Fecha de fin
   - Horas académicas
   - Cupo máximo
   - Estado
   - Aula o laboratorio
   - Observaciones
4. Modalidades:
   - Curso regular
   - Examen de suficiencia
5. Estados:
   - Abierto
   - En curso
   - Terminado
   - Cerrado
6. Si modalidad es Curso regular, mostrar campos de fechas, horas, cupo y docente.
7. Si modalidad es Examen de suficiencia, mostrar fecha examen, hora, aula, evaluador/docente y curso evaluado.
8. Validar:
   - Código obligatorio
   - Curso obligatorio
   - Docente obligatorio
   - Cupo mayor a cero
   - Fechas válidas
   - Estado obligatorio
9. Al guardar, agregar el grupo a los datos mock y actualizar la tabla.
10. Mostrar toast de éxito.
11. Mantener diseño institucional, limpio y sobrio.

Restricciones:
- No tocar Matrículas.
- No tocar Asistencia Docente.
- No tocar Registro de Notas.
- No tocar Certificados.
- No reescribir app.js completo.
- No tocar archivos de app/, components/ ni lib/.
- Mantener HTML5, CSS3 y JavaScript puro.
- Usar los estilos de iconos existentes de Fase 1.

Trabajar principalmente en:
- public/js/app.js
- public/js/data.js si faltan datos mock
- public/css/styles.css si hace falta
- public/index.html solo si es estrictamente necesario

Al finalizar:
1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar abrir, ver, editar, cerrar y desactivar grupo.
4. No avances a Fase 4.

Commit sugerido:
git add .
git commit -m "feat: fase 3 grupos academicos"

## Fase 4 pendiente — Matrículas

Prompt:

Lee AGENTS.md, SAII_BACKLOG.md, SAII_ASISTENCIA_DOCENTE.md y SAII_ESTADO_Y_PROMPTS.md.

Aplica solo la Fase 4: Matrículas.

Objetivo:
Rediseñar el módulo Matrículas sin tocar asistencia, notas ni certificados.

Tareas:
1. Rediseñar la card resumen del grupo/curso.
2. La card resumen debe tener padding, bordes redondeados y buena separación visual.
3. Mostrar:
   - Grupo
   - Curso
   - Docente
   - Modalidad
   - Cupo máximo
   - Matriculados
   - Cupos disponibles
   - Estado
4. La búsqueda de alumnos debe estar arriba en una card compacta.
5. Los resultados de búsqueda deben mostrar máximo 3 a 5 alumnos.
6. Cada resultado debe tener icono de agregar.
7. La tabla “Alumnos Matriculados” debe estar abajo y ocupar todo el ancho.
8. Columnas:
   - Código
   - Alumno
   - DNI
   - Ciclo
   - Promoción
   - Fecha de matrícula
   - Estado
   - Acciones
9. Acciones con iconos:
   - Ver matrícula
   - Editar matrícula
   - Retirar alumno
10. No permitir alumno duplicado en el mismo grupo.
11. Mostrar mensaje si el alumno ya está matriculado.
12. Actualizar contador de cupos.
13. Mantener diseño limpio, académico y responsivo.

Restricciones:
- No tocar Asistencia Docente.
- No tocar Registro de Notas.
- No tocar Certificados.
- No reescribir app.js completo.
- No tocar app/, components/ ni lib/.

Al finalizar:
1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar matrícula.
4. No avances a Fase 5.

Commit sugerido:
git add .
git commit -m "feat: fase 4 redisenio matriculas"

## Fase 5 pendiente — Control de Asistencia Docente

Prompt:

Lee AGENTS.md, SAII_BACKLOG.md, SAII_ASISTENCIA_DOCENTE.md y SAII_ESTADO_Y_PROMPTS.md.

Aplica solo la Fase 5: Control de Asistencia Docente y Horas Dictadas.

Objetivo:
Digitalizar el formato físico de Control de Asistencia Docente usado por el Instituto de Informática.

Importante:
Este módulo no debe enfocarse en asistencia de alumnos.
Debe registrar asistencia del docente, sesiones realizadas y horas dictadas.

Vista Docente:
1. La pantalla debe llamarse “Control de Asistencia Docente”.
2. El docente solo debe ver sus cursos o exámenes asignados.
3. Debe seleccionar una instancia académica.
4. Al seleccionar, mostrar una plantilla/card institucional con:
   - Universidad Nacional de Piura
   - Facultad de Ingeniería Industrial
   - Instituto de Informática
   - Control de Asistencia Docente
   - Modalidad
   - Curso
   - Horario
   - Fecha inicio y fecha final si es curso regular
   - Fecha del examen si es examen de suficiencia
   - Duración
   - Docente
5. Tabla:
   - Fecha
   - Hora entrada
   - Hora salida
   - Total horas
   - Enlace Meet
   - Observación
   - Acciones
6. Permitir agregar sesión.
7. Permitir editar sesión.
8. Permitir eliminar sesión.
9. Calcular total de horas automáticamente.
10. Mostrar total acumulado al final.
11. Botones:
   - Guardar borrador
   - Enviar planilla
   - Imprimir formato
   - Exportar PDF simulado

Vista Administrador:
1. La pantalla debe llamarse “Asistencias Docentes Registradas”.
2. No debe mostrar como pantalla principal el formulario de registro.
3. Debe mostrar filtros:
   - Docente
   - Curso
   - Modalidad
   - Estado
   - Fecha
4. Tabla:
   - Docente
   - Curso
   - Modalidad
   - Periodo o fecha
   - Total horas
   - Estado
   - Acciones
5. Acciones:
   - Ver detalle
   - Validar
   - Observar
   - Imprimir
   - Exportar
6. Ver detalle debe abrir modal con la planilla completa.
7. Validar cambia estado a Validado.
8. Observar permite escribir observación administrativa.

Estados:
- Borrador
- Enviado
- Validado
- Observado
- Cerrado

Validaciones:
- Fecha obligatoria.
- Hora entrada obligatoria.
- Hora salida obligatoria.
- Hora salida mayor que hora entrada.
- Total horas calculado automáticamente.
- No permitir duplicados por fecha y hora.
- No permitir editar una planilla validada desde rol docente.
- Enlace Meet opcional, pero si se ingresa debe tener formato URL.

Datos mock:
Agregar o ajustar estructura en data.js para:
- asistenciasDocentes
- sesionesAsistenciaDocente
- estados de planilla
- relación con docente
- relación con grupo/instancia académica

Restricciones:
- No tocar Registro de Notas.
- No tocar Certificados.
- No reescribir app.js completo.
- No tocar app/, components/ ni lib/.

Al finalizar:
1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar como Docente.
4. Indica cómo probar como Administrador.
5. No avances a Fase 6.

Commit sugerido:
git add .
git commit -m "feat: fase 5 asistencia docente"

## Fase 6 pendiente — Registro de Notas

Prompt:

Lee AGENTS.md, SAII_BACKLOG.md, SAII_ASISTENCIA_DOCENTE.md y SAII_ESTADO_Y_PROMPTS.md.

Aplica solo la Fase 6: Registro de Notas.

Objetivo:
Corregir y mejorar el módulo de Registro de Notas diferenciando vista de Docente y vista de Administrador.

Vista Docente:
1. Mostrar pantalla “Registro de Notas”.
2. El docente solo debe registrar notas de sus grupos asignados.
3. Debe tener:
   - Selector de grupo asignado
   - Card resumen: grupo, curso, docente, modalidad, fechas, horas
4. La tabla debe ser horizontal.
5. Estructura obligatoria:
   Código | Alumno | Módulo 1 | Módulo 2 | Módulo 3 | ... | Promedio | Estado | Acciones
6. Cada módulo debe ser una columna.
7. Cada alumno debe ser una fila.
8. No poner módulos como filas.
9. Cada nota debe ser input numérico de 0 a 20.
10. Calcular promedio ponderado con porcentajes.
11. Estado:
   - Pendiente si faltan notas
   - Aprobado si promedio >= 11
   - Desaprobado si promedio < 11
12. Acciones por fila con iconos:
   - Ver detalle
   - Editar notas
   - Limpiar notas
13. Botones generales:
   - Guardar notas
   - Cerrar acta
   - Exportar acta
14. Usar overflow horizontal si la tabla no cabe.

Vista Administrador:
1. Mostrar pantalla “Actas de Notas Registradas”.
2. No mostrar edición directa como pantalla principal.
3. Filtros:
   - Curso
   - Grupo
   - Docente
   - Modalidad
   - Estado
4. Tabla:
   - Grupo
   - Curso
   - Docente
   - Modalidad
   - Matriculados
   - Notas completas
   - Promedio del grupo
   - Estado del acta
   - Acciones
5. Acciones:
   - Ver acta
   - Imprimir
   - Exportar
   - Reabrir acta, simulación administrativa

Validaciones:
- Nota entre 0 y 20.
- No cerrar acta si faltan notas.
- Promedio solo si notas completas.
- Mostrar alerta si hay notas incompletas.

Restricciones:
- No tocar Asistencia Docente.
- No tocar Certificados.
- No reescribir app.js completo.
- No tocar app/, components/ ni lib/.

Al finalizar:
1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar cálculo de promedio.
4. No avances a Fase 7.

Commit sugerido:
git add .
git commit -m "feat: fase 6 registro de notas"

## Fase 7 pendiente — Certificados, Reportes, Usuarios, Roles y Configuración

Prompt:

Lee AGENTS.md, SAII_BACKLOG.md, SAII_ASISTENCIA_DOCENTE.md y SAII_ESTADO_Y_PROMPTS.md.

Aplica solo la Fase 7.

Certificados:
1. Agregar botón “Generar certificados pendientes”.
2. Generar certificados para alumnos que:
   - tengan curso o examen terminado
   - tengan nota final >= 11
   - cumplan requisitos de asistencia docente/horas dictadas si aplica
   - no tengan certificado generado
3. Estados:
   - Generado
   - Pendiente
   - No apto
4. Acciones con iconos:
   - Ver certificado
   - Generar certificado individual
   - Descargar PDF simulado
   - Imprimir
   - Anular certificado
5. Vista previa formal en modal con:
   - Universidad Nacional de Piura
   - Instituto de Informática
   - SAII
   - Código de certificado
   - Nombre completo del alumno
   - Código del alumno
   - DNI
   - Curso
   - Modalidad
   - Fecha inicio y fin si fue curso regular
   - Fecha examen si fue examen de suficiencia
   - Horas académicas
   - Promedio final
   - Fecha de emisión
   - Firma del responsable como placeholder

Reportes:
1. Agregar sección “Reportes guardados”.
2. CRUD simulado:
   - crear reporte
   - ver reporte
   - editar configuración
   - eliminar reporte
   - exportar PDF
   - exportar Excel

Usuarios y roles:
1. CRUD de usuarios.
2. CRUD de roles.
3. Roles:
   - Administrador
   - Secretaria Académica
   - Docente
   - Coordinador Académico
4. Agregar selector de rol simulado para probar Administrador y Docente.

Configuración:
1. Permitir editar:
   - nombre del sistema
   - nombre del instituto
   - periodo académico actual
   - nota mínima aprobatoria
   - asistencia mínima / horas requeridas
   - tema por defecto
   - datos de contacto
   - responsable académico
2. Acciones:
   - ver configuración
   - editar configuración
   - guardar cambios
   - restaurar valores por defecto

Restricciones:
- No reescribir app.js completo.
- No tocar app/, components/ ni lib/.
- Mantener HTML5, CSS3 y JavaScript puro.
- Mantener diseño institucional.

Al finalizar:
1. Indica archivos modificados.
2. Indica funciones modificadas.
3. Indica cómo probar certificados pendientes.
4. Indica cómo probar reportes, usuarios, roles y configuración.

Commit sugerido:
git add .
git commit -m "feat: fase 7 certificados reportes usuarios configuracion"
