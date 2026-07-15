# SAII — Sistema Administrativo del Instituto de Informática

**SAII** es una solución web integral para la gestión académica y administrativa del Instituto de Informática de la Facultad de Ingeniería Industrial de la **Universidad Nacional de Piura (UNP)**.

El sistema implementa una arquitectura cliente-servidor con PHP 8 (backend MVC), MySQL (base de datos), JavaScript Vanilla (frontend) y despliegue en la nube mediante **Railway** (servidor) y **Resend** (correo transaccional).

---

## 🌐 Acceso en Producción (Nube)

> El sistema está desplegado y disponible públicamente en:
> **[https://saii.up.railway.app/index.html](https://saii.up.railway.app/index.html)**

Para credenciales de acceso y guía de uso, consulta:
📄 **[docs/GUIA_USUARIO_NUBE.md](docs/GUIA_USUARIO_NUBE.md)**

---

## 🗂️ Estructura del Proyecto

```
saii-frontend-development/
│
├── public/                     # Raíz web servida por PHP (-t public/)
│   ├── index.html              # SPA principal del frontend (Vanilla JS)
│   ├── index.php               # Router HTTP principal del backend (todas las rutas API)
│   ├── router.php              # Router de entrada para Railway / PHP built-in server
│   ├── favicon.ico
│   ├── css/
│   │   └── styles.css          # Hoja de estilos global del sistema
│   ├── js/
│   │   ├── app.js              # Lógica de la aplicación (controlador frontend)
│   │   └── data.js             # Capa de datos: mock + DataManager + APIClient
│   └── images/                 # Assets gráficos (SVG, PNG, logos)
│
├── app/                        # Código backend PHP (arquitectura por capas)
│   ├── Controllers/            # Controladores HTTP (AuthController, UserController, etc.)
│   ├── Models/                 # Modelos de datos (User, Role, Student, etc.)
│   └── Core/                   # Núcleo del framework (BaseController, autoloader)
│
├── config/
│   └── Database.php            # Singleton de conexión PDO a MySQL
│
├── database/
│   ├── schema.sql              # DDL: creación de tablas
│   ├── seeds.sql               # DML: datos iniciales (roles, usuarios, etc.)
│   ├── reset.sql               # Script de limpieza/reinicio
│   └── README.md               # Documentación del modelo de datos
│
├── scripts/                    # Utilidades y scripts de mantenimiento
│   ├── import_db.php           # Importa schema + seeds vía HTTP (uso único en deploy)
│   ├── check_roles.php         # Diagnóstico de roles y permisos en la BD
│   └── update_db_permissions.php  # Actualiza columna permissions si falta
│
├── docs/                       # Documentación del proyecto
│   ├── GUIA_USUARIO_NUBE.md    # ⭐ Guía de usuario (sistema en producción)
│   ├── DESPLIEGUE.md           # Guía de despliegue en Railway
│   ├── backend/                # Backlog y estado del backend
│   ├── frontend/               # Backlog y estado del frontend
│   │   ├── SAII_CSS_GUIDE.md   # 🎨 Guía de CSS y diseño responsivo
│   │   └── ...
│   └── rules/                  # Reglas técnicas del proyecto
│
├── legacy_nextjs/              # Archivos residuales de la etapa Next.js (no usar)
│
├── .env.example                # Plantilla de variables de entorno
├── .gitignore
├── composer.json               # Dependencias PHP (PHPMailer, etc.)
├── Procfile                    # Comando de inicio para Railway
└── README.md                   # Este archivo
```

---

## 🚀 Guía de Instalación Local (Desarrollo)

### 1. Requisitos Previos
- **Node.js** 18+ (para el servidor de desarrollo del frontend)
- **XAMPP** con PHP 8.0+ y MySQL
- Navegador web moderno

---

### 2. Clonar el repositorio
```bash
git clone https://github.com/alexisgg1104/proy_nima.git
cd proy_nima
```

---

### 3. Instalar dependencias

**Frontend (Node.js):**
```bash
npm install
npm run dev
# Disponible en: http://127.0.0.1:3000/index.html
```

**Backend (PHP / Composer):**
```bash
composer install
```

---

### 4. Configurar la Base de Datos (MySQL / XAMPP)
1. Abre XAMPP → inicia **Apache** y **MySQL**
2. Abre **phpMyAdmin**: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Crea una base de datos llamada `proy_nima` (colación: `utf8mb4_unicode_ci`)
4. Importa `database/schema.sql` → crea las tablas
5. Importa `database/seeds.sql` → carga los datos iniciales

---

### 5. Configurar Variables de Entorno (`.env`)
```bash
cp .env.example .env
```
Edita `.env` con tus credenciales locales:
```ini
; Base de datos
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=proy_nima
DB_USER=root
DB_PASS=

; Seguridad
CSRF_ENABLED=true
SESSION_SECURE=false

; Correo (opcional para local — usa tu App Password de Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=tu_app_password_de_16_letras
SMTP_FROM=tu_correo@gmail.com
SMTP_FROM_NAME="SAII - Instituto de Informática"

; Resend API (recomendado para producción, opcional en local)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

> [!WARNING]
> El archivo `.env` está en `.gitignore`. **Nunca lo subas al repositorio.**

---

### 6. Iniciar el Backend PHP
```powershell
# Con XAMPP en disco C:
& C:\xampp\php\php.exe -S 127.0.0.1:8000 -t public/ public/router.php

# Con XAMPP en disco D:
& D:\xampp\php\php.exe -S 127.0.0.1:8000 -t public/ public/router.php
```

---

### 7. Acceder al sistema
```
http://127.0.0.1:3000/index.html
```

**Credenciales de prueba:**

| Rol | Usuario | Contraseña | Nombre de Referencia |
|-----|---------|------------|----------------------|
| Administrador | `admin` | `admin123` | DR. JONATHAN DAVID NIMA RAMOS |
| Secretaria | `secretaria` | `secretaria123` | Juan María Secretaria |
| Docente | `roberto.silva` | `docente123` | Roberto Silva Acosta |
| Docente | `lucia.espinoza` | `docente123` | Lucía Espinoza Torres |
| Coordinador | `coordinador` | `coordinador123` | Carlos Coordinador Académico |
| Decano | `decano` | `decano123` | Dr. Francisco Javier Cruz Vilchez |

---

## ☁️ Infraestructura en Producción (Railway)

| Servicio | Proveedor | Descripción |
|----------|-----------|-------------|
| Servidor PHP | **Railway** | PHP 8.5, servidor built-in, Nixpacks |
| Base de datos | **Railway MySQL** | MySQL 8, red privada interna |
| Correo transaccional | **Resend** | API HTTP (sin SMTP, bypassa bloqueos de nube) |

### Variables de entorno requeridas en Railway

```ini
DB_HOST=hayabusa.proxy.rlwy.net
DB_PORT=35283
DB_NAME=railway
DB_USER=root
DB_PASS=<generado por Railway>
DB_SSL=false
CSRF_ENABLED=true
SESSION_SECURE=true
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
SMTP_FROM=onboarding@resend.dev
SMTP_FROM_NAME=SAII - Instituto de Informática
```

> [!NOTE]
> Las variables `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` son ignoradas en producción porque el sistema usa la API HTTP de Resend en vez de SMTP directo (Railway bloquea todos los puertos SMTP salientes).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| Backend | PHP 8.5 (MVC, sin frameworks) |
| Base de datos | MySQL 8 / MariaDB |
| ORM / acceso a datos | PDO con consultas preparadas |
| Correo | Resend API (producción) / PHPMailer SMTP (local) |
| Hosting | Railway |
| Control de versiones | GitHub (`alexisgg1104/proy_nima`) |

---

## 📚 Documentación Adicional

| Documento | Descripción |
|-----------|-------------|
| [docs/GUIA_USUARIO_NUBE.md](docs/GUIA_USUARIO_NUBE.md) | Guía de uso del sistema en producción |
| [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) | Pasos para desplegar en Railway desde cero |
| [database/README.md](database/README.md) | Modelo de datos y estructura de tablas |
| [docs/backend/](docs/backend/) | Backlog técnico del backend |
| [docs/frontend/](docs/frontend/) | Backlog técnico del frontend |

---

## 🔐 Seguridad Implementada

- Tokens CSRF en todas las peticiones POST
- Contraseñas hasheadas con `password_hash()` (bcrypt)
- Sesiones PHP seguras con `SameSite=Strict`
- Consultas SQL con PDO y parámetros preparados (anti SQL-Injection)
- Control de acceso por roles (admin, secretary, teacher, coordinator, dean)
- Tokens de recuperación de contraseña almacenados en BD con expiración de 30 min

---

## 👨‍💻 Autores

**Universidad Nacional de Piura — Facultad de Ingeniería Industrial**  
Instituto de Informática  
© 2024–2025 SAII. Todos los derechos reservados.
