# 📘 Guía de Usuario — SAII en la Nube (Producción)

**Sistema Administrativo del Instituto de Informática**  
Universidad Nacional de Piura — Facultad de Ingeniería Industrial

---

## 🌐 Acceso al Sistema

> **URL de Producción:**  
> **[https://saii.up.railway.app/index.html](https://saii.up.railway.app/index.html)**

El sistema está disponible las 24 horas desde cualquier dispositivo con conexión a internet (PC, tablet o celular) sin necesidad de instalar nada.

---

## 🔑 Credenciales de Acceso

Al ingresar al sistema se muestra la pantalla de inicio de sesión. Selecciona el rol correspondiente e ingresa las credenciales:

| Rol | Usuario | Contraseña | Acceso a módulos |
|-----|---------|------------|-----------------|
| **Administrador / Director** | `admin` | `123` | Todos los módulos completos |
| **Secretaria Académica** | `secretaria` | `123` | Alumnos, Matrículas, Certificados, Reportes |
| **Docente / Instructor** | `docente01` | `123` | Asistencia, Notas, Reportes |
| **Coordinador Académico** | `coordinador` | `123` | Cursos, Grupos, Alumnos, Reportes |
| **Decano** | `decano` | `123` | Certificados |

> [!IMPORTANT]
> **Para uso real en producción**, el administrador debe cambiar las contraseñas por defecto desde el módulo **Administración → Usuarios** inmediatamente después del primer acceso.

---

## 🖥️ Pantalla de Inicio de Sesión

1. Abre el navegador y ve a: `https://saii.up.railway.app/index.html`
2. Ingresa tu **usuario o correo electrónico**
3. Ingresa tu **contraseña**
4. Selecciona tu **rol** en el desplegable
5. Haz clic en **"Ingresar al Sistema"**

---

## 📋 Módulos del Sistema

### 📊 Dashboard
Vista general con estadísticas en tiempo real:
- Total de alumnos, docentes, grupos y cursos
- Alumnos con mayor asistencia
- Estado general del ciclo académico

### 👥 Alumnos
- Registrar nuevos alumnos
- Editar datos personales y académicos
- Buscar y filtrar por nombre, DNI o código
- Ver historial de matrículas y asistencia

### 📚 Cursos y Módulos
- Crear y editar cursos académicos
- Gestionar módulos de cada curso
- Asignar horas académicas

### 🎓 Docentes
- Registrar y gestionar docentes
- Ver grupos asignados

### 🏫 Grupos Académicos
- Crear grupos por curso, turno y ciclo
- Asignar docentes y aulas
- Ver lista de alumnos matriculados

### ✍️ Matrículas
- Matricular alumnos en grupos
- Ver el estado de cada matrícula
- Generar comprobante de matrícula

### ✓ Control de Asistencia
- Registrar asistencia por grupo y sesión
- Estados: **Presente**, **Tarde**, **Falta**, **Justificado**
- Ver historial de asistencia por alumno

### 📝 Registro de Notas
- Ingresar notas por alumno y evaluación
- Calcular promedios automáticamente
- Exportar notas a reporte

### 📜 Certificados
- Generar certificados de conclusión
- Buscar y descargar certificados previos

### 📈 Reportes
- Reportes académicos por periodo, grupo, docente
- Exportar datos en formato tabla

### ⚙️ Administración (solo Admin)
- **Usuarios**: crear, editar y desactivar cuentas del sistema
- **Roles y permisos**: configurar qué módulos puede ver cada rol
- **Configuración general**: datos de la institución, idioma, etc.

---

## 🔒 Recuperación de Contraseña

Si olvidaste tu contraseña:

1. En la pantalla de login, haz clic en **"¿Olvidaste tu contraseña?"**
2. Ingresa tu **correo electrónico registrado**
3. Haz clic en **"Enviar Código"**
4. Revisa tu bandeja de entrada (o carpeta **Spam/Correo no deseado**)
5. Copia el código de 6 dígitos del correo
6. Ingrésalo en el campo **"Código de Recuperación"**
7. Escribe tu **nueva contraseña**
8. Haz clic en **"Actualizar Contraseña"**

> [!NOTE]
> El código de recuperación expira en **30 minutos**. Si no lo usas a tiempo, deberás solicitar uno nuevo.

---

## 🌙 Modo Claro / Oscuro

El sistema soporta dos temas visuales. Puedes cambiar entre ellos usando el botón de 🌙 / ☀️ ubicado en la barra superior derecha. La preferencia se guarda automáticamente en tu navegador.

---

## 🔄 Simulación de Roles

Los usuarios con rol **Administrador** pueden simular otros roles para verificar qué módulos son visibles desde cada perfil, usando el selector **"Simular Rol"** en la barra superior.

---

## 📱 Compatibilidad

El sistema es responsive y funciona en:
- 💻 Computadoras (Windows, macOS, Linux)
- 📱 Teléfonos y tablets (Android, iOS)
- Navegadores: **Chrome, Edge, Firefox, Brave, Safari**

---

## ⚠️ Recomendaciones de Seguridad

1. **Cerrar sesión** al terminar de usar el sistema, especialmente en equipos compartidos
2. **No compartir credenciales** entre usuarios — cada persona debe tener su propia cuenta
3. **Cambiar la contraseña por defecto** (`123`) antes de usar el sistema con datos reales
4. Usar el sistema únicamente desde redes de confianza

---

## 🛠️ Infraestructura en la Nube

| Componente | Servicio | Detalles |
|------------|---------|---------|
| Servidor web | Railway | PHP 8.5, contenedor Linux |
| Base de datos | Railway MySQL | MySQL 8, backup automático |
| Correo electrónico | Resend | API transaccional, entrega garantizada |
| Dominio | Railway | `saii.up.railway.app` (HTTPS) |

---

## 📞 Soporte Técnico

Para reportar problemas o solicitar asistencia técnica, contactar al equipo de desarrollo:

**Universidad Nacional de Piura — Instituto de Informática**  
Facultad de Ingeniería Industrial  

---

*Versión actual del sistema: **Fase Backend B1** | Última actualización: Julio 2025*
