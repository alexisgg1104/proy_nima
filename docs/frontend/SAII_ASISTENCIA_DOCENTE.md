# SAII_ASISTENCIA_DOCENTE.md — Documento histórico / no vigente para Fase 5

## Estado de este documento

Este archivo queda conservado solo como referencia histórica porque anteriormente se había planteado la Fase 5 como **Control de Asistencia Docente y Horas Dictadas**.

Sin embargo, el alcance vigente fue corregido:

```text
La Fase 5 es Control de Asistencia de Alumnos.
```

La asistencia debe ser registrada por el **docente**, pero sobre los **alumnos matriculados** en sus grupos asignados.

---

## Documento vigente para la Fase 5

Para implementar la Fase 5, el agente debe usar:

```text
SAII_ASISTENCIA_ALUMNOS.md
```

Ese documento reemplaza la especificación anterior y debe considerarse la fuente de verdad.

---

## Regla para agentes

Si un agente lee este archivo durante la Fase 5, debe detener la interpretación de este documento como especificación activa y abrir:

```text
SAII_ASISTENCIA_ALUMNOS.md
```

No debe implementar:

- control de horas dictadas del docente;
- planillas de asistencia docente;
- validación administrativa de horas del docente;
- estructura `teacherAttendance[]` para Fase 5.

Sí debe implementar:

- control de asistencia de alumnos;
- registro realizado por docente;
- alumnos matriculados por grupo;
- estados Presente, Tarde, Falta y Justificado;
- estructura `studentAttendance[]`;
- resumen final en `SAII_BACKLOG.md`.

---

## Motivo del cambio

El usuario aclaró que:

```text
La Fase 5 es Control de Asistencia de Alumnos donde el docente va a registrar.
```

Por lo tanto, cualquier documentación anterior sobre asistencia docente queda reemplazada por `SAII_ASISTENCIA_ALUMNOS.md`.

---

*Documento conservado por compatibilidad de nombre.*  
*No usar como fuente de implementación de Fase 5.*
