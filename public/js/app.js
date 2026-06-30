// SAII - Sistema Administrativo - Main App
// ============================================

class SAIIApp {
    constructor() {
        this.currentView = 'dashboard';
        this.isDarkMode = localStorage.getItem('saii_darkMode') === 'true';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.setupLoginForm();
    }

    // ========== LOGIN MANAGEMENT ==========
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('role').value;

        if (!username || !password || !role) {
            this.showToast('Por favor complete todos los campos', 'error');
            return;
        }

        if (DataManager.validateLogin(username, password, role)) {
            this.showToast('Inicio de sesión exitoso', 'success');
            setTimeout(() => {
                this.loginUser(role);
            }, 500);
        } else {
            this.showToast('Usuario o contraseña incorrectos', 'error');
        }
    }

    loginUser(role) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        document.getElementById('currentUser').textContent = DataManager.currentUser.fullName;
        
        // Set role-based access
        this.setRolePermissions(role);
        
        // Load dashboard
        this.loadView('dashboard');
    }

    setRolePermissions(role) {
        // Set role-based menu visibility
        const rolePermissions = {
            admin: ['dashboard', 'students', 'courses', 'teachers', 'groups', 'enrollments', 'attendance', 'grades', 'certificates', 'reports', 'users', 'settings'],
            secretary: ['dashboard', 'students', 'enrollments', 'certificates', 'reports'],
            teacher: ['dashboard', 'grades', 'attendance', 'reports'],
            coordinator: ['dashboard', 'courses', 'groups', 'reports', 'students']
        };

        const permissions = rolePermissions[role] || [];
        
        // Show/hide nav items based on permissions
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const view = item.getAttribute('data-view');
            if (!permissions.includes(view)) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
            }
        });
    }

    logout() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('loginForm').reset();
        this.showToast('Sesión cerrada correctamente', 'success');
    }

    // ========== THEME MANAGEMENT ==========
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateThemeButton();
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('saii_darkMode', this.isDarkMode);
        this.applyTheme();
    }

    applyTheme() {
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
        this.updateThemeButton();
    }

    updateThemeButton() {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.textContent = this.isDarkMode ? '☀️' : '🌙';
        }
    }

    // ========== NAVIGATION ==========
    setupEventListeners() {
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                this.loadView(view);
                
                // Update active state
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Theme toggle
        this.setupTheme();

        // User menu
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', () => {
                userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
            });
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-menu')) {
                    userDropdown.style.display = 'none';
                }
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.toggle('active');
            });
        }

        // Module buttons
        this.setupModuleButtons();

        // Quick action buttons
        this.setupQuickActions();
    }

    setupModuleButtons() {
        const buttons = document.querySelectorAll('[data-action]');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                const view = btn.getAttribute('data-view');
                
                if (action === 'new-student') {
                    this.openStudentModal();
                } else if (action === 'new-teacher') {
                    this.openTeacherModal();
                } else if (action === 'new-group') {
                    this.openGroupModal();
                } else if (action === 'new-course') {
                    this.openCourseModal();
                } else if (action === 'new-certificate') {
                    this.openCertificateModal();
                } else if (action === 'new-user') {
                    this.openUserModal();
                } else if (view) {
                    this.loadView(view);
                }
            });
        });
    }

    setupQuickActions() {
        const quickBtns = document.querySelectorAll('.quick-action-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = btn.getAttribute('data-view');
                if (view) {
                    this.loadView(view);
                }
            });
        });
    }

    // ========== VIEW MANAGEMENT ==========
    loadView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
        
        // Show requested view
        const view = document.getElementById(viewName);
        if (view) {
            view.style.display = 'block';
        }

        // Update page header
        const titles = {
            dashboard: { title: 'Dashboard', desc: 'Resumen general del sistema académico' },
            students: { title: 'Gestión de Alumnos', desc: 'Administrar base de datos de estudiantes' },
            courses: { title: 'Cursos y Módulos', desc: 'Gestionar cursos y sus componentes' },
            teachers: { title: 'Gestión de Docentes', desc: 'Administrar personal académico' },
            groups: { title: 'Grupos Académicos', desc: 'Gestionar grupos y secciones' },
            enrollments: { title: 'Matrículas', desc: 'Registrar estudiantes en grupos' },
            attendance: { title: 'Asistencia', desc: 'Registrar asistencia en clases' },
            grades: { title: 'Registro de Notas', desc: 'Ingresar y gestionar calificaciones' },
            certificates: { title: 'Certificados y Constancias', desc: 'Emitir documentos académicos' },
            reports: { title: 'Reportes', desc: 'Análisis y estadísticas académicas' },
            users: { title: 'Usuarios y Roles', desc: 'Administración de usuarios del sistema' },
            settings: { title: 'Configuración', desc: 'Parámetros generales del sistema' }
        };

        const info = titles[viewName] || { title: 'Página', desc: 'Contenido' };
        document.getElementById('pageTitle').textContent = info.title;
        document.getElementById('pageDescription').textContent = info.desc;

        // Load view-specific content
        switch(viewName) {
            case 'students':
                this.loadStudents();
                break;
            case 'courses':
                this.loadCourses();
                break;
            case 'teachers':
                this.loadTeachers();
                break;
            case 'groups':
                this.loadGroups();
                break;
            case 'enrollments':
                this.setupEnrollments();
                break;
            case 'attendance':
                this.setupAttendance();
                break;
            case 'grades':
                this.setupGrades();
                break;
            case 'certificates':
                this.loadCertificates();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'users':
                this.loadUsers();
                break;
        }

        // Update breadcrumb
        this.updateBreadcrumb(viewName);
    }

    updateBreadcrumb(viewName) {
        const breadcrumbs = document.getElementById('breadcrumbs');
        breadcrumbs.innerHTML = '<a href="#" class="breadcrumb-item" data-view="dashboard">Inicio</a>';
        
        if (viewName !== 'dashboard') {
            const titles = {
                students: 'Alumnos',
                courses: 'Cursos y Módulos',
                teachers: 'Docentes',
                groups: 'Grupos Académicos',
                enrollments: 'Matrículas',
                attendance: 'Asistencia',
                grades: 'Notas',
                certificates: 'Certificados',
                reports: 'Reportes',
                users: 'Usuarios',
                settings: 'Configuración'
            };
            breadcrumbs.innerHTML += ` <span> > </span><span class="breadcrumb-item">${titles[viewName]}</span>`;
        }

        // Attach click handlers to breadcrumb items
        document.querySelectorAll('.breadcrumb-item[data-view]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadView(item.getAttribute('data-view'));
            });
        });
    }

    // ========== STUDENTS MODULE ==========
    loadStudents() {
        const students = DataManager.getStudents();
        this.renderStudentsTable(students);
        this.setupStudentFilters();
    }

    renderStudentsTable(students) {
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--color-text-secondary);">No se encontraron alumnos</td></tr>';
            return;
        }

        students.forEach(student => {
            const row = document.createElement('tr');
            const statusLabel = student.status === 'active' ? 'Activo' : 'Inactivo';
            const statusClass = student.status === 'active' ? 'badge-active' : 'badge-inactive';
            const fullName = `${student.firstName} ${student.lastName}`;
            row.innerHTML = `
                <td>${student.code}</td>
                <td>${student.dni}</td>
                <td><strong>${fullName}</strong></td>
                <td>${student.email}</td>
                <td>Promoción ${student.promotion}</td>
                <td><span class="badge-status ${statusClass}">${statusLabel}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewStudentDetail('${student.id}')" title="Ver detalle">&#128269;</button>
                        <button class="icon-btn icon-edit" onclick="app.editStudent('${student.id}')" title="Editar">&#9998;</button>
                        <button class="icon-btn icon-delete" onclick="app.deleteStudent('${student.id}')" title="Desactivar">&#128683;</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    viewStudentDetail(studentId) {
        const student = DataManager.getStudentById(studentId);
        if (!student) return;
        const statusLabel = student.status === 'active' ? 'Activo' : 'Inactivo';
        const statusClass = student.status === 'active' ? 'badge-active' : 'badge-inactive';
        const body = document.getElementById('studentDetailBody');
        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Código</span><span class="detail-value">${student.code}</span></div>
                <div class="detail-item"><span class="detail-label">DNI</span><span class="detail-value">${student.dni}</span></div>
                <div class="detail-item"><span class="detail-label">Nombres</span><span class="detail-value">${student.firstName}</span></div>
                <div class="detail-item"><span class="detail-label">Apellidos</span><span class="detail-value">${student.lastName}</span></div>
                <div class="detail-item"><span class="detail-label">Correo</span><span class="detail-value">${student.email || '-'}</span></div>
                <div class="detail-item"><span class="detail-label">Teléfono</span><span class="detail-value">${student.phone || '-'}</span></div>
                <div class="detail-item"><span class="detail-label">Ciclo</span><span class="detail-value">Ciclo ${student.cycle}</span></div>
                <div class="detail-item"><span class="detail-label">Promoción</span><span class="detail-value">Promoción ${student.promotion}</span></div>
                <div class="detail-item"><span class="detail-label">Estado</span><span class="detail-value"><span class="badge-status ${statusClass}">${statusLabel}</span></span></div>
                ${student.observations ? `<div class="detail-item detail-full"><span class="detail-label">Observaciones</span><span class="detail-value">${student.observations}</span></div>` : ''}
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="app.editStudent('${student.id}'); closeModal();">Editar</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
            </div>
        `;
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('studentDetailModal').style.display = 'block';
    }

    setupStudentFilters() {
        const searchInput = document.getElementById('studentSearch');
        const statusFilter = document.getElementById('studentStatusFilter');
        const cycleFilter = document.getElementById('studentCycleFilter');
        const yearFilter = document.getElementById('studentYearFilter');

        const applyFilters = () => {
            let students = DataManager.getStudents();
            
            if (searchInput.value) {
                const query = searchInput.value.toLowerCase();
                students = students.filter(s => 
                    s.code.includes(query) || 
                    s.dni.includes(query) || 
                    s.firstName.toLowerCase().includes(query) || 
                    s.lastName.toLowerCase().includes(query)
                );
            }

            if (statusFilter.value) {
                students = students.filter(s => s.status === statusFilter.value);
            }

            if (cycleFilter.value) {
                students = students.filter(s => s.cycle === cycleFilter.value);
            }

            if (yearFilter.value) {
                students = students.filter(s => s.promotion === yearFilter.value);
            }

            this.renderStudentsTable(students);
        };

        searchInput.addEventListener('input', applyFilters);
        statusFilter.addEventListener('change', applyFilters);
        cycleFilter.addEventListener('change', applyFilters);
        yearFilter.addEventListener('change', applyFilters);
    }

    openStudentModal(studentId = null) {
        const modal = document.getElementById('studentModal');
        const form = document.getElementById('studentForm');
        const title = document.getElementById('studentModalTitle');

        if (studentId) {
            title.textContent = 'Editar Alumno';
            const student = DataManager.getStudentById(studentId);
            if (student) {
                document.getElementById('studentCode').value = student.code;
                document.getElementById('studentDNI').value = student.dni;
                document.getElementById('studentFirstNames').value = student.firstName;
                document.getElementById('studentLastNames').value = student.lastName;
                document.getElementById('studentEmail').value = student.email;
                document.getElementById('studentPhone').value = student.phone;
                document.getElementById('studentCycle').value = student.cycle;
                document.getElementById('studentPromotion').value = student.promotion;
                document.getElementById('studentStatus').value = student.status;
                document.getElementById('studentObservations').value = student.observations;
            }
        } else {
            title.textContent = 'Nuevo Alumno';
            form.reset();
        }

        document.getElementById('modalOverlay').style.display = 'block';
        modal.style.display = 'block';

        form.onsubmit = (e) => this.handleStudentSubmit(e, studentId);
    }

    handleStudentSubmit(e, studentId) {
        e.preventDefault();

        const data = {
            code: document.getElementById('studentCode').value,
            dni: document.getElementById('studentDNI').value,
            firstName: document.getElementById('studentFirstNames').value,
            lastName: document.getElementById('studentLastNames').value,
            email: document.getElementById('studentEmail').value,
            phone: document.getElementById('studentPhone').value,
            cycle: document.getElementById('studentCycle').value,
            promotion: document.getElementById('studentPromotion').value,
            status: document.getElementById('studentStatus').value,
            observations: document.getElementById('studentObservations').value
        };

        // Validation
        if (!this.validateStudentData(data)) {
            return;
        }

        if (studentId) {
            DataManager.updateStudent(studentId, data);
            this.showToast('Alumno actualizado correctamente', 'success');
        } else {
            DataManager.addStudent(data);
            this.showToast('Alumno registrado correctamente', 'success');
        }

        this.closeModal();
        this.loadStudents();
    }

    validateStudentData(data) {
        if (!data.code || data.code.length !== 10 || isNaN(data.code)) {
            this.showToast('El código debe tener 10 dígitos', 'error');
            return false;
        }
        if (!data.dni || data.dni.length !== 8 || isNaN(data.dni)) {
            this.showToast('El DNI debe tener 8 dígitos', 'error');
            return false;
        }
        if (!data.firstName || !data.lastName) {
            this.showToast('Nombres y apellidos son obligatorios', 'error');
            return false;
        }
        if (data.email && !this.validateEmail(data.email)) {
            this.showToast('Correo electrónico no válido', 'error');
            return false;
        }
        return true;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    editStudent(studentId) {
        this.openStudentModal(studentId);
    }

    deleteStudent(studentId) {
        if (confirm('¿Desactivar este alumno?')) {
            DataManager.updateStudent(studentId, { status: 'inactive' });
            this.showToast('Alumno desactivado correctamente', 'success');
            this.loadStudents();
        }
    }

    loadCourses() {
        const courses = DataManager.getCourses();
        const grid = document.getElementById('coursesGrid');
        grid.innerHTML = '';

        if (courses.length === 0) {
            grid.innerHTML = '<p style="color: var(--color-text-secondary); text-align:center; padding:2rem;">No hay cursos registrados.</p>';
            return;
        }

        courses.forEach(course => {
            const moduleTotal = course.modules.reduce((sum, m) => sum + m.percentage, 0);
            const statusLabel = course.status === 'active' ? 'Activo' : 'Inactivo';
            const statusClass = course.status === 'active' ? 'badge-active' : 'badge-inactive';
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <div class="course-header">
                    <h3 class="course-title">${course.name}</h3>
                    <div class="course-meta">
                        <span>${course.totalHours}h</span>
                        <span class="badge-status ${statusClass}">${statusLabel}</span>
                    </div>
                </div>
                <div class="course-body">
                    <div class="course-info">
                        <div class="course-info-item">
                            <span class="course-info-label">Módulos</span>
                            <span class="course-info-value">${course.modules.length}</span>
                        </div>
                        <div class="course-info-item">
                            <span class="course-info-label">Horas</span>
                            <span class="course-info-value">${course.totalHours}</span>
                        </div>
                        <div class="course-info-item">
                            <span class="course-info-label">Cobertura</span>
                            <span class="course-info-value ${moduleTotal === 100 ? '' : 'pct-warn-text'}">${moduleTotal}%</span>
                        </div>
                    </div>
                    <div style="margin-bottom: 0.75rem;">
                        <strong style="font-size: 0.85rem;">Módulos:</strong>
                        ${course.modules.map(m => `<div style="font-size: 0.82rem; margin-top: 0.2rem; color: var(--color-text-secondary);">• ${m.name}: ${m.percentage}%</div>`).join('')}
                    </div>
                    ${moduleTotal !== 100 ? '<div class="pct-warning-banner">&#9888;&#65039; Los porcentajes no suman 100%</div>' : ''}
                    <div class="course-actions">
                        <button class="icon-btn icon-view" onclick="app.viewCourseDetails('${course.id}')" title="Ver detalles">&#128269;</button>
                        <button class="icon-btn icon-edit" onclick="app.editCourse('${course.id}')" title="Editar">&#9998;</button>
                        <button class="icon-btn icon-delete" onclick="app.deleteCourse('${course.id}')" title="Desactivar">&#128683;</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    deleteCourse(courseId) {
        if (confirm('¿Desactivar este curso?')) {
            const course = DataManager.getCourseById(courseId);
            if (course) {
                course.status = 'inactive';
                this.showToast('Curso desactivado', 'success');
                this.loadCourses();
            }
        }
    }

    viewCourseDetails(courseId) {
        const course = DataManager.getCourseById(courseId);
        if (!course) return;
        const statusLabel = course.status === 'active' ? 'Activo' : 'Inactivo';
        const statusClass = course.status === 'active' ? 'badge-active' : 'badge-inactive';
        const moduleTotal = course.modules.reduce((sum, m) => sum + m.percentage, 0);
        const body = document.getElementById('studentDetailBody');

        // Reutilizamos studentDetailModal para cursos
        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Código</span><span class="detail-value">${course.code || '-'}</span></div>
                <div class="detail-item"><span class="detail-label">Total horas</span><span class="detail-value">${course.totalHours}h</span></div>
                <div class="detail-item detail-full"><span class="detail-label">Nombre del Curso</span><span class="detail-value">${course.name}</span></div>
                <div class="detail-item"><span class="detail-label">Estado</span><span class="detail-value"><span class="badge-status ${statusClass}">${statusLabel}</span></span></div>
                <div class="detail-item"><span class="detail-label">Módulos</span><span class="detail-value">${course.modules.length} módulos (${moduleTotal}% cubierto)</span></div>
            </div>
            <div style="margin-top:1rem;">
                <strong>Módulos:</strong>
                <table class="data-table" style="margin-top:0.5rem;">
                    <thead><tr><th>Módulo</th><th>%</th></tr></thead>
                    <tbody>
                        ${course.modules.map(m => `<tr><td>${m.name}</td><td>${m.percentage}%</td></tr>`).join('')}
                    </tbody>
                </table>
                ${moduleTotal !== 100 ? '<p style="color:#d32f2f; margin-top:0.5rem; font-size:0.85rem;">&#9888;&#65039; Los porcentajes no suman 100%</p>' : ''}
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="app.editCourse('${course.id}'); closeModal();">Editar</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
            </div>
        `;
        const title = document.getElementById('studentDetailModal').querySelector('h2');
        if (title) title.textContent = 'Detalle del Curso';
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('studentDetailModal').style.display = 'block';
    }

    editCourse(courseId) {
        this.openCourseModal(courseId);
    }

    openCourseModal(courseId = null) {
        const modal = document.getElementById('courseModal');
        const form = document.getElementById('courseForm');
        const title = document.getElementById('courseModalTitle');
        form.reset();

        // Clear modules editor
        const rowsContainer = document.getElementById('modulesEditorRows');
        rowsContainer.innerHTML = '';
        this._editingCourseId = courseId;

        if (courseId) {
            title.textContent = 'Editar Curso';
            const course = DataManager.getCourseById(courseId);
            if (course) {
                document.getElementById('courseCode').value = course.code || '';
                document.getElementById('courseName').value = course.name;
                document.getElementById('courseTotalHours').value = course.totalHours;
                document.getElementById('courseDescription').value = course.description || '';
                document.getElementById('courseStatus').value = course.status;
                // Load existing modules
                course.modules.forEach(m => this.addModuleRow(m.name, m.percentage));
            }
        } else {
            title.textContent = 'Nuevo Curso';
            // Start with one empty module row
            this.addModuleRow();
        }

        this.updateModulesTotal();
        document.getElementById('modalOverlay').style.display = 'block';
        modal.style.display = 'block';
        form.onsubmit = (e) => this.handleCourseSubmit(e);
    }

    addModuleRow(name = '', percentage = 0) {
        const container = document.getElementById('modulesEditorRows');
        const idx = container.children.length;
        const row = document.createElement('div');
        row.className = 'module-editor-row';
        row.innerHTML = `
            <input type="text" class="module-name-input" placeholder="Nombre del módulo" value="${name}" required>
            <input type="number" class="module-pct-input" placeholder="%" min="0" max="100" value="${percentage}" required>
            <button type="button" class="icon-btn icon-delete" onclick="this.parentElement.remove(); app.updateModulesTotal();" title="Eliminar módulo">&#128683;</button>
        `;
        row.querySelector('.module-pct-input').addEventListener('input', () => this.updateModulesTotal());
        container.appendChild(row);
        this.updateModulesTotal();
    }

    updateModulesTotal() {
        const inputs = document.querySelectorAll('.module-pct-input');
        const total = Array.from(inputs).reduce((sum, inp) => sum + (parseInt(inp.value) || 0), 0);
        const badge = document.getElementById('modulesPercentageTotal');
        const warning = document.getElementById('modulesWarning');
        if (badge) {
            badge.textContent = `Total: ${total}%`;
            badge.className = 'modules-percentage-badge ' + (total === 100 ? 'pct-ok' : 'pct-warn');
        }
        if (warning) warning.style.display = total !== 100 ? 'block' : 'none';
    }

    handleCourseSubmit(e) {
        e.preventDefault();
        const nameInputs = document.querySelectorAll('.module-name-input');
        const pctInputs = document.querySelectorAll('.module-pct-input');
        const modules = Array.from(nameInputs).map((inp, i) => ({
            name: inp.value.trim(),
            percentage: parseInt(pctInputs[i].value) || 0
        })).filter(m => m.name);
        const total = modules.reduce((s, m) => s + m.percentage, 0);

        if (total !== 100) {
            this.showToast('Los porcentajes de módulos deben sumar exactamente 100%', 'error');
            return;
        }

        const data = {
            code: document.getElementById('courseCode').value.trim(),
            name: document.getElementById('courseName').value.trim(),
            totalHours: parseInt(document.getElementById('courseTotalHours').value),
            description: document.getElementById('courseDescription').value.trim(),
            status: document.getElementById('courseStatus').value,
            modules: modules
        };

        if (!data.name) { this.showToast('El nombre del curso es obligatorio', 'error'); return; }
        if (!data.totalHours || data.totalHours < 1) { this.showToast('Las horas totales deben ser mayor a 0', 'error'); return; }

        const courseId = this._editingCourseId;
        if (courseId) {
            const course = DataManager.getCourseById(courseId);
            if (course) {
                Object.assign(course, data);
                this.showToast('Curso actualizado correctamente', 'success');
            }
        } else {
            DataManager.addCourse(data);
            this.showToast('Curso creado correctamente', 'success');
        }
        this.closeModal();
        this.loadCourses();
    }

    // ========== TEACHERS MODULE ==========
    loadTeachers() {
        const teachers = DataManager.getTeachers();
        this.renderTeachersTable(teachers);
        this.setupTeacherFilters();
    }

    renderTeachersTable(teachers) {
        const tbody = document.getElementById('teachersTableBody');
        tbody.innerHTML = '';

        if (teachers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem; color: var(--color-text-secondary);">No se encontraron docentes</td></tr>';
            return;
        }

        teachers.forEach(teacher => {
            const row = document.createElement('tr');
            const statusLabel = teacher.status === 'active' ? 'Activo' : 'Inactivo';
            const statusClass = teacher.status === 'active' ? 'badge-active' : 'badge-inactive';
            const fullName = `${teacher.firstName} ${teacher.lastName}`;
            row.innerHTML = `
                <td>${teacher.code}</td>
                <td>${teacher.dni}</td>
                <td><strong>${fullName}</strong></td>
                <td>${teacher.email}</td>
                <td>${teacher.phone}</td>
                <td>${teacher.specialty}</td>
                <td><span class="badge-status ${statusClass}">${statusLabel}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewTeacherDetail('${teacher.id}')" title="Ver detalle">&#128269;</button>
                        <button class="icon-btn icon-edit" onclick="app.editTeacher('${teacher.id}')" title="Editar">&#9998;</button>
                        <button class="icon-btn icon-delete" onclick="app.deleteTeacher('${teacher.id}')" title="Desactivar">&#128683;</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    setupTeacherFilters() {
        const searchInput = document.getElementById('teacherSearch');
        searchInput.addEventListener('input', () => {
            let teachers = DataManager.getTeachers();
            const query = searchInput.value.toLowerCase();
            
            teachers = teachers.filter(t => 
                t.code.includes(query) || 
                t.dni.includes(query) || 
                t.firstName.toLowerCase().includes(query) || 
                t.lastName.toLowerCase().includes(query)
            );

            this.renderTeachersTable(teachers);
        });
    }

    editTeacher(teacherId) {
        this.openTeacherModal(teacherId);
    }

    viewTeacherDetail(teacherId) {
        const teacher = DataManager.getTeacherById(teacherId);
        if (!teacher) return;
        const statusLabel = teacher.status === 'active' ? 'Activo' : 'Inactivo';
        const statusClass = teacher.status === 'active' ? 'badge-active' : 'badge-inactive';
        const body = document.getElementById('teacherDetailBody');
        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Código</span><span class="detail-value">${teacher.code}</span></div>
                <div class="detail-item"><span class="detail-label">DNI</span><span class="detail-value">${teacher.dni}</span></div>
                <div class="detail-item"><span class="detail-label">Nombres</span><span class="detail-value">${teacher.firstName}</span></div>
                <div class="detail-item"><span class="detail-label">Apellidos</span><span class="detail-value">${teacher.lastName}</span></div>
                <div class="detail-item"><span class="detail-label">Correo</span><span class="detail-value">${teacher.email || '-'}</span></div>
                <div class="detail-item"><span class="detail-label">Teléfono</span><span class="detail-value">${teacher.phone || '-'}</span></div>
                <div class="detail-item detail-full"><span class="detail-label">Especialidad</span><span class="detail-value">${teacher.specialty}</span></div>
                <div class="detail-item"><span class="detail-label">Estado</span><span class="detail-value"><span class="badge-status ${statusClass}">${statusLabel}</span></span></div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="app.editTeacher('${teacher.id}'); closeModal();">Editar</button>
                <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
            </div>
        `;
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('teacherDetailModal').style.display = 'block';
    }

    openTeacherModal(teacherId = null) {
        const modal = document.getElementById('teacherModal');
        const form = document.getElementById('teacherForm');
        const title = document.getElementById('teacherModalTitle');

        form.reset();

        if (teacherId) {
            title.textContent = 'Editar Docente';
            const teacher = DataManager.getTeacherById(teacherId);
            if (teacher) {
                document.getElementById('teacherCode').value = teacher.code;
                document.getElementById('teacherDNI').value = teacher.dni;
                document.getElementById('teacherFirstNames').value = teacher.firstName;
                document.getElementById('teacherLastNames').value = teacher.lastName;
                document.getElementById('teacherEmail').value = teacher.email;
                document.getElementById('teacherPhone').value = teacher.phone;
                document.getElementById('teacherSpecialty').value = teacher.specialty;
                document.getElementById('teacherStatus').value = teacher.status;
            }
        } else {
            title.textContent = 'Nuevo Docente';
        }

        document.getElementById('modalOverlay').style.display = 'block';
        modal.style.display = 'block';
        form.onsubmit = (e) => this.handleTeacherSubmit(e, teacherId);
    }

    handleTeacherSubmit(e, teacherId) {
        e.preventDefault();
        const data = {
            code: document.getElementById('teacherCode').value.trim(),
            dni: document.getElementById('teacherDNI').value.trim(),
            firstName: document.getElementById('teacherFirstNames').value.trim(),
            lastName: document.getElementById('teacherLastNames').value.trim(),
            email: document.getElementById('teacherEmail').value.trim(),
            phone: document.getElementById('teacherPhone').value.trim(),
            specialty: document.getElementById('teacherSpecialty').value.trim(),
            status: document.getElementById('teacherStatus').value
        };

        if (!this.validateTeacherData(data)) return;

        if (teacherId) {
            const teacher = DataManager.getTeacherById(teacherId);
            if (teacher) {
                Object.assign(teacher, data);
                this.showToast('Docente actualizado correctamente', 'success');
            }
        } else {
            DataManager.addTeacher(data);
            this.showToast('Docente registrado correctamente', 'success');
        }
        this.closeModal();
        this.loadTeachers();
    }

    validateTeacherData(data) {
        if (!data.code) {
            this.showToast('El código del docente es obligatorio', 'error');
            return false;
        }
        if (!data.dni || data.dni.length !== 8 || isNaN(data.dni)) {
            this.showToast('El DNI debe tener 8 dígitos numéricos', 'error');
            return false;
        }
        if (!data.firstName || !data.lastName) {
            this.showToast('Nombres y apellidos son obligatorios', 'error');
            return false;
        }
        if (!data.specialty) {
            this.showToast('La especialidad es obligatoria', 'error');
            return false;
        }
        if (data.email && !this.validateEmail(data.email)) {
            this.showToast('Correo electrónico no válido', 'error');
            return false;
        }
        return true;
    }

    deleteTeacher(teacherId) {
        if (confirm('¿Desactivar este docente?')) {
            const teacher = DataManager.getTeacherById(teacherId);
            if (teacher) {
                teacher.status = 'inactive';
                this.showToast('Docente desactivado correctamente', 'success');
                this.loadTeachers();
            }
        }
    }

    // ========== GROUPS MODULE ==========
    loadGroups() {
        const groups = DataManager.getGroups();
        this.renderGroupsTable(groups);
        this.setupGroupFilters();
    }

    renderGroupsTable(groups) {
        const tbody = document.getElementById('groupsTableBody');
        tbody.innerHTML = '';

        // Mapas de estado: clave interna -> etiqueta en español + clase CSS
        const statusMap = {
            'open':       { label: 'Abierto',   css: 'badge-open' },
            'inprogress': { label: 'En curso',  css: 'badge-inprogress' },
            'finished':   { label: 'Terminado', css: 'badge-finished' },
            'closed':     { label: 'Cerrado',   css: 'badge-closed' }
        };

        groups.forEach(group => {
            const enrolledCount = DataManager.getEnrollments(group.id).length;
            const statusInfo = statusMap[group.status] || { label: group.status, css: 'badge-pending' };
            const modalityLabel = group.modality === 'regular' ? 'Curso regular' : 'Examen suficiencia';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${group.code}</td>
                <td>${group.courseName}</td>
                <td>${group.teacherName}</td>
                <td>${modalityLabel}</td>
                <td>${group.startDate}</td>
                <td>${group.endDate}</td>
                <td>${group.hours}</td>
                <td>${enrolledCount}/${group.maxQuota}</td>
                <td><span class="badge-status ${statusInfo.css}">${statusInfo.label}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewGroupDetails('${group.id}')" title="Ver detalle">&#128269;</button>
                        <button class="icon-btn icon-edit" onclick="app.editGroup('${group.id}')" title="Editar">&#9998;</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    setupGroupFilters() {
        const statusFilter = document.getElementById('groupStatusFilter');
        const modalityFilter = document.getElementById('groupModalityFilter');
        const searchInput = document.getElementById('groupSearch');

        const applyFilters = () => {
            let groups = DataManager.getGroups();
            
            if (searchInput.value) {
                const query = searchInput.value.toLowerCase();
                groups = groups.filter(g => 
                    g.code.toLowerCase().includes(query) || 
                    g.courseName.toLowerCase().includes(query)
                );
            }

            if (statusFilter.value) {
                groups = groups.filter(g => g.status === statusFilter.value);
            }

            if (modalityFilter.value) {
                groups = groups.filter(g => g.modality === modalityFilter.value);
            }

            this.renderGroupsTable(groups);
        };

        searchInput.addEventListener('input', applyFilters);
        statusFilter.addEventListener('change', applyFilters);
        modalityFilter.addEventListener('change', applyFilters);
    }

    viewGroupDetails(groupId) {
        const group = DataManager.getGroupById(groupId);
        const enrolledCount = DataManager.getEnrollments(groupId).length;
        
        if (group) {
            alert(`Grupo: ${group.code}\nCurso: ${group.courseName}\nDocente: ${group.teacherName}\nMatriculados: ${enrolledCount}/${group.maxQuota}\nEstado: ${group.status}`);
        }
    }

    editGroup(groupId) {
        alert('Editar grupo - ID: ' + groupId);
    }

    openGroupModal() {
        alert('Crear nuevo grupo académico - Modal no implementado en esta versión demo');
    }

    // ========== ENROLLMENTS MODULE ==========
    setupEnrollments() {
        const groupSelect = document.getElementById('enrollmentGroupSelect');
        const groups = DataManager.getGroups();

        groupSelect.innerHTML = '<option value="">-- Seleccione un grupo --</option>';
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = `${group.code} - ${group.courseName}`;
            groupSelect.appendChild(option);
        });

        groupSelect.addEventListener('change', () => this.loadEnrollmentGroup(groupSelect.value));
    }

    loadEnrollmentGroup(groupId) {
        const contentDiv = document.getElementById('enrollmentContent');
        if (!groupId) {
            contentDiv.style.display = 'none';
            return;
        }

        const group = DataManager.getGroupById(groupId);
        if (!group) return;

        contentDiv.style.display = 'block';

        // Show group info
        const infoDiv = document.getElementById('enrollmentGroupInfo');
        infoDiv.innerHTML = `
            <p><strong>Grupo:</strong> ${group.code}</p>
            <p><strong>Curso:</strong> ${group.courseName}</p>
            <p><strong>Docente:</strong> ${group.teacherName}</p>
            <p><strong>Modalidad:</strong> ${group.modality === 'regular' ? 'Curso regular' : 'Examen de suficiencia'}</p>
            <p><strong>Cupo:</strong> ${group.maxQuota} estudiantes</p>
        `;

        // Load available students
        const enrolledIds = DataManager.getEnrollments(groupId).map(e => e.studentId);
        let availableStudents = DataManager.getStudents().filter(s => !enrolledIds.includes(s.id) && s.status === 'active');

        this.renderAvailableStudents(availableStudents, groupId);
        this.renderEnrolledStudents(groupId);

        // Search functionality
        const searchInput = document.getElementById('enrollmentStudentSearch');
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            let filtered = DataManager.getStudents().filter(s => 
                !enrolledIds.includes(s.id) &&
                (s.code.includes(query) || s.dni.includes(query) || s.firstName.toLowerCase().includes(query))
            );
            this.renderAvailableStudents(filtered, groupId);
        });
    }

    renderAvailableStudents(students, groupId) {
        const tbody = document.getElementById('availableStudentsBody');
        tbody.innerHTML = '';

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.code}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.dni}</td>
                <td>Ciclo ${student.cycle}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="app.addEnrollment('${groupId}', '${student.id}')">Agregar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderEnrolledStudents(groupId) {
        const enrollments = DataManager.getEnrollments(groupId);
        const enrolledStudents = enrollments.map(e => DataManager.getStudentById(e.studentId));
        const tbody = document.getElementById('enrolledStudentsBody');
        tbody.innerHTML = '';

        document.getElementById('enrolledCount').textContent = enrolledStudents.length;

        enrolledStudents.forEach(student => {
            if (!student) return;
            const enrollment = enrollments.find(e => e.studentId === student.id);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.code}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.dni}</td>
                <td>${enrollment.enrollmentDate}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="app.removeEnrollment('${enrollment.id}', '${groupId}')">Remover</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    addEnrollment(groupId, studentId) {
        const result = DataManager.addEnrollment(groupId, studentId);
        if (result) {
            this.showToast('Alumno matriculado correctamente', 'success');
            this.loadEnrollmentGroup(groupId);
        } else {
            this.showToast('El alumno ya está matriculado en este grupo', 'error');
        }
    }

    removeEnrollment(enrollmentId, groupId) {
        if (confirm('¿Remover este alumno del grupo?')) {
            DataManager.removeEnrollment(enrollmentId);
            this.showToast('Alumno removido del grupo', 'success');
            this.loadEnrollmentGroup(groupId);
        }
    }

    // ========== ATTENDANCE MODULE ==========
    setupAttendance() {
        const groupSelect = document.getElementById('attendanceGroupSelect');
        const dateSelect = document.getElementById('attendanceDateSelect');
        const groups = DataManager.getGroups();

        groupSelect.innerHTML = '<option value="">-- Seleccione un grupo --</option>';
        groups.forEach(group => {
            if (group.modality === 'regular') {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = `${group.code} - ${group.courseName}`;
                groupSelect.appendChild(option);
            }
        });

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        dateSelect.value = today;

        const loadAttendance = () => {
            const groupId = groupSelect.value;
            const date = dateSelect.value;
            
            if (!groupId || !date) {
                document.getElementById('attendanceContent').style.display = 'none';
                return;
            }

            this.loadAttendanceTable(groupId, date);
        };

        groupSelect.addEventListener('change', loadAttendance);
        dateSelect.addEventListener('change', loadAttendance);
    }

    loadAttendanceTable(groupId, date) {
        document.getElementById('attendanceContent').style.display = 'block';

        const group = DataManager.getGroupById(groupId);
        const students = DataManager.getStudentsByGroup(groupId);

        document.getElementById('attendanceInfo').textContent = `Grupo: ${group.code} - ${group.courseName} | Fecha: ${date}`;

        const tbody = document.getElementById('attendanceTableBody');
        tbody.innerHTML = '';

        let presentes = 0, tardanzas = 0, faltas = 0, justificados = 0;

        students.forEach(student => {
            const attendance = mockData.attendance.find(a => a.groupId === groupId && a.studentId === student.id && a.date === date);
            const status = attendance ? attendance.status : 'pending';
            const observation = attendance ? attendance.observation : '';

            if (status === 'present') presentes++;
            else if (status === 'late') tardanzas++;
            else if (status === 'absent') faltas++;
            else if (status === 'justified') justificados++;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.code}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td><input type="radio" name="attendance_${student.id}" value="present" ${status === 'present' ? 'checked' : ''}></td>
                <td><input type="radio" name="attendance_${student.id}" value="late" ${status === 'late' ? 'checked' : ''}></td>
                <td><input type="radio" name="attendance_${student.id}" value="absent" ${status === 'absent' ? 'checked' : ''}></td>
                <td><input type="radio" name="attendance_${student.id}" value="justified" ${status === 'justified' ? 'checked' : ''}></td>
                <td><input type="text" value="${observation}" data-student="${student.id}" class="attendance-observation" style="width: 100%; padding: 0.5rem;"></td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('summaryPresent').textContent = presentes;
        document.getElementById('summaryLate').textContent = tardanzas;
        document.getElementById('summaryAbsent').textContent = faltas;
        document.getElementById('summaryJustified').textContent = justificados;

        // Save button handler
        document.getElementById('saveAttendanceBtn').onclick = () => this.saveAttendance(groupId, date, students);
    }

    saveAttendance(groupId, date, students) {
        students.forEach(student => {
            const status = document.querySelector(`input[name="attendance_${student.id}"]:checked`)?.value || 'pending';
            const observation = document.querySelector(`.attendance-observation[data-student="${student.id}"]`)?.value || '';
            DataManager.addAttendance(groupId, student.id, date, status, observation);
        });

        this.showToast('Asistencia guardada correctamente', 'success');
    }

    // ========== GRADES MODULE ==========
    setupGrades() {
        const groupSelect = document.getElementById('gradesGroupSelect');
        const groups = DataManager.getGroups();

        groupSelect.innerHTML = '<option value="">-- Seleccione un grupo --</option>';
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = `${group.code} - ${group.courseName}`;
            groupSelect.appendChild(option);
        });

        groupSelect.addEventListener('change', () => this.loadGradesTable(groupSelect.value));
    }

    loadGradesTable(groupId) {
        const contentDiv = document.getElementById('gradesContent');
        if (!groupId) {
            contentDiv.style.display = 'none';
            return;
        }

        contentDiv.style.display = 'block';

        const group = DataManager.getGroupById(groupId);
        const course = DataManager.getCourseById(group.courseId);
        const students = DataManager.getStudentsByGroup(groupId);

        document.getElementById('gradesInfo').textContent = `Grupo: ${group.code} - Curso: ${group.courseName} | Docente: ${group.teacherName}`;

        // Build table headers
        const thead = document.getElementById('gradesTableHead');
        thead.innerHTML = '<tr>';
        thead.innerHTML += '<th>Código</th><th>Alumno</th>';
        
        course.modules.forEach(module => {
            thead.innerHTML += `<th>${module.name} (${module.percentage}%)</th>`;
        });

        thead.innerHTML += '<th>Promedio</th><th>Estado</th></tr>';

        // Build table body
        const tbody = document.getElementById('gradesTableBody');
        tbody.innerHTML = '';

        students.forEach(student => {
            const grade = mockData.grades.find(g => g.groupId === groupId && g.studentId === student.id);
            const moduleGrades = grade ? grade.moduleGrades : {};
            const average = DataManager.calculateAverage(moduleGrades, course);
            const isApproved = average >= 11;

            let row = `<tr><td>${student.code}</td><td>${student.firstName} ${student.lastName}</td>`;

            course.modules.forEach(module => {
                const gradeValue = moduleGrades[module.id] || '';
                row += `<td><input type="number" min="0" max="20" value="${gradeValue}" class="grade-input" data-student="${student.id}" data-module="${module.id}" style="width: 60px; padding: 0.3rem;"></td>`;
            });

            row += `<td><strong class="grade-average">${average || '-'}</strong></td>`;
            row += `<td><span class="badge-status ${isApproved ? 'badge-approved' : 'badge-rejected'}">${average ? (isApproved ? 'Aprobado' : 'Desaprobado') : '-'}</span></td>`;
            row += '</tr>';

            tbody.innerHTML += row;
        });

        // Update averages when grades change
        const gradeInputs = document.querySelectorAll('.grade-input');
        gradeInputs.forEach(input => {
            input.addEventListener('change', () => this.updateGradeAverage(groupId, course));
        });

        // Save button handler
        document.getElementById('saveGradesBtn').onclick = () => this.saveGrades(groupId, course, students);
    }

    updateGradeAverage(groupId, course) {
        const tbody = document.getElementById('gradesTableBody');
        const rows = tbody.querySelectorAll('tr');

        rows.forEach((row, index) => {
            const inputs = row.querySelectorAll('.grade-input');
            const moduleGrades = {};
            
            inputs.forEach((input, moduleIndex) => {
                const moduleId = input.getAttribute('data-module');
                moduleGrades[moduleId] = parseFloat(input.value) || 0;
            });

            const average = DataManager.calculateAverage(moduleGrades, course);
            const isApproved = average >= 11;

            const averageCell = row.querySelector('.grade-average');
            const statusCell = row.querySelector('.badge-status');

            averageCell.textContent = average.toFixed(2);
            statusCell.textContent = isApproved ? 'Aprobado' : 'Desaprobado';
            statusCell.className = `badge-status ${isApproved ? 'badge-approved' : 'badge-rejected'}`;
        });
    }

    saveGrades(groupId, course, students) {
        const tbody = document.getElementById('gradesTableBody');
        const rows = tbody.querySelectorAll('tr');

        rows.forEach((row, index) => {
            const student = students[index];
            const inputs = row.querySelectorAll('.grade-input');
            const moduleGrades = {};

            inputs.forEach(input => {
                const moduleId = input.getAttribute('data-module');
                const value = parseFloat(input.value);
                if (value < 0 || value > 20) {
                    this.showToast('Las notas deben estar entre 0 y 20', 'error');
                    return;
                }
                moduleGrades[moduleId] = value || 0;
            });

            DataManager.saveGrade(groupId, student.id, moduleGrades);
        });

        this.showToast('Notas guardadas correctamente', 'success');
    }

    // ========== CERTIFICATES MODULE ==========
    loadCertificates() {
        const tbody = document.getElementById('certificatesTableBody');
        tbody.innerHTML = '';

        // Get approved students with grades
        const approvedStudents = [];
        
        mockData.grades.forEach(gradeRecord => {
            const group = DataManager.getGroupById(gradeRecord.groupId);
            const student = DataManager.getStudentById(gradeRecord.studentId);
            const course = DataManager.getCourseById(group.courseId);
            
            if (!student || !course) return;

            const average = DataManager.calculateAverage(gradeRecord.moduleGrades, course);
            if (average >= 11) {
                const existingCert = mockData.certificates.find(c => c.studentId === student.id && c.groupId === gradeRecord.groupId);
                approvedStudents.push({
                    student: student,
                    group: group,
                    course: course,
                    average: average,
                    certificate: existingCert
                });
            }
        });

        approvedStudents.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.student.code}</td>
                <td>${item.student.firstName} ${item.student.lastName}</td>
                <td>${item.course.name}</td>
                <td>${item.group.modality === 'regular' ? 'Curso regular' : 'Examen'}</td>
                <td>${item.average.toFixed(2)}</td>
                <td>-</td>
                <td><span class="badge-status badge-approved">Aprobado</span></td>
                <td>${item.certificate ? new Date(item.certificate.issueDate).toLocaleDateString() : '-'}</td>
                <td>
                    ${item.certificate 
                        ? `<button class="btn btn-sm btn-primary" onclick="app.viewCertificate('${item.certificate.id}')">Ver</button>` 
                        : `<button class="btn btn-sm btn-primary" onclick="app.generateCertificate('${item.student.id}', '${item.group.id}')">Generar</button>`}
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    generateCertificate(studentId, groupId) {
        const certificate = DataManager.generateCertificate(studentId, groupId);
        this.showToast('Certificado generado correctamente', 'success');
        this.viewCertificate(certificate.id);
        this.loadCertificates();
    }

    viewCertificate(certificateId) {
        const cert = mockData.certificates.find(c => c.id === certificateId);
        if (!cert) return;

        const student = DataManager.getStudentById(cert.studentId);
        const group = DataManager.getGroupById(cert.groupId);
        const course = DataManager.getCourseById(group.courseId);

        const gradeRecord = mockData.grades.find(g => g.groupId === group.id && g.studentId === student.id);
        const average = DataManager.calculateAverage(gradeRecord?.moduleGrades || {}, course);

        const preview = document.getElementById('certificatePreview');
        preview.innerHTML = `
            <div style="text-align: center;">
                <div class="certificate-header">
                    <div class="certificate-institution">🎓</div>
                    <div class="certificate-institution">UNIVERSIDAD NACIONAL DE PIURA</div>
                    <div class="certificate-institution" style="font-size: 1rem; margin-top: 0.5rem;">Instituto de Informática</div>
                </div>

                <div class="certificate-title">CERTIFICADO DE ${group.modality === 'regular' ? 'APROBACIÓN DE CURSO' : 'EXAMEN DE SUFICIENCIA'}</div>

                <div class="certificate-content">
                    <p style="margin: 1rem 0;">Por este medio se certifica que:</p>
                    <div class="certificate-student">${student.firstName.toUpperCase()} ${student.lastName.toUpperCase()}</div>
                    <p style="margin: 1rem 0;">Identificado con DNI Nº ${student.dni}</p>
                    <p style="margin: 1rem 0;">Ha completado satisfactoriamente el curso de:</p>
                    <div style="font-size: 1.2rem; font-weight: bold; margin: 1rem 0; color: var(--color-primary);">${course.name}</div>
                    <p style="margin: 1rem 0;">
                        ${group.modality === 'regular' 
                            ? `Realizado desde el ${group.startDate} hasta el ${group.endDate}<br>con un total de ${group.hours} horas académicas` 
                            : `Modalidad: Examen de Suficiencia`}
                    </p>
                    <p style="margin: 1rem 0;">Calificación final: <strong>${average.toFixed(2)}</strong></p>
                </div>

                <div class="certificate-line"></div>
                <p style="margin: 1rem 0; font-size: 0.9rem;">Expedido en Piura, a los ${new Date().getDate()} días del mes de ${['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'][new Date().getMonth()]} de ${new Date().getFullYear()}</p>
                <p style="margin-top: 2rem; font-size: 0.85rem;">Código de Certificado: ${cert.code}</p>
            </div>
        `;

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('certificateModal').style.display = 'block';
    }

    openCertificateModal() {
        this.showToast('Seleccione un alumno aprobado en la tabla', 'info');
    }

    // ========== REPORTS MODULE ==========
    loadReports() {
        const reportTableBody = document.getElementById('reportTableBody');
        reportTableBody.innerHTML = '';

        const groups = DataManager.getGroups();

        groups.forEach(group => {
            const students = DataManager.getStudentsByGroup(group.id);
            const enrolledCount = students.length;
            
            let approved = 0, disapproved = 0, totalAverage = 0;

            students.forEach(student => {
                const gradeRecord = mockData.grades.find(g => g.groupId === group.id && g.studentId === student.id);
                const course = DataManager.getCourseById(group.courseId);
                if (gradeRecord && course) {
                    const average = DataManager.calculateAverage(gradeRecord.moduleGrades, course);
                    totalAverage += average;
                    if (average >= 11) {
                        approved++;
                    } else {
                        disapproved++;
                    }
                }
            });

            totalAverage = enrolledCount > 0 ? (totalAverage / enrolledCount).toFixed(2) : 0;
            const certCount = mockData.certificates.filter(c => c.groupId === group.id).length;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${group.courseName}</td>
                <td>${group.code}</td>
                <td>${group.teacherName}</td>
                <td>${enrolledCount}</td>
                <td><span style="color: #4caf50; font-weight: bold;">${approved}</span></td>
                <td><span style="color: #f44336; font-weight: bold;">${disapproved}</span></td>
                <td>${totalAverage}</td>
                <td>${certCount}</td>
            `;
            reportTableBody.appendChild(row);
        });
    }

    // ========== USERS MODULE ==========
    loadUsers() {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        const roleLabels = {
            'admin': 'Administrador',
            'secretary': 'Secretaria',
            'teacher': 'Docente',
            'coordinator': 'Coordinador'
        };

        mockData.users.forEach(user => {
            const statusLabel = user.status === 'active' ? 'Activo' : 'Inactivo';
            const statusClass = user.status === 'active' ? 'badge-active' : 'badge-inactive';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.fullName}</td>
                <td>
                    <span class="badge-status badge-active">
                        ${roleLabels[user.role] || user.role}
                    </span>
                </td>
                <td>${user.email}</td>
                <td><span class="badge-status ${statusClass}">${statusLabel}</span></td>
                <td>${user.lastLogin}</td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-edit" onclick="app.editUser('${user.id}')" title="Editar">&#9998;</button>
                        <button class="icon-btn icon-delete" onclick="app.deleteUser('${user.id}')" title="Desactivar">&#128683;</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editUser(userId) {
        alert('Editar usuario - ID: ' + userId);
    }

    deleteUser(userId) {
        if (confirm('¿Desactivar este usuario?')) {
            const user = mockData.users.find(u => u.id === userId);
            if (user) {
                user.status = 'inactive';
                this.showToast('Usuario desactivado correctamente', 'success');
                this.loadUsers();
            }
        }
    }

    openUserModal() {
        alert('Crear nuevo usuario - Modal no implementado en esta versión demo');
    }

    // ========== MODAL MANAGEMENT ==========
    closeModal() {
        document.getElementById('modalOverlay').style.display = 'none';
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    }

    // ========== UTILITIES ==========
    showToast(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        document.getElementById('toastMessage').textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// Initialize app
let app = new SAIIApp();
