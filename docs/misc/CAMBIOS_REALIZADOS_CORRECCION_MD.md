# Cambios realizados — Corrección de documentación SAII con README como entrada única

## Objetivo de esta corrección

Se corrigieron los `.md` para que funcionen para **todas las fases**, no solo para la Fase 5, y para que un agente en Antigravity pueda trabajar con una sola instrucción corta:

```text
Lee README.md y haz la Fase X.
```

El `README.md` quedó como **archivo de entrada única**. Su primera instrucción ordena al agente leer `SAII_CONTEXTO_CONTINUIDAD.md`, `SAII_BACKLOG.md`, `SAII_ESTADO_Y_PROMPTS.md` y `AGENTS.md` si existe.

Además, se corrigieron tres puntos importantes indicados por el usuario:

1. El proyecto **sí tendrá backend** más adelante.
2. La **Fase 5 es Control de Asistencia de Alumnos**, registrada por el docente.
3. El backlog debe incluir el resumen que el agente genera al terminar cada fase.

---

## Archivos generados/corregidos

### 1. `AGENTS.md`

Cambios principales:

- Se dejó una regla general para cualquier fase: `Haz la Fase X`.
- Se aclaró que el agente debe leer los `.md` y buscar el detalle sin pedir más explicación.
- Se agregó que el proyecto sí tendrá backend futuro.
- Se aclaró que no debe implementarse backend dentro de fases frontend salvo instrucción explícita.
- Se corrigió la regla de Fase 5:
  - Antes: asistencia docente / horas dictadas.
  - Ahora: asistencia de alumnos registrada por docente.
- Se agregó obligación de actualizar `SAII_BACKLOG.md` con el resumen al finalizar una fase.

---

### 2. `SAII_CONTEXTO_CONTINUIDAD.md`

Cambios principales:

- Se reforzó el alcance final con backend PHP MVC + MySQL.
- Se separó claramente:
  - Etapa actual: frontend mock.
  - Etapa posterior: backend real.
- Se corrigió el alcance de Asistencia:
  - Fase 5 vigente = Control de Asistencia de Alumnos.
- Se agregó el flujo donde el agente debe revisar backlog y bitácora antes de continuar.
- Se integró el flujo GitHub desde Antigravity.

---

### 3. `SAII_BACKLOG.md`

Cambios principales:

- Se actualizó el mapa de fases para todas las fases.
- Se corrigió Fase 5 como:

```text
Control de Asistencia de Alumnos
```

- Se agregó la etapa futura de backend PHP MVC + MySQL.
- Se agregó la sección:

```text
## Bitácora de ejecución de fases
```

- Se agregó un formato obligatorio para que el agente pegue el resumen al terminar cada fase.
- Se dejaron espacios de resumen para Fase 3, Fase 4, Fase 5, Fase 6 y Fase 7.
- Se mantuvieron Fase 1 y Fase 2 como completadas.

---

### 4. `SAII_ESTADO_Y_PROMPTS.md`

Cambios principales:

- Se creó un prompt maestro para cualquier fase.
- Se agregó regla de documentación específica por fase.
- Se actualizó Fase 5 como asistencia de alumnos.
- Se mantuvieron prompts operativos para Fase 3, Fase 4, Fase 6 y Fase 7.
- Se agregaron referencias a actualizar `SAII_BACKLOG.md` al finalizar cada fase.
- Se corrigió Fase 7 para que use asistencia mínima de alumnos si aplica.
- Se agregó prompt futuro para backend.
- Se mantuvo el flujo GitHub completo:
  - rama;
  - push;
  - Pull Request;
  - merge a `main`;
  - actualización de `main` local.

---

### 5. `SAII_ASISTENCIA_ALUMNOS.md`

Archivo nuevo y fuente vigente para Fase 5.

Incluye:

- Objetivo del módulo.
- Vista Docente.
- Vista Administrador.
- Vista Secretaria/Coordinador.
- Estados por alumno:
  - Presente.
  - Tarde.
  - Falta.
  - Justificado.
- Estados de lista:
  - Borrador.
  - Registrada.
  - Observada.
  - Cerrada.
- Nomenclatura técnica:
  - `studentAttendance[]`.
  - `records[]`.
  - `attendanceStatus`.
- Datos mock sugeridos.
- Funciones sugeridas para `DataManager`.
- Relación con grupos y matrículas.
- Relación futura con certificados y reportes.
- Pruebas manuales obligatorias.

---

### 6. `SAII_ASISTENCIA_DOCENTE.md`

Cambios principales:

- Se convirtió en documento histórico/no vigente.
- Se agregó una redirección clara hacia `SAII_ASISTENCIA_ALUMNOS.md`.
- Se indicó explícitamente que no debe usarse como fuente para Fase 5.

Motivo:

La Fase 5 fue corregida por el usuario como asistencia de alumnos registrada por docente.

---

### 7. `README.md`

Cambios principales:

- Se corrigió la descripción para mencionar asistencia de alumnos.
- Se aclaró que el backend sí existirá en etapa posterior.
- Se separó tecnología actual frontend y backend futuro.
- Se eliminó la contradicción de Tailwind.
- Se agregó guía para agentes.
- Se agregó referencia a `SAII_ASISTENCIA_ALUMNOS.md`.
- Se actualizó la lista de módulos.

---

## Prompt recomendado final

Para cualquier fase, el usuario solo debe escribir:

```text
Lee README.md y haz la Fase X.
```

El `README.md` funciona como entrada única y ordena al agente leer internamente los archivos necesarios. Para Fase 5 no hace falta escribir todo otra vez: el agente debe saber que debe leer también:

```text
SAII_ASISTENCIA_ALUMNOS.md
```

---

## Regla final agregada

Al finalizar una fase, el agente debe actualizar `SAII_BACKLOG.md` con su resumen en la sección:

```text
## Bitácora de ejecución de fases
```

Si no puede editar el archivo, debe entregar el bloque listo para copiar y pegar.

---

## Corrección adicional aplicada

Se ajustó la lógica de entrada para que el usuario no tenga que escribir una lista larga de archivos.

Prompt definitivo para Antigravity:

```text
Lee README.md y haz la Fase X.
```

El `README.md` ahora contiene al inicio la instrucción obligatoria para que el agente lea los archivos internos necesarios antes de ejecutar la fase.
