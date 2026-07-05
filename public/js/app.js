// SAII - Sistema Administrativo - Main App
// ============================================

class SAIIApp {
    constructor() {
        this.currentView = 'dashboard';
        this.isDarkMode = localStorage.getItem('saii_darkMode') === 'true';
        
        // Restore user session from localStorage
        const storedUser = localStorage.getItem('saii_currentUser');
        if (storedUser) {
            try {
                DataManager.currentUser = JSON.parse(storedUser);
                mockData.currentUser = DataManager.currentUser;
            } catch (e) {
                console.error("Error restoring session", e);
            }
        }
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.setupLoginForm();
        
        // If user is already logged in, skip login screen
        if (DataManager.currentUser) {
            this.loginUser(DataManager.currentUser.role);
        } else {
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('appContainer').style.display = 'none';
        }
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
            this.showToast('Usuario, contraseña o rol incorrectos', 'error');
        }
    }

    loginUser(role) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        document.getElementById('currentUser').textContent = DataManager.currentUser.fullName || DataManager.currentUser.name;
        
        // Set selector value
        const simulatedRoleSelect = document.getElementById('simulatedRoleSelect');
        if (simulatedRoleSelect) {
            simulatedRoleSelect.value = role;
        }

        // Set role-based access
        this.setRolePermissions(role);
        
        // Load dashboard
        this.loadView('dashboard');
    }

    simulateRoleChange(role) {
        const matchingUser = mockData.users.find(u => u.role === role && u.status === 'active') || 
                             mockData.users.find(u => u.role === role);
        if (matchingUser) {
            let teacherId = null;
            if (role === 'teacher') {
                const teacher = mockData.teachers.find(t => t.email === matchingUser.email);
                teacherId = teacher ? teacher.id : null;
            }
            DataManager.currentUser = {
                id: matchingUser.id,
                username: matchingUser.username,
                fullName: matchingUser.fullName,
                role: matchingUser.role,
                email: matchingUser.email,
                teacherId: teacherId
            };
            mockData.currentUser = DataManager.currentUser;
            localStorage.setItem('saii_currentUser', JSON.stringify(DataManager.currentUser));
            
            document.getElementById('currentUser').textContent = DataManager.currentUser.fullName;
            this.setRolePermissions(role);
            
            // Reload current view or go to dashboard
            this.loadView('dashboard');
            this.showToast(`Simulando rol: ${role.toUpperCase()}`, 'success');
        } else {
            this.showToast('No se encontró un usuario con ese rol', 'error');
        }
    }

    setRolePermissions(role) {
        // Set role-based menu visibility
        const permissions = mockData.rolePermissions[role] || [];
        
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
        localStorage.removeItem('saii_currentUser');
        DataManager.currentUser = null;
        mockData.currentUser = null;
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

        // Certificates Row Selection Handler
        const certTableBody = document.getElementById('certificatesTableBody');
        if (certTableBody) {
            certTableBody.addEventListener('click', (e) => {
                if (DataManager.currentUser && DataManager.currentUser.role === 'dean') return;
                
                const row = e.target.closest('tr');
                if (!row) return;

                if (e.target.closest('.action-icons') || e.target.closest('button')) return;

                const status = row.getAttribute('data-status');
                if (status === 'Apto') {
                    const isSelected = row.classList.contains('selected-row');
                    
                    // Remove selection from all other rows
                    certTableBody.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
                    
                    const emitBtn = document.getElementById('emitCertBtn');
                    if (!isSelected) {
                        row.classList.add('selected-row');
                        if (emitBtn) emitBtn.removeAttribute('disabled');
                    } else {
                        if (emitBtn) emitBtn.setAttribute('disabled', 'true');
                    }
                }
            });
        }

        // Direct click handler for emitCertBtn
        const emitBtn = document.getElementById('emitCertBtn');
        if (emitBtn) {
            emitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCertificateModal();
            });
        }
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
        
        // Update sidebar active state
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
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
            case 'settings':
                this.loadSettings();
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

        if (groups.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:2rem; color:var(--color-text-secondary);">No se encontraron grupos</td></tr>';
            return;
        }

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
            const isClosed = group.status === 'closed';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${group.code}</td>
                <td>${group.courseName}</td>
                <td>${group.teacherName}</td>
                <td>${modalityLabel}</td>
                <td>${group.startDate || group.examDate || '-'}</td>
                <td>${group.endDate || '-'}</td>
                <td>${group.hours || group.examHours || '-'}</td>
                <td>${enrolledCount}/${group.maxQuota}</td>
                <td><span class="badge-status ${statusInfo.css}">${statusInfo.label}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewGroupDetails('${group.id}')" title="Ver detalle">&#128269;</button>
                        <button class="icon-btn icon-edit" onclick="app.editGroup('${group.id}')" title="Editar" ${isClosed ? 'disabled style="opacity:0.4;cursor:not-allowed"' : ''}>&#9998;</button>
                        <button class="icon-btn icon-close" onclick="app.closeGroup('${group.id}')" title="Cerrar grupo" ${isClosed ? 'disabled style="opacity:0.4;cursor:not-allowed"' : ''}>&#128274;</button>
                        <button class="icon-btn icon-delete" onclick="app.deleteGroup('${group.id}')" title="Desactivar">&#128683;</button>
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
        if (!group) return;

        const enrolledCount = DataManager.getEnrollments(groupId).length;
        const statusMap = {
            'open': { label: 'Abierto', css: 'badge-open' },
            'inprogress': { label: 'En curso', css: 'badge-inprogress' },
            'finished': { label: 'Terminado', css: 'badge-finished' },
            'closed': { label: 'Cerrado', css: 'badge-closed' }
        };
        const statusInfo = statusMap[group.status] || { label: group.status, css: 'badge-pending' };
        const modalityLabel = group.modality === 'regular' ? 'Curso regular' : 'Examen de suficiencia';

        const isExam = group.modality === 'exam';
        const body = document.getElementById('groupDetailBody');
        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Código</span><span class="detail-value">${group.code}</span></div>
                <div class="detail-item"><span class="detail-label">Modalidad</span><span class="detail-value">${modalityLabel}</span></div>
                <div class="detail-item detail-full"><span class="detail-label">Curso</span><span class="detail-value">${group.courseName}</span></div>
                <div class="detail-item"><span class="detail-label">Docente</span><span class="detail-value">${group.teacherName}</span></div>
                <div class="detail-item"><span class="detail-label">Estado</span><span class="detail-value"><span class="badge-status ${statusInfo.css}">${statusInfo.label}</span></span></div>
                <div class="detail-item"><span class="detail-label">${isExam ? 'Fecha examen' : 'Fecha inicio'}</span><span class="detail-value">${group.startDate || group.examDate || '-'}</span></div>
                <div class="detail-item"><span class="detail-label">${isExam ? 'Hora examen' : 'Fecha fin'}</span><span class="detail-value">${isExam ? (group.examTime || '-') : (group.endDate || '-')}</span></div>
                <div class="detail-item"><span class="detail-label">Horas</span><span class="detail-value">${group.hours || group.examHours || '-'}</span></div>
                <div class="detail-item"><span class="detail-label">Cupo máximo</span><span class="detail-value">${group.maxQuota}</span></div>
                <div class="detail-item"><span class="detail-label">Matriculados</span><span class="detail-value">${enrolledCount} / ${group.maxQuota}</span></div>
                ${group.classroom ? `<div class="detail-item"><span class="detail-label">Aula / Lab.</span><span class="detail-value">${group.classroom}</span></div>` : ''}
                ${group.observations ? `<div class="detail-item detail-full"><span class="detail-label">Observaciones</span><span class="detail-value">${group.observations}</span></div>` : ''}
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="app.editGroup('${group.id}'); closeModal();">Editar</button>
                ${group.status !== 'closed' ? `<button class="btn btn-secondary" onclick="app.closeGroup('${group.id}'); closeModal();">Cerrar Grupo</button>` : ''}
                <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
            </div>
        `;
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('groupDetailModal').style.display = 'block';
    }

    editGroup(groupId) {
        this.openGroupModal(groupId);
    }

    openGroupModal(groupId = null) {
        const modal = document.getElementById('groupModal');
        const form = document.getElementById('groupForm');
        const title = document.getElementById('groupModalTitle');
        this._editingGroupId = groupId;

        form.reset();
        // Reset conditional sections
        document.getElementById('groupFieldsRegular').style.display = 'block';
        document.getElementById('groupFieldsExam').style.display = 'none';

        // Populate course select
        const courseSelect = document.getElementById('groupCourse');
        courseSelect.innerHTML = '<option value="">-- Seleccione un curso --</option>';
        DataManager.getCourses().forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            courseSelect.appendChild(opt);
        });

        // Populate teacher select
        const teacherSelect = document.getElementById('groupTeacher');
        teacherSelect.innerHTML = '<option value="">-- Seleccione un docente --</option>';
        DataManager.getTeachers().forEach(t => {
            if (t.status !== 'inactive') {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.textContent = `${t.firstName} ${t.lastName} (${t.specialty})`;
                teacherSelect.appendChild(opt);
            }
        });

        if (groupId) {
            title.textContent = 'Editar Grupo Académico';
            const group = DataManager.getGroupById(groupId);
            if (group) {
                document.getElementById('groupCode').value = group.code;
                document.getElementById('groupModality').value = group.modality;
                document.getElementById('groupCourse').value = group.courseId;
                document.getElementById('groupTeacher').value = group.teacherId;
                document.getElementById('groupStatus').value = group.status;
                document.getElementById('groupClassroom').value = group.classroom || '';
                document.getElementById('groupObservations').value = group.observations || '';

                if (group.modality === 'regular') {
                    document.getElementById('groupFieldsRegular').style.display = 'block';
                    document.getElementById('groupFieldsExam').style.display = 'none';
                    document.getElementById('groupStartDate').value = group.startDate || '';
                    document.getElementById('groupEndDate').value = group.endDate || '';
                    document.getElementById('groupHours').value = group.hours || '';
                    document.getElementById('groupMaxQuota').value = group.maxQuota || '';
                } else {
                    document.getElementById('groupFieldsRegular').style.display = 'none';
                    document.getElementById('groupFieldsExam').style.display = 'block';
                    document.getElementById('groupExamDate').value = group.examDate || group.startDate || '';
                    document.getElementById('groupExamTime').value = group.examTime || '';
                    document.getElementById('groupExamHours').value = group.examHours || group.hours || '';
                    document.getElementById('groupExamMaxQuota').value = group.maxQuota || '';
                }
            }
        } else {
            title.textContent = 'Abrir Nuevo Grupo Académico';
        }

        document.getElementById('modalOverlay').style.display = 'block';
        modal.style.display = 'block';
        form.onsubmit = (e) => this.handleGroupSubmit(e);
    }

    onGroupModalityChange() {
        const modality = document.getElementById('groupModality').value;
        document.getElementById('groupFieldsRegular').style.display = modality === 'regular' ? 'block' : 'none';
        document.getElementById('groupFieldsExam').style.display = modality === 'exam' ? 'block' : 'none';
    }

    handleGroupSubmit(e) {
        e.preventDefault();
        const modality = document.getElementById('groupModality').value;
        const courseId = document.getElementById('groupCourse').value;
        const teacherId = document.getElementById('groupTeacher').value;
        const course = DataManager.getCourseById(courseId);
        const teacher = DataManager.getTeacherById(teacherId);

        const data = {
            code: document.getElementById('groupCode').value.trim(),
            modality: modality,
            courseId: courseId,
            courseName: course ? course.name : '',
            teacherId: teacherId,
            teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
            status: document.getElementById('groupStatus').value,
            classroom: document.getElementById('groupClassroom').value.trim(),
            observations: document.getElementById('groupObservations').value.trim()
        };

        if (modality === 'regular') {
            data.startDate = document.getElementById('groupStartDate').value;
            data.endDate = document.getElementById('groupEndDate').value;
            data.hours = parseInt(document.getElementById('groupHours').value) || 0;
            data.maxQuota = parseInt(document.getElementById('groupMaxQuota').value) || 0;
            data.examDate = null;
            data.examTime = null;
            data.examHours = null;
        } else {
            data.examDate = document.getElementById('groupExamDate').value;
            data.startDate = data.examDate;
            data.examTime = document.getElementById('groupExamTime').value;
            data.examHours = parseInt(document.getElementById('groupExamHours').value) || 0;
            data.hours = data.examHours;
            data.maxQuota = parseInt(document.getElementById('groupExamMaxQuota').value) || 0;
            data.endDate = data.examDate;
        }

        if (!this.validateGroupData(data)) return;

        const groupId = this._editingGroupId;
        if (groupId) {
            DataManager.updateGroup(groupId, data);
            this.showToast('Grupo actualizado correctamente', 'success');
        } else {
            DataManager.addGroup(data);
            this.showToast('Grupo creado correctamente', 'success');
        }
        this.closeModal();
        this.loadGroups();
    }

    validateGroupData(data) {
        if (!data.code) {
            this.showToast('El código del grupo es obligatorio', 'error');
            return false;
        }
        if (!data.modality) {
            this.showToast('Seleccione una modalidad', 'error');
            return false;
        }
        if (!data.courseId) {
            this.showToast('Seleccione un curso', 'error');
            return false;
        }
        if (!data.teacherId) {
            this.showToast('Seleccione un docente', 'error');
            return false;
        }
        if (!data.maxQuota || data.maxQuota < 1) {
            this.showToast('El cupo máximo debe ser mayor a cero', 'error');
            return false;
        }
        if (data.modality === 'regular') {
            if (!data.startDate) {
                this.showToast('La fecha de inicio es obligatoria', 'error');
                return false;
            }
            if (!data.endDate) {
                this.showToast('La fecha de fin es obligatoria', 'error');
                return false;
            }
            if (data.startDate > data.endDate) {
                this.showToast('La fecha de fin debe ser posterior a la de inicio', 'error');
                return false;
            }
        } else {
            if (!data.examDate) {
                this.showToast('La fecha del examen es obligatoria', 'error');
                return false;
            }
        }
        if (!data.status) {
            this.showToast('El estado es obligatorio', 'error');
            return false;
        }
        return true;
    }

    closeGroup(groupId) {
        if (confirm('¿Desea cerrar este grupo? Esta acción no se puede revertir desde el sistema.')) {
            DataManager.updateGroup(groupId, { status: 'closed' });
            this.showToast('Grupo cerrado correctamente', 'success');
            this.loadGroups();
        }
    }

    deleteGroup(groupId) {
        if (confirm('¿Desactivar este grupo académico?')) {
            DataManager.updateGroup(groupId, { status: 'closed' });
            this.showToast('Grupo desactivado', 'success');
            this.loadGroups();
        }
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

        const enrollments = DataManager.getEnrollments(groupId);
        const enrolledCount = enrollments.length;
        const available = group.maxQuota - enrolledCount;
        const modalityLabel = group.modality === 'regular' ? 'Curso regular' : 'Examen de suficiencia';

        const statusMap = {
            'open': 'Abierto', 'inprogress': 'En curso',
            'finished': 'Terminado', 'closed': 'Cerrado'
        };
        const statusLabel = statusMap[group.status] || group.status;

        // Show enhanced group summary card
        const infoDiv = document.getElementById('enrollmentGroupInfo');
        infoDiv.innerHTML = `
            <div class="enrollment-summary-grid">
                <div class="enrollment-summary-item">
                    <span class="enrollment-summary-label">Grupo</span>
                    <span class="enrollment-summary-value">${group.code}</span>
                </div>
                <div class="enrollment-summary-item">
                    <span class="enrollment-summary-label">Curso</span>
                    <span class="enrollment-summary-value">${group.courseName}</span>
                </div>
                <div class="enrollment-summary-item">
                    <span class="enrollment-summary-label">Docente</span>
                    <span class="enrollment-summary-value">${group.teacherName}</span>
                </div>
                <div class="enrollment-summary-item">
                    <span class="enrollment-summary-label">Modalidad</span>
                    <span class="enrollment-summary-value">${modalityLabel}</span>
                </div>
                <div class="enrollment-summary-item">
                    <span class="enrollment-summary-label">Cupo máximo</span>
                    <span class="enrollment-summary-value">${group.maxQuota}</span>
                </div>
                <div class="enrollment-summary-item">
                    <span class="enrollment-summary-label">Matriculados</span>
                    <span class="enrollment-summary-value" style="color: var(--color-primary); font-weight:700;">${enrolledCount}</span>
                </div>
                <div class="enrollment-summary-item">
                    <span class="enrollment-summary-label">Cupos disponibles</span>
                    <span class="enrollment-summary-value" style="color: ${available > 0 ? '#388e3c' : '#c62828'}; font-weight:700;">${available}</span>
                </div>
                <div class="enrollment-summary-item">
                    <span class="enrollment-summary-label">Estado</span>
                    <span class="enrollment-summary-value">${statusLabel}</span>
                </div>
            </div>
        `;

        // Update counter badge
        document.getElementById('enrolledCount').textContent = enrolledCount;
        document.getElementById('enrolledQuota').textContent = group.maxQuota;
        const badge = document.getElementById('enrolledAvailableBadge');
        badge.textContent = available > 0 ? `${available} disponibles` : 'Sin cupos';
        badge.className = 'enrollment-available-badge ' + (available > 0 ? 'badge-available' : 'badge-full');

        // Clear search
        const searchInput = document.getElementById('enrollmentStudentSearch');
        searchInput.value = '';
        document.getElementById('enrollmentSearchResults').style.display = 'none';

        this.renderEnrolledStudents(groupId);

        // Search functionality
        searchInput.oninput = () => {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) {
                document.getElementById('enrollmentSearchResults').style.display = 'none';
                return;
            }
            const enrolledIds = DataManager.getEnrollments(groupId).map(e => e.studentId);
            let filtered = DataManager.getStudents().filter(s =>
                s.status === 'active' &&
                !enrolledIds.includes(s.id) &&
                (s.code.includes(query) || s.dni.includes(query) ||
                 s.firstName.toLowerCase().includes(query) || s.lastName.toLowerCase().includes(query))
            ).slice(0, 5);
            this.renderAvailableStudents(filtered, groupId);
            document.getElementById('enrollmentSearchResults').style.display = filtered.length > 0 ? 'block' : 'none';
        };
    }

    renderAvailableStudents(students, groupId) {
        const tbody = document.getElementById('availableStudentsBody');
        tbody.innerHTML = '';

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 1rem; color:var(--color-text-secondary);">No se encontraron alumnos disponibles</td></tr>';
            return;
        }

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.code}</td>
                <td><strong>${student.firstName} ${student.lastName}</strong></td>
                <td>${student.dni}</td>
                <td>Ciclo ${student.cycle}</td>
                <td>Prom. ${student.promotion}</td>
                <td>
                    <button class="icon-btn icon-add" onclick="app.addEnrollment('${groupId}', '${student.id}')" title="Agregar al grupo">&#43;&#10003;</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderEnrolledStudents(groupId) {
        const enrollments = DataManager.getEnrollments(groupId);
        const tbody = document.getElementById('enrolledStudentsBody');
        tbody.innerHTML = '';

        const group = DataManager.getGroupById(groupId);
        const enrolledCount = enrollments.length;

        // Update counters
        document.getElementById('enrolledCount').textContent = enrolledCount;
        if (group) {
            document.getElementById('enrolledQuota').textContent = group.maxQuota;
            const available = group.maxQuota - enrolledCount;
            const badge = document.getElementById('enrolledAvailableBadge');
            badge.textContent = available > 0 ? `${available} disponibles` : 'Sin cupos';
            badge.className = 'enrollment-available-badge ' + (available > 0 ? 'badge-available' : 'badge-full');
        }

        if (enrollments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem; color:var(--color-text-secondary);">No hay alumnos matriculados en este grupo</td></tr>';
            return;
        }

        enrollments.forEach(enrollment => {
            const student = DataManager.getStudentById(enrollment.studentId);
            if (!student) return;
            const statusLabel = enrollment.status === 'active' ? 'Activo' : 'Retirado';
            const statusClass = enrollment.status === 'active' ? 'badge-active' : 'badge-inactive';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.code}</td>
                <td><strong>${student.firstName} ${student.lastName}</strong></td>
                <td>${student.dni}</td>
                <td>Ciclo ${student.cycle}</td>
                <td>Promoción ${student.promotion}</td>
                <td>${enrollment.enrollmentDate}</td>
                <td><span class="badge-status ${statusClass}">${statusLabel}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewEnrollmentDetail('${enrollment.id}', '${groupId}')" title="Ver matrícula">&#128269;</button>
                        <button class="icon-btn icon-edit" onclick="app.editEnrollmentStatus('${enrollment.id}', '${groupId}')" title="Editar estado">&#9998;</button>
                        <button class="icon-btn icon-delete" onclick="app.removeEnrollment('${enrollment.id}', '${groupId}')" title="Retirar alumno">&#128683;</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    viewEnrollmentDetail(enrollmentId, groupId) {
        const enrollment = DataManager.getEnrollments(groupId).find(e => e.id === enrollmentId);
        if (!enrollment) return;
        const student = DataManager.getStudentById(enrollment.studentId);
        const group = DataManager.getGroupById(groupId);
        if (!student || !group) return;

        const statusLabel = enrollment.status === 'active' ? 'Activo' : 'Retirado';
        const statusClass = enrollment.status === 'active' ? 'badge-active' : 'badge-inactive';
        const body = document.getElementById('studentDetailBody');
        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Código alumno</span><span class="detail-value">${student.code}</span></div>
                <div class="detail-item"><span class="detail-label">DNI</span><span class="detail-value">${student.dni}</span></div>
                <div class="detail-item detail-full"><span class="detail-label">Alumno</span><span class="detail-value">${student.firstName} ${student.lastName}</span></div>
                <div class="detail-item"><span class="detail-label">Ciclo</span><span class="detail-value">Ciclo ${student.cycle}</span></div>
                <div class="detail-item"><span class="detail-label">Promoción</span><span class="detail-value">Promoción ${student.promotion}</span></div>
                <div class="detail-item"><span class="detail-label">Grupo</span><span class="detail-value">${group.code}</span></div>
                <div class="detail-item"><span class="detail-label">Curso</span><span class="detail-value">${group.courseName}</span></div>
                <div class="detail-item"><span class="detail-label">Fecha de matrícula</span><span class="detail-value">${enrollment.enrollmentDate}</span></div>
                <div class="detail-item"><span class="detail-label">Estado</span><span class="detail-value"><span class="badge-status ${statusClass}">${statusLabel}</span></span></div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
            </div>
        `;
        const title = document.getElementById('studentDetailModal').querySelector('h2');
        if (title) title.textContent = 'Detalle de Matrícula';
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('studentDetailModal').style.display = 'block';
    }

    editEnrollmentStatus(enrollmentId, groupId) {
        const enrollment = DataManager.getEnrollments(groupId).find(e => e.id === enrollmentId);
        if (!enrollment) return;
        const student = DataManager.getStudentById(enrollment.studentId);
        const newStatus = enrollment.status === 'active' ? 'inactive' : 'active';
        const label = newStatus === 'active' ? 'reactivar' : 'suspender';
        if (confirm(`¿Desea ${label} la matrícula de ${student ? student.firstName + ' ' + student.lastName : 'este alumno'}?`)) {
            enrollment.status = newStatus;
            this.showToast(`Matrícula ${newStatus === 'active' ? 'reactivada' : 'suspendida'} correctamente`, 'success');
            this.renderEnrolledStudents(groupId);
        }
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

    // ========== ATTENDANCE MODULE — Control de Asistencia de Alumnos (Fase 5 CORREGIDA) ==========
    setupAttendance() {
        const adminView = document.getElementById('attendanceAdminView');
        const teacherView = document.getElementById('attendanceTeacherView');

        if (adminView) adminView.style.display = 'block';
        if (teacherView) teacherView.style.display = 'none';

        this.setupAdminAttendanceView();
    }

    setupAdminAttendanceView() {
        const teacherFilter = document.getElementById('attFilterTeacher');
        const groupFilter = document.getElementById('attFilterGroup');
        const role = DataManager.currentUser ? DataManager.currentUser.role : 'admin';
        const teacherId = DataManager.currentUser ? DataManager.currentUser.id : null;

        teacherFilter.innerHTML = '<option value="">Todos los docentes</option>';
        DataManager.getTeachers().forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.firstName} ${t.lastName}`;
            teacherFilter.appendChild(opt);
        });

        groupFilter.innerHTML = '<option value="">Todos los grupos</option>';
        DataManager.getGroups().forEach(g => {
            if (role === 'teacher' && teacherId && g.teacherId !== teacherId && teacherId !== 'USR999') return;
            const opt = document.createElement('option');
            opt.value = g.id;
            opt.textContent = `${g.code} – ${g.courseName}`;
            groupFilter.appendChild(opt);
        });

        // Hide teacher filter for teachers
        const teacherFilterDiv = teacherFilter.parentElement;
        if (role === 'teacher') {
            teacherFilter.value = teacherId;
            teacherFilter.style.display = 'none';
            if (teacherFilterDiv && teacherFilterDiv.classList.contains('control-group')) {
                teacherFilterDiv.style.display = 'none';
            }
        } else {
            teacherFilter.style.display = 'inline-block';
            if (teacherFilterDiv && teacherFilterDiv.classList.contains('control-group')) {
                teacherFilterDiv.style.display = 'flex';
            }
        }

        // Hide date filter (not used in group-level view)
        const dateFilter = document.getElementById('attFilterDate');
        if (dateFilter) dateFilter.style.display = 'none';

        this.renderAdminAttendanceTable();

        const apply = () => this.renderAdminAttendanceTable();
        teacherFilter.onchange = apply;
        groupFilter.onchange = apply;
        document.getElementById('attFilterModality').onchange = apply;
        document.getElementById('attFilterStatus').onchange = apply;
    }

    renderAdminAttendanceTable() {
        const tbody = document.getElementById('attendanceAdminBody');
        tbody.innerHTML = '';

        const role = DataManager.currentUser ? DataManager.currentUser.role : 'admin';
        const teacherId = DataManager.currentUser ? DataManager.currentUser.id : null;

        const teacherFilter = document.getElementById('attFilterTeacher').value;
        const groupFilter = document.getElementById('attFilterGroup').value;
        const modalityFilter = document.getElementById('attFilterModality').value;
        const statusFilter = document.getElementById('attFilterStatus').value;

        const statusMap = {
            borrador:   { label: 'Borrador',   css: 'badge-pending' },
            cerrado:    { label: 'Cerrado',    css: 'badge-closed' }
        };

        let listas = DataManager.getAllStudentAttendance();

        // Filtrado por rol del docente
        if (role === 'teacher' && teacherId && teacherId !== 'USR999') {
            listas = listas.filter(l => l.teacherId === teacherId);
        } else if (teacherFilter) {
            listas = listas.filter(l => l.teacherId === teacherFilter);
        }

        if (groupFilter)    listas = listas.filter(l => l.groupId === groupFilter);
        if (statusFilter)   listas = listas.filter(l => l.status === statusFilter);
        if (modalityFilter) {
            listas = listas.filter(l => {
                const g = DataManager.getGroupById(l.groupId);
                return g && g.modality === modalityFilter;
            });
        }

        if (listas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--color-text-secondary);">No se encontraron asistencias</td></tr>';
            return;
        }

        listas.forEach(lista => {
            const group = DataManager.getGroupById(lista.groupId);
            if (!group) return;
            const statusInfo = statusMap[lista.status] || { label: lista.status, css: 'badge-pending' };
            const modalityLabel = group.modality === 'regular' ? 'Curso regular' : 'Exam. suficiencia';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${lista.id}</strong></td>
                <td><strong>${group.code}</strong><br><small>${group.courseName}</small></td>
                <td>${group.teacherName}</td>
                <td>${modalityLabel}</td>
                <td><span class="badge-status ${statusInfo.css}">${statusInfo.label}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewAttendanceDetail('${lista.id}')" title="Ver / editar detalle">&#128269;</button>
                        ${lista.status !== 'cerrado' && (role === 'admin' || role === 'teacher') ? `<button class="icon-btn icon-save" onclick="app.closeAttendance('${lista.id}')" title="Cerrar asistencia">&#128274;</button>` : ''}
                        <button class="icon-btn icon-view" onclick="app.printAttendance('${lista.id}')" title="Imprimir">&#128424;</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    viewAttendanceDetail(attendanceId) {
        const lista = DataManager.getStudentAttendanceById(attendanceId);
        if (!lista) return;
        const group = DataManager.getGroupById(lista.groupId);
        if (!group) return;

        const role = DataManager.currentUser ? DataManager.currentUser.role : 'admin';
        const canEdit = lista.status !== 'cerrado' && (role === 'admin' || role === 'teacher');
        const statusMap = { borrador: 'Borrador', cerrado: 'Cerrado' };
        const modalityLabel = group.modality === 'regular' ? 'Curso regular' : 'Examen de suficiencia';

        // Columnas de cabecera (Fechas)
        let headerCols = '<th class="attendance-code-cell">Código</th><th class="attendance-student-cell">Alumno</th>';
        lista.days.forEach(d => {
            headerCols += `<th class="attendance-day-cell">${d}</th>`;
        });

        // Filas de alumnos
        let studentRows = '';
        lista.students.forEach(s => {
            const student = DataManager.getStudentById(s.studentId);
            if (!student) return;

            let rowHtml = `<tr>
                <td class="attendance-code-cell">${student.code}</td>
                <td class="attendance-student-cell"><strong>${student.firstName} ${student.lastName}</strong></td>
            `;

            lista.days.forEach(d => {
                const currentVal = s.attendance[d] || '';
                
                const options = [
                    { value: '', label: '--' },
                    { value: 'presente', label: 'Presente' },
                    { value: 'falta', label: 'Falta' },
                    { value: 'justificado', label: 'Justificado' }
                ];
                
                let selectHtml = `<select class="attendance-status-select" ${!canEdit ? 'disabled' : ''} onchange="app.onMatrixStatusChange('${lista.id}', '${s.studentId}', '${d}', this.value)">`;
                options.forEach(opt => {
                    selectHtml += `<option value="${opt.value}" ${currentVal === opt.value ? 'selected' : ''}>${opt.label}</option>`;
                });
                selectHtml += `</select>`;

                rowHtml += `<td class="attendance-day-cell">${selectHtml}</td>`;
            });

            rowHtml += `</tr>`;
            studentRows += rowHtml;
        });

        const body = document.getElementById('attendanceDetailBody');
        body.innerHTML = `
            <div class="att-planilla-header" style="margin-bottom: 0.5rem; padding: 0.5rem 1rem; background: var(--color-bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <div class="att-institution-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 0.3rem; margin-bottom: 0.5rem;">
                    <div style="text-align: left;">
                        <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-text-primary);">Universidad Nacional de Piura</span>
                        <span style="font-size: 0.8rem; color: var(--color-text-secondary); margin-left: 0.5rem;">| Facultad de Ingeniería Industrial</span>
                    </div>
                    <div style="text-align: right; font-weight: bold; color: var(--color-primary); font-size: 0.85rem;">
                        Instituto de Informática
                    </div>
                </div>
                <div style="text-align: center; margin-bottom: 0.4rem;">
                    <h3 style="margin: 0; font-size: 1rem; font-weight: bold; letter-spacing: 0.5px; color: var(--color-text-primary);">CONTROL DE ASISTENCIA DE ALUMNOS</h3>
                </div>
                <div class="att-planilla-meta-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; font-size: 0.82rem;">
                    <div class="att-meta-item"><strong>ID Asistencia:</strong> <span>${lista.id}</span></div>
                    <div class="att-meta-item"><strong>Grupo:</strong> <span>${group.code}</span></div>
                    <div class="att-meta-item"><strong>Curso:</strong> <span>${group.courseName}</span></div>
                    <div class="att-meta-item"><strong>Docente:</strong> <span>${group.teacherName}</span></div>
                    <div class="att-meta-item"><strong>Modalidad:</strong> <span>${modalityLabel}</span></div>
                    <div class="att-meta-item"><strong>Estado:</strong> <span class="badge-status ${lista.status === 'cerrado' ? 'badge-closed' : 'badge-pending'}" style="padding: 0.1rem 0.4rem; font-size: 0.75rem;">${statusMap[lista.status] || lista.status}</span></div>
                </div>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <span class="enrollment-table-title" style="font-weight:600;">&#128101; Matriz de Asistencia</span>
                <button class="btn btn-secondary btn-sm" id="btnToggleFullscreen" onclick="app.toggleDetailFullscreen()">
                    &#128470; Expandir
                </button>
            </div>

            <div class="att-matrix-wrapper">
                <div class="att-matrix-scroll">
                    <table class="data-table">
                        <thead>
                            <tr>${headerCols}</tr>
                        </thead>
                        <tbody>
                            ${studentRows}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="modal-actions" style="margin-top:1rem; display:flex; justify-content:flex-end; gap:0.5rem;">
                ${canEdit ? `<button class="btn btn-primary" onclick="app.closeModal(); app.showToast('Borrador guardado', 'success');">Guardar</button>` : ''}
                <button class="btn btn-secondary" onclick="app.closeModal()">Cerrar</button>
            </div>
        `;

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('attendanceDetailModal').style.display = 'flex';
    }

    onMatrixStatusChange(attendanceId, studentId, date, value) {
        DataManager.updateStudentAttendanceRecord(attendanceId, studentId, date, value);
    }

    toggleDetailFullscreen() {
        const modal = document.getElementById('attendanceDetailModal');
        const btn = document.getElementById('btnToggleFullscreen');
        if (modal) {
            modal.classList.toggle('modal-fullscreen');
            if (modal.classList.contains('modal-fullscreen')) {
                btn.innerHTML = '&#128471; Minimizar';
            } else {
                btn.innerHTML = '&#128470; Expandir';
            }
        }
    }

    closeAttendance(attendanceId) {
        const lista = DataManager.getStudentAttendanceById(attendanceId);
        if (!lista) return;

        let complete = true;
        lista.students.forEach(s => {
            lista.days.forEach(d => {
                const status = s.attendance[d];
                if (!status || (status !== 'presente' && status !== 'falta' && status !== 'justificado')) {
                    complete = false;
                }
            });
        });

        if (!complete) {
            this.showToast('Complete la asistencia de todos los alumnos en todos los días antes de cerrar', 'error');
            return;
        }

        if (confirm('¿Cerrar esta asistencia? Una vez cerrada ya no podrá ser editada.')) {
            DataManager.updateStudentAttendanceStatus(attendanceId, 'cerrado');
            this.showToast('Asistencia cerrada correctamente', 'success');
            this.renderAdminAttendanceTable();
        }
    }

    printAttendance(attendanceId) {
        this.viewAttendanceDetail(attendanceId);
        this.showToast('Detalle abierto para impresión simulada. Use Ctrl+P para imprimir.', 'info');
    }



    // --- VISTA ADMINISTRADOR (DOCENTE) ---
    setupAdminAttendanceDocenteView() {
        // Populate teacher filter
        const teacherFilter = document.getElementById('attFilterTeacher');
        teacherFilter.innerHTML = '<option value="">Todos los docentes</option>';
        DataManager.getTeachers().forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.firstName} ${t.lastName}`;
            teacherFilter.appendChild(opt);
        });

        this.renderAdminAttendanceDocenteTable();

        const apply = () => this.renderAdminAttendanceDocenteTable();
        teacherFilter.onchange = apply;
        document.getElementById('attFilterModality').onchange = apply;
        document.getElementById('attFilterStatus').onchange = apply;
    }

    renderAdminAttendanceDocenteTable() {
        const tbody = document.getElementById('attendanceAdminBody');
        tbody.innerHTML = '';

        const teacherFilter = document.getElementById('attFilterTeacher').value;
        const modalityFilter = document.getElementById('attFilterModality').value;
        const statusFilter = document.getElementById('attFilterStatus').value;

        const statusMap = {
            borrador:  { label: 'Borrador',  css: 'badge-pending' },
            enviado:   { label: 'Enviado',   css: 'badge-inprogress' },
            validado:  { label: 'Validado',  css: 'badge-active' },
            observado: { label: 'Observado', css: 'badge-open' },
            cerrado:   { label: 'Cerrado',   css: 'badge-closed' }
        };

        let planillas = DataManager.getAllTeacherAttendance();

        if (teacherFilter) planillas = planillas.filter(p => p.teacherId === teacherFilter);
        if (statusFilter)  planillas = planillas.filter(p => p.status === statusFilter);
        if (modalityFilter) {
            planillas = planillas.filter(p => {
                const g = DataManager.getGroupById(p.groupId);
                return g && g.modality === modalityFilter;
            });
        }

        if (planillas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--color-text-secondary);">No se encontraron planillas</td></tr>';
            return;
        }

        planillas.forEach(planilla => {
            const group = DataManager.getGroupById(planilla.groupId);
            if (!group) return;
            const statusInfo = statusMap[planilla.status] || { label: planilla.status, css: 'badge-pending' };
            const modalityLabel = group.modality === 'regular' ? 'Curso regular' : 'Examen suficiencia';
            const periodo = group.modality === 'exam' ? group.startDate : `${group.startDate} – ${group.endDate}`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${group.teacherName}</td>
                <td><strong>${group.code}</strong><br><small>${group.courseName}</small></td>
                <td>${modalityLabel}</td>
                <td>${periodo}</td>
                <td><strong>${planilla.totalHoursDictated} h</strong></td>
                <td>${group.hours} h</td>
                <td><span class="badge-status ${statusInfo.css}">${statusInfo.label}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewPlanillaDetail('${planilla.id}')" title="Ver detalle">&#128269;</button>
                        ${planilla.status === 'enviado' ? `<button class="icon-btn icon-save" onclick="app.validatePlanilla('${planilla.id}')" title="Validar">&#10003;</button>` : ''}
                        ${(planilla.status === 'enviado' || planilla.status === 'validado') ? `<button class="icon-btn icon-edit" onclick="app.observePlanilla('${planilla.id}')" title="Observar">&#128172;</button>` : ''}
                        ${planilla.status !== 'cerrado' ? `<button class="icon-btn icon-close" onclick="app.closePlanilla('${planilla.id}')" title="Cerrar planilla">&#128274;</button>` : ''}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    viewPlanillaDetail(planillaId) {
        const planilla = DataManager.getAllTeacherAttendance().find(p => p.id === planillaId);
        if (!planilla) return;
        const group = DataManager.getGroupById(planilla.groupId);
        if (!group) return;

        const statusMap = { borrador: 'Borrador', enviado: 'Enviado', validado: 'Validado', observado: 'Observado', cerrado: 'Cerrado' };
        const isExam = group.modality === 'exam';
        const modalityLabel = isExam ? 'Examen de suficiencia' : 'Curso regular';

        let sessionsRows = '';
        planilla.sessions.forEach((s, i) => {
            const meet = s.meetLink ? `<a href="${s.meetLink}" target="_blank" style="color:var(--color-primary);">Enlace</a>` : '-';
            sessionsRows += `<tr>
                <td>${i+1}</td><td>${s.date}</td><td>${s.entryTime}</td><td>${s.exitTime}</td>
                <td><strong>${s.totalHours} h</strong></td><td>${meet}</td><td>${s.observation || '-'}</td>
            </tr>`;
        });

        const body = document.getElementById('planillaDetailBody');
        body.innerHTML = `
            <div class="att-planilla-header" style="margin-bottom:var(--spacing-lg);">
                <div class="att-institution-header">
                    <p class="att-inst-line">Universidad Nacional de Piura</p>
                    <p class="att-inst-line">Facultad de Ingeniería Industrial</p>
                    <p class="att-inst-line att-inst-bold">Instituto de Informática</p>
                    <p class="att-format-title">CONTROL DE ASISTENCIA DOCENTE</p>
                </div>
                <div class="att-planilla-meta-grid">
                    <div class="att-meta-item"><span class="att-meta-label">Modalidad</span><span>${modalityLabel}</span></div>
                    <div class="att-meta-item"><span class="att-meta-label">${isExam ? 'Curso evaluado' : 'Curso'}</span><span>${group.courseName}</span></div>
                    <div class="att-meta-item"><span class="att-meta-label">${isExam ? 'Docente / Evaluador' : 'Docente'}</span><span>${group.teacherName}</span></div>
                    <div class="att-meta-item"><span class="att-meta-label">Horario</span><span>${group.schedule || '-'}</span></div>
                    <div class="att-meta-item"><span class="att-meta-label">${isExam ? 'Fecha del examen' : 'Fecha inicio'}</span><span>${group.startDate}</span></div>
                    ${!isExam ? `<div class="att-meta-item"><span class="att-meta-label">Fecha final</span><span>${group.endDate}</span></div>` : ''}
                    <div class="att-meta-item"><span class="att-meta-label">Duración total</span><span>${group.hours} horas</span></div>
                    <div class="att-meta-item"><span class="att-meta-label">Estado planilla</span><span><strong>${statusMap[planilla.status] || planilla.status}</strong></span></div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr><th>#</th><th>Fecha</th><th>Hora entrada</th><th>Hora salida</th><th>Total horas</th><th>Meet</th><th>Observación</th></tr></thead>
                    <tbody>${sessionsRows}</tbody>
                    <tfoot><tr class="att-total-row"><td colspan="4"><strong>TOTAL HORAS DICTADAS</strong></td><td><strong>${planilla.totalHoursDictated} h</strong></td><td colspan="2"></td></tr></tfoot>
                </table>
            </div>
            ${planilla.adminObservation ? `<div class="att-obs-note"><strong>Observación del administrador:</strong> ${planilla.adminObservation}</div>` : ''}
            <div class="modal-actions"><button class="btn btn-secondary" onclick="closeModal()">Cerrar</button></div>
        `;
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('planillaDetailModal').style.display = 'block';
    }

    validatePlanilla(planillaId) {
        if (confirm('¿Validar esta planilla de asistencia docente?')) {
            DataManager.updateTeacherAttendanceStatus(planillaId, 'validado');
            this.showToast('Planilla validada correctamente', 'success');
            this.renderAdminAttendanceDocenteTable();
        }
    }

    observePlanilla(planillaId) {
        document.getElementById('adminObsText').value = '';
        document.getElementById('adminObsConfirmBtn').onclick = () => {
            const obs = document.getElementById('adminObsText').value.trim();
            if (!obs) { this.showToast('Ingrese una observación', 'error'); return; }
            DataManager.updateTeacherAttendanceStatus(planillaId, 'observado', obs);
            this.showToast('Observación enviada al docente', 'success');
            this.closeModal();
            this.renderAdminAttendanceDocenteTable();
        };
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('adminObsModal').style.display = 'block';
    }

    closePlanilla(planillaId) {
        if (confirm('¿Cerrar esta planilla? Ya no podrá ser editada.')) {
            DataManager.updateTeacherAttendanceStatus(planillaId, 'cerrado');
            this.showToast('Planilla cerrada', 'success');
            this.renderAdminAttendanceDocenteTable();
        }
    }

    // --- VISTA DOCENTE (DOCENTE) ---
    setupTeacherAttendanceDocenteView() {
        const teacherId = DataManager.currentUser ? DataManager.currentUser.id : null;
        const groupSelect = document.getElementById('attendanceGroupSelect');
        groupSelect.innerHTML = '<option value="">-- Seleccione --</option>';

        // Solo muestra grupos del docente
        DataManager.getGroups().forEach(g => {
            if (!teacherId || g.teacherId === teacherId || teacherId === 'USR999') {
                const opt = document.createElement('option');
                opt.value = g.id;
                opt.textContent = `${g.code} – ${g.courseName} (${g.modality === 'regular' ? 'Regular' : 'Suficiencia'})`;
                groupSelect.appendChild(opt);
            }
        });

        groupSelect.onchange = () => this.loadTeacherPlanilla(groupSelect.value);
    }

    loadTeacherPlanilla(groupId) {
        const content = document.getElementById('attendanceContent');
        if (!groupId) { content.style.display = 'none'; return; }

        const group = DataManager.getGroupById(groupId);
        if (!group) return;
        content.style.display = 'block';

        // Get or create planilla
        let planilla = DataManager.getTeacherAttendanceByGroup(groupId);
        if (!planilla) {
            if (!group.teacherId) { this.showToast('Este grupo no tiene docente asignado', 'error'); return; }
            planilla = DataManager.createTeacherAttendance(groupId, group.teacherId);
        }
        this._currentPlanillaId = planilla.id;
        this._currentGroupId = groupId;

        // Render institutional header
        this.renderPlanillaHeader(group, planilla);
        // Render status bar
        this.renderAttStatusBar(planilla, group);
        // Render sessions table
        this.renderSessionsTable(planilla);
        // Render action buttons
        this.renderPlanillaActions(planilla);
    }

    renderPlanillaHeader(group, planilla) {
        const isExam = group.modality === 'exam';
        document.getElementById('attPlanillaHeader').innerHTML = `
            <div class="att-institution-header">
                <p class="att-inst-line">Universidad Nacional de Piura</p>
                <p class="att-inst-line">Facultad de Ingeniería Industrial</p>
                <p class="att-inst-line att-inst-bold">Instituto de Informática</p>
                <p class="att-format-title">CONTROL DE ASISTENCIA DOCENTE</p>
            </div>
            <div class="att-planilla-meta-grid">
                <div class="att-meta-item"><span class="att-meta-label">Modalidad</span><span>${isExam ? 'Examen de suficiencia' : 'Curso regular'}</span></div>
                <div class="att-meta-item"><span class="att-meta-label">${isExam ? 'Curso evaluado' : 'Curso'}</span><span>${group.courseName}</span></div>
                <div class="att-meta-item"><span class="att-meta-label">${isExam ? 'Docente / Evaluador' : 'Docente'}</span><span>${group.teacherName}</span></div>
                <div class="att-meta-item"><span class="att-meta-label">Horario</span><span>${group.schedule || 'No especificado'}</span></div>
                ${isExam
                    ? `<div class="att-meta-item"><span class="att-meta-label">Fecha del examen</span><span>${group.startDate}</span></div>`
                    : `<div class="att-meta-item"><span class="att-meta-label">Fecha inicio</span><span>${group.startDate}</span></div>
                       <div class="att-meta-item"><span class="att-meta-label">Fecha final</span><span>${group.endDate}</span></div>`
                }
                <div class="att-meta-item"><span class="att-meta-label">Duración total prog.</span><span>${group.hours} horas</span></div>
            </div>
        `;
    }

    renderAttStatusBar(planilla, group) {
        const statusMap = {
            borrador:  { label: 'Borrador',  css: 'badge-pending' },
            enviado:   { label: 'Enviado',   css: 'badge-inprogress' },
            validado:  { label: 'Validado',  css: 'badge-active' },
            observado: { label: 'Observado', css: 'badge-open' },
            cerrado:   { label: 'Cerrado',   css: 'badge-closed' }
        };
        const statusInfo = statusMap[planilla.status] || { label: planilla.status, css: 'badge-pending' };
        const progPct = group.hours > 0 ? Math.min(100, Math.round(planilla.totalHoursDictated / group.hours * 100)) : 0;

        document.getElementById('attStatusBar').innerHTML = `
            <div class="att-status-item">
                <span class="att-status-label">Estado de planilla</span>
                <span class="badge-status ${statusInfo.css}">${statusInfo.label}</span>
            </div>
            <div class="att-status-item">
                <span class="att-status-label">Horas dictadas</span>
                <strong style="color:var(--color-primary);">${planilla.totalHoursDictated} h</strong>
            </div>
            <div class="att-status-item">
                <span class="att-status-label">Horas programadas</span>
                <strong>${group.hours} h</strong>
            </div>
            <div class="att-status-item">
                <span class="att-status-label">Avance</span>
                <strong style="color:${progPct >= 100 ? '#388e3c' : 'var(--color-primary)'};">${progPct}%</strong>
            </div>
            ${planilla.adminObservation ? `<div class="att-obs-note att-obs-inline"><strong>Obs. admin:</strong> ${planilla.adminObservation}</div>` : ''}
        `;
    }

    renderSessionsTable(planilla) {
        const tbody = document.getElementById('attendanceSessionsBody');
        tbody.innerHTML = '';
        const canEdit = planilla.status === 'borrador' || planilla.status === 'observado';

        if (planilla.sessions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--color-text-secondary);">No hay sesiones registradas. Use el botón + Agregar sesión.</td></tr>';
        } else {
            planilla.sessions.forEach((s, i) => {
                const meet = s.meetLink
                    ? `<a href="${s.meetLink}" target="_blank" title="${s.meetLink}" style="color:var(--color-primary); font-size:0.8rem;">&#128279; Meet</a>`
                    : '<span style="color:var(--color-text-secondary);">—</span>';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${i+1}</td>
                    <td>${s.date}</td>
                    <td>${s.entryTime}</td>
                    <td>${s.exitTime}</td>
                    <td><strong>${s.totalHours} h</strong></td>
                    <td>${meet}</td>
                    <td style="max-width:160px; font-size:0.8rem;">${s.observation || '—'}</td>
                    <td>
                        <div class="action-icons">
                            ${canEdit ? `<button class="icon-btn icon-edit" onclick="app.editSession('${s.id}')" title="Editar">&#9998;</button>
                            <button class="icon-btn icon-delete" onclick="app.deleteSession('${s.id}')" title="Eliminar">&#128683;</button>` : '<span style="font-size:0.75rem; color:var(--color-text-secondary);">Bloqueado</span>'}
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        document.getElementById('attTotalHours').innerHTML = `<strong>${planilla.totalHoursDictated} h</strong>`;

        // Show/hide add button
        const addBtn = document.getElementById('attAddSessionBtn');
        addBtn.style.display = canEdit ? 'inline-flex' : 'none';
    }

    renderPlanillaActions(planilla) {
        const div = document.getElementById('attPlanillaActions');
        const canEdit = planilla.status === 'borrador' || planilla.status === 'observado';
        const canSend = planilla.status === 'borrador' || planilla.status === 'observado';

        div.innerHTML = `
            ${canEdit ? `<button class="btn btn-secondary" onclick="app.savePlanillaDraft()">&#128190; Guardar borrador</button>` : ''}
            ${canSend ? `<button class="btn btn-primary" onclick="app.sendPlanilla()">&#9993; Enviar planilla</button>` : ''}
            <button class="btn btn-secondary" onclick="app.printPlanilla()">&#128424; Imprimir</button>
        `;
    }

    openSessionModal(sessionId = null) {
        const planilla = DataManager.getAllTeacherAttendance().find(p => p.id === this._currentPlanillaId);
        if (!planilla) return;
        if (planilla.status !== 'borrador' && planilla.status !== 'observado') {
            this.showToast('No puedes agregar sesiones a una planilla en estado ' + planilla.status, 'error');
            return;
        }

        const form = document.getElementById('sessionForm');
        form.reset();
        document.getElementById('sessionTotalHours').value = '';
        document.getElementById('sessionModalTitle').textContent = sessionId ? 'Editar Sesión' : 'Agregar Sesión';
        this._editingSessionId = sessionId;

        if (sessionId) {
            const session = planilla.sessions.find(s => s.id === sessionId);
            if (session) {
                document.getElementById('sessionDate').value = session.date;
                document.getElementById('sessionEntryTime').value = session.entryTime;
                document.getElementById('sessionExitTime').value = session.exitTime;
                document.getElementById('sessionTotalHours').value = session.totalHours + ' h';
                document.getElementById('sessionMeetLink').value = session.meetLink || '';
                document.getElementById('sessionObservation').value = session.observation || '';
            }
        }

        // Auto-calculate hours
        const calcHours = () => {
            const entry = document.getElementById('sessionEntryTime').value;
            const exit = document.getElementById('sessionExitTime').value;
            if (entry && exit && exit > entry) {
                const [eh, em] = entry.split(':').map(Number);
                const [xh, xm] = exit.split(':').map(Number);
                const total = ((xh * 60 + xm) - (eh * 60 + em)) / 60;
                document.getElementById('sessionTotalHours').value = Math.round(total * 10) / 10 + ' h';
            } else {
                document.getElementById('sessionTotalHours').value = '';
            }
        };
        document.getElementById('sessionEntryTime').oninput = calcHours;
        document.getElementById('sessionExitTime').oninput = calcHours;

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('sessionModal').style.display = 'block';
        form.onsubmit = (e) => this.handleSessionSubmit(e);
    }

    editSession(sessionId) {
        this.openSessionModal(sessionId);
    }

    deleteSession(sessionId) {
        if (confirm('¿Eliminar esta sesión?')) {
            DataManager.deleteSessionFromAttendance(this._currentPlanillaId, sessionId);
            const planilla = DataManager.getAllTeacherAttendance().find(p => p.id === this._currentPlanillaId);
            const group = DataManager.getGroupById(this._currentGroupId);
            this.renderAttStatusBar(planilla, group);
            this.renderSessionsTable(planilla);
            this.renderPlanillaActions(planilla);
            this.showToast('Sesión eliminada', 'success');
        }
    }

    handleSessionSubmit(e) {
        e.preventDefault();
        const date = document.getElementById('sessionDate').value;
        const entry = document.getElementById('sessionEntryTime').value;
        const exit = document.getElementById('sessionExitTime').value;
        const meetLink = document.getElementById('sessionMeetLink').value.trim();
        const obs = document.getElementById('sessionObservation').value.trim();

        if (!date) { this.showToast('La fecha es obligatoria', 'error'); return; }
        if (!entry) { this.showToast('La hora de entrada es obligatoria', 'error'); return; }
        if (!exit)  { this.showToast('La hora de salida es obligatoria', 'error'); return; }
        if (exit <= entry) { this.showToast('La hora de salida debe ser mayor que la de entrada', 'error'); return; }
        if (meetLink && !meetLink.startsWith('http')) { this.showToast('El enlace Meet debe comenzar con https://', 'error'); return; }

        const [eh, em] = entry.split(':').map(Number);
        const [xh, xm] = exit.split(':').map(Number);
        const totalHours = Math.round(((xh * 60 + xm) - (eh * 60 + em)) / 60 * 10) / 10;

        const sessionData = { date, entryTime: entry, exitTime: exit, totalHours, meetLink, observation: obs };

        if (this._editingSessionId) {
            DataManager.updateSessionInAttendance(this._currentPlanillaId, this._editingSessionId, sessionData);
            this.showToast('Sesión actualizada correctamente', 'success');
        } else {
            DataManager.addSessionToAttendance(this._currentPlanillaId, sessionData);
            this.showToast('Sesión agregada correctamente', 'success');
        }

        this.closeModal();
        const planilla = DataManager.getAllTeacherAttendance().find(p => p.id === this._currentPlanillaId);
        const group = DataManager.getGroupById(this._currentGroupId);
        this.renderAttStatusBar(planilla, group);
        this.renderSessionsTable(planilla);
        this.renderPlanillaActions(planilla);
    }

    savePlanillaDraft() {
        this.showToast('Borrador guardado correctamente', 'success');
    }

    sendPlanilla() {
        if (confirm('¿Enviar la planilla? El administrador podrá revisarla. Ya no podrás editar las sesiones.')) {
            DataManager.updateTeacherAttendanceStatus(this._currentPlanillaId, 'enviado');
            const planilla = DataManager.getAllTeacherAttendance().find(p => p.id === this._currentPlanillaId);
            const group = DataManager.getGroupById(this._currentGroupId);
            this.renderAttStatusBar(planilla, group);
            this.renderSessionsTable(planilla);
            this.renderPlanillaActions(planilla);
            this.showToast('Planilla enviada al administrador', 'success');
        }
    }

    printPlanilla() {
        this.showToast('Vista de impresión simulada — usar Ctrl+P para imprimir la vista actual', 'success');
    }

    // ========== GRADES MODULE — FASE 6 ==========
    setupGrades() {
        const adminView = document.getElementById('gradesAdminView');
        const teacherView = document.getElementById('gradesTeacherView');

        if (adminView) adminView.style.display = 'block';
        if (teacherView) teacherView.style.display = 'none';
        this.setupAdminGradesView();
    }

    // --- VISTA ADMINISTRADOR ---
    setupAdminGradesView() {
        const role = DataManager.currentUser ? DataManager.currentUser.role : 'admin';
        
        // Populate course filter
        const courseFilter = document.getElementById('gradesAdminFilterCourse');
        courseFilter.innerHTML = '<option value="">Todos los cursos</option>';
        DataManager.getCourses().forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            courseFilter.appendChild(opt);
        });

        // Populate group filter
        const groupFilter = document.getElementById('gradesAdminFilterGroup');
        groupFilter.innerHTML = '<option value="">Todos los grupos</option>';
        DataManager.getGroups().forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.id;
            opt.textContent = g.code;
            groupFilter.appendChild(opt);
        });

        // Populate teacher filter
        const teacherFilter = document.getElementById('gradesAdminFilterTeacher');
        teacherFilter.innerHTML = '<option value="">Todos los docentes</option>';
        DataManager.getTeachers().forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.firstName} ${t.lastName}`;
            teacherFilter.appendChild(opt);
        });

        // Hide/Show teacher filter depending on role
        if (role === 'teacher') {
            if (teacherFilter) teacherFilter.style.display = 'none';
        } else {
            if (teacherFilter) teacherFilter.style.display = 'inline-block';
        }

        this.renderAdminGradesTable();

        const apply = () => this.renderAdminGradesTable();
        courseFilter.onchange = apply;
        groupFilter.onchange = apply;
        teacherFilter.onchange = apply;
        document.getElementById('gradesAdminFilterModality').onchange = apply;
        document.getElementById('gradesAdminFilterStatus').onchange = apply;
    }

    renderAdminGradesTable() {
        const tbody = document.getElementById('gradesAdminTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const courseFilter = document.getElementById('gradesAdminFilterCourse').value;
        const groupFilter = document.getElementById('gradesAdminFilterGroup').value;
        const teacherFilter = document.getElementById('gradesAdminFilterTeacher') ? document.getElementById('gradesAdminFilterTeacher').value : '';
        const modalityFilter = document.getElementById('gradesAdminFilterModality').value;
        const statusFilter = document.getElementById('gradesAdminFilterStatus').value;

        // Ensure all groups have a gradeSheet status
        DataManager.ensureAllGroupsHaveGradeSheet();

        let filteredGroups = DataManager.getGroups();

        const role = DataManager.currentUser ? DataManager.currentUser.role : 'admin';
        const teacherId = DataManager.getTeacherIdForUser(DataManager.currentUser);

        if (role === 'teacher' && teacherId) {
            filteredGroups = filteredGroups.filter(g => g.teacherId === teacherId);
        } else {
            if (teacherFilter) filteredGroups = filteredGroups.filter(g => g.teacherId === teacherFilter);
        }

        if (courseFilter) filteredGroups = filteredGroups.filter(g => g.courseId === courseFilter);
        if (groupFilter) filteredGroups = filteredGroups.filter(g => g.id === groupFilter);
        if (modalityFilter) filteredGroups = filteredGroups.filter(g => g.modality === modalityFilter);

        // Filter by gradeSheet status
        filteredGroups = filteredGroups.filter(g => {
            const sheet = DataManager.getGradeSheetByGroup(g.id);
            const status = sheet ? sheet.status : 'borrador';
            if (statusFilter && status.toLowerCase() !== statusFilter.toLowerCase()) return false;
            return true;
        });

        if (filteredGroups.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--color-text-secondary);">No se encontraron actas de notas</td></tr>';
            return;
        }

        const statusMap = {
            borrador: { label: 'Borrador', css: 'badge-pending' },
            cerrada: { label: 'Cerrada', css: 'badge-closed' }
        };

        filteredGroups.forEach(group => {
            const sheet = DataManager.getGradeSheetByGroup(group.id);
            const status = sheet ? sheet.status : 'borrador';
            const statusKey = status.toLowerCase();
            const statusInfo = statusMap[statusKey] || { label: status, css: 'badge-pending' };
            const course = DataManager.getCourseById(group.courseId);
            const enrolled = DataManager.getEnrolledStudentsByGroup(group.id);
            
            // Calculate how many students have complete grades
            let completeGradesCount = 0;
            let groupSum = 0;
            
            enrolled.forEach(student => {
                const gradeRecord = mockData.grades.find(g => g.groupId === group.id && g.studentId === student.id);
                if (gradeRecord && course) {
                    let complete = true;
                    course.modules.forEach(m => {
                        const val = gradeRecord.moduleGrades[m.id];
                        if (val === undefined || val === null || val === '') {
                            complete = false;
                        }
                    });
                    if (complete) {
                        completeGradesCount++;
                        const avg = DataManager.calculateAverage(gradeRecord.moduleGrades, course);
                        groupSum += avg;
                    }
                }
            });

            const notesComplete = `${completeGradesCount} / ${enrolled.length}`;
            const groupAverage = completeGradesCount > 0 ? (groupSum / completeGradesCount).toFixed(1) : '-';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${group.code}</strong></td>
                <td>${group.courseName}</td>
                <td>${group.teacherName}</td>
                <td>${group.modality === 'regular' ? 'Curso regular' : 'Examen de suficiencia'}</td>
                <td>${enrolled.length}</td>
                <td>${notesComplete}</td>
                <td><strong>${groupAverage}</strong></td>
                <td><span class="badge-status ${statusInfo.css}">${statusInfo.label}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewGradeSheetDetail('${group.id}')" title="Ver / editar acta completa">&#128269;</button>
                        <button class="icon-btn icon-print" onclick="app.printGradeSheet('${group.id}')" title="Imprimir">&#128424;</button>
                        <button class="icon-btn icon-export" onclick="app.exportGradeSheet('${group.id}')" title="Exportar acta">&#128197;</button>
                        ${(role === 'admin' && statusKey === 'cerrada') ? `<button class="icon-btn icon-unlock" onclick="app.reopenGradeSheet('${group.id}')" title="Reabrir acta">&#128275;</button>` : ''}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    viewGradeSheetDetail(groupId) {
        const group = DataManager.getGroupById(groupId);
        if (!group) return;
        const course = DataManager.getCourseById(group.courseId);
        const enrolled = DataManager.getEnrolledStudentsByGroup(groupId);
        const sheet = DataManager.getGradeSheetByGroup(groupId);
        const status = sheet ? sheet.status : 'borrador';
        const isBorrador = status.toLowerCase() === 'borrador';

        const role = DataManager.currentUser ? DataManager.currentUser.role : 'admin';
        const canEdit = role === 'teacher' && isBorrador;

        let headers = '<th>Código</th><th>Alumno</th>';
        course.modules.forEach(m => {
            headers += `<th>${m.name} (${m.percentage}%)</th>`;
        });
        headers += '<th>Promedio</th><th>Estado</th>';

        let rows = '';
        enrolled.forEach(student => {
            const gradeRecord = mockData.grades.find(g => g.groupId === groupId && g.studentId === student.id);
            const moduleGrades = gradeRecord ? gradeRecord.moduleGrades : {};
            
            let isComplete = true;
            course.modules.forEach(m => {
                const val = moduleGrades[m.id];
                if (val === undefined || val === null || val === '') {
                    isComplete = false;
                }
            });

            const avg = isComplete ? DataManager.calculateAverage(moduleGrades, course) : null;
            const isApproved = avg >= 11;
            const statusLabel = isComplete ? (isApproved ? 'Aprobado' : 'Desaprobado') : 'Pendiente';
            const statusClass = isComplete ? (isApproved ? 'badge-approved' : 'badge-rejected') : 'badge-pending';

            rows += `<tr data-student-id="${student.id}">
                <td>${student.code}</td>
                <td><strong>${student.firstName} ${student.lastName}</strong></td>
            `;

            course.modules.forEach(m => {
                const val = moduleGrades[m.id];
                const displayVal = val !== undefined && val !== null ? val : '';
                if (canEdit) {
                    rows += `
                        <td>
                            <input type="number" 
                                   class="modal-grade-input" 
                                   min="0" 
                                   max="20" 
                                   step="1"
                                   value="${displayVal}" 
                                   data-student-id="${student.id}"
                                   data-module-id="${m.id}" 
                                   oninput="app.onModalGradeInputChange(this, '${groupId}', '${student.id}')"
                                   style="width: 65px; text-align: center; padding: 0.3rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-primary); color: var(--color-text-primary);" />
                        </td>
                    `;
                } else {
                    rows += `<td style="text-align: center;">${val !== undefined && val !== null && val !== '' ? val : '-'}</td>`;
                }
            });

            rows += `
                <td><strong class="modal-row-average">${avg !== null ? avg.toFixed(1) : '-'}</strong></td>
                <td><span class="badge-status ${statusClass} modal-row-status">${statusLabel}</span></td>
            </tr>`;
        });

        // Calculate initial group average
        let completeGradesCount = 0;
        let groupSum = 0;
        enrolled.forEach(student => {
            const gradeRecord = mockData.grades.find(g => g.groupId === groupId && g.studentId === student.id);
            if (gradeRecord && course) {
                let complete = true;
                course.modules.forEach(m => {
                    const val = gradeRecord.moduleGrades[m.id];
                    if (val === undefined || val === null || val === '') {
                        complete = false;
                    }
                });
                if (complete) {
                    completeGradesCount++;
                    const avg = DataManager.calculateAverage(gradeRecord.moduleGrades, course);
                    groupSum += avg;
                }
            }
        });
        const groupAverage = completeGradesCount > 0 ? (groupSum / completeGradesCount).toFixed(1) : '-';

        const body = document.getElementById('gradesDetailBody');
        body.innerHTML = `
            <div class="grades-summary-card" style="margin-bottom: 1.5rem; padding: 1rem; border-radius: var(--radius-md);">
                <h3 style="margin-top: 0; color: var(--color-primary);">${group.courseName} - ${group.code}</h3>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; font-size: 0.85rem;">
                    <div><strong>Docente:</strong> ${group.teacherName}</div>
                    <div><strong>Modalidad:</strong> ${group.modality === 'regular' ? 'Curso regular' : 'Examen de suficiencia'}</div>
                    <div><strong>Estado Acta:</strong> <span class="badge-status ${status.toLowerCase() === 'cerrada' ? 'badge-closed' : 'badge-pending'}">${status.toUpperCase()}</span></div>
                    <div><strong>Promedio Grupo:</strong> <strong id="modalGroupAverage">${groupAverage}</strong></div>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table">
                    <thead><tr>${headers}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            
            <div class="modal-actions" style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
                ${canEdit ? `
                    <button class="btn btn-primary" onclick="app.saveModalGrades('${groupId}')">&#128190; Guardar Notas</button>
                    <button class="btn btn-secondary" onclick="app.closeModalGradeSheetFromModal('${groupId}')">&#128274; Cerrar Acta</button>
                ` : ''}
                <button class="btn btn-secondary" onclick="app.closeModal()">Cerrar</button>
            </div>
        `;

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('gradesDetailModal').style.display = 'block';
    }

    onModalGradeInputChange(input, groupId, studentId) {
        // Enforce 0-20 limits
        let val = input.value;
        if (val !== '') {
            let num = parseFloat(val);
            if (num < 0) input.value = 0;
            if (num > 20) input.value = 20;
        }

        // Recalculate average and status in the row
        const row = input.closest('tr');
        const inputs = row.querySelectorAll('.modal-grade-input');
        const course = DataManager.getCourseById(DataManager.getGroupById(groupId).courseId);
        
        const moduleGrades = {};
        let isComplete = true;

        inputs.forEach(inp => {
            const modId = inp.getAttribute('data-module-id');
            const v = inp.value;
            if (v === undefined || v === null || v === '') {
                isComplete = false;
            } else {
                moduleGrades[modId] = parseFloat(v);
            }
        });

        const averageCell = row.querySelector('.modal-row-average');
        const statusBadge = row.querySelector('.modal-row-status');

        if (isComplete) {
            const avg = DataManager.calculateAverage(moduleGrades, course);
            const isApproved = avg >= 11;
            averageCell.textContent = avg.toFixed(1);
            statusBadge.textContent = isApproved ? 'Aprobado' : 'Desaprobado';
            statusBadge.className = `badge-status modal-row-status ${isApproved ? 'badge-approved' : 'badge-rejected'}`;
        } else {
            averageCell.textContent = '-';
            statusBadge.textContent = 'Pendiente';
            statusBadge.className = 'badge-status modal-row-status badge-pending';
        }

        // Recalculate group average in the modal in real-time
        const tbody = row.parentElement;
        const allRows = tbody.querySelectorAll('tr');
        let completeAveragesCount = 0;
        let groupSum = 0;

        allRows.forEach(r => {
            const avgCell = r.querySelector('.modal-row-average');
            if (avgCell && avgCell.textContent !== '-') {
                const rowAvg = parseFloat(avgCell.textContent);
                if (!isNaN(rowAvg)) {
                    groupSum += rowAvg;
                    completeAveragesCount++;
                }
            }
        });

        const modalGroupAvgEl = document.getElementById('modalGroupAverage');
        if (modalGroupAvgEl) {
            modalGroupAvgEl.textContent = completeAveragesCount > 0 ? (groupSum / completeAveragesCount).toFixed(1) : '-';
        }
    }

    saveModalGrades(groupId) {
        const body = document.getElementById('gradesDetailBody');
        const rows = body.querySelectorAll('tbody tr');
        const course = DataManager.getCourseById(DataManager.getGroupById(groupId).courseId);

        let hasError = false;
        rows.forEach(row => {
            const studentId = row.getAttribute('data-student-id');
            const inputs = row.querySelectorAll('.modal-grade-input');
            const moduleGrades = {};

            inputs.forEach(inp => {
                const modId = inp.getAttribute('data-module-id');
                const val = inp.value;
                if (val !== '') {
                    const num = parseFloat(val);
                    if (num < 0 || num > 20 || isNaN(num)) {
                        hasError = true;
                    } else {
                        moduleGrades[modId] = num;
                    }
                }
            });

            if (!hasError) {
                DataManager.saveGrade(groupId, studentId, moduleGrades);
            }
        });

        if (hasError) {
            this.showToast('Algunas notas tienen valores inválidos y no se guardaron. Deben estar entre 0 y 20.', 'error');
        } else {
            this.showToast('Calificaciones del acta guardadas correctamente', 'success');
            
            // Reload the list table in the background
            this.renderAdminGradesTable();

            // Refresh modal to show updated values and recalculate status classes
            this.viewGradeSheetDetail(groupId);
        }
    }

    closeModalGradeSheetFromModal(groupId) {
        const body = document.getElementById('gradesDetailBody');
        const inputs = body.querySelectorAll('.modal-grade-input');

        let isAllComplete = true;
        inputs.forEach(inp => {
            if (inp.value === '') {
                isAllComplete = false;
            }
        });

        if (!isAllComplete) {
            this.showToast('No se puede cerrar el acta porque hay calificaciones pendientes. Complete todas las notas.', 'error');
            return;
        }

        if (confirm('¿Cerrar acta de notas? Una vez cerrada no podrá modificar las calificaciones.')) {
            // First save modal grades
            this.saveModalGrades(groupId);

            // Then update state
            DataManager.updateGradeSheetStatus(groupId, 'cerrada');
            this.showToast('Acta de notas cerrada correctamente. Calificaciones consolidadas.', 'success');

            // Reload the list table in the background
            this.renderAdminGradesTable();

            // Refresh modal which will now be read-only
            this.viewGradeSheetDetail(groupId);
        }
    }

    reopenGradeSheet(groupId) {
        if (confirm('¿Está seguro de reabrir esta acta? El docente podrá editar las notas nuevamente.')) {
            DataManager.updateGradeSheetStatus(groupId, 'borrador');
            this.showToast('Acta de notas reabierta correctamente', 'success');
            this.renderAdminGradesTable();
        }
    }

    printGradeSheet(groupId) {
        this.showToast('Vista de impresión de acta abierta. Use Ctrl+P para imprimir.', 'info');
    }

    exportGradeSheet(groupId) {
        this.showToast('Acta exportada correctamente en formato XLS (Simulado)', 'success');
    }



    // ========== CERTIFICATES MODULE ==========
    loadCertificates() {
        const tbody = document.getElementById('certificatesTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        // Populate course filter if empty
        const courseFilter = document.getElementById('certCourseFilter');
        if (courseFilter && courseFilter.options.length <= 1) {
            DataManager.getCourses().forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = c.name;
                courseFilter.appendChild(opt);
            });
            courseFilter.onchange = () => this.loadCertificates();
        }

        // Populate group filter if empty
        const groupFilter = document.getElementById('certGroupFilter');
        if (groupFilter && groupFilter.options.length <= 1) {
            DataManager.getGroups().forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.id;
                opt.textContent = g.code;
                groupFilter.appendChild(opt);
            });
            groupFilter.onchange = () => this.loadCertificates();
        }

        const modalityFilter = document.getElementById('certModalityFilter');
        if (modalityFilter && !modalityFilter.onchange) {
            modalityFilter.onchange = () => this.loadCertificates();
        }

        const courseVal = courseFilter ? courseFilter.value : '';
        const groupVal = document.getElementById('certGroupFilter') ? document.getElementById('certGroupFilter').value : '';
        const modalityVal = document.getElementById('certModalityFilter') ? document.getElementById('certModalityFilter').value : '';

        const minPassingGrade = mockData.settings.minPassingGrade;
        const minAttendanceRequired = mockData.settings.minAttendanceRequired;

        const certificateRows = [];

        mockData.enrollments.forEach(enr => {
            const student = DataManager.getStudentById(enr.studentId);
            const group = DataManager.getGroupById(enr.groupId);
            if (!student || !group) return;

            const course = DataManager.getCourseById(group.courseId);
            if (!course) return;

            // Apply filters
            if (courseVal && group.courseId !== courseVal) return;
            if (groupVal && group.id !== groupVal) return;
            if (modalityVal && group.modality !== modalityVal) return;

            const gradeRecord = mockData.grades.find(g => g.groupId === enr.groupId && g.studentId === enr.studentId);
            const average = gradeRecord ? DataManager.calculateAverage(gradeRecord.moduleGrades, course) : 0;
            const attPct = DataManager.calculateAttendancePercentage(enr.studentId, enr.groupId);

            // Find all certificates for this student and group
            const studentCerts = mockData.certificates.filter(c => c.studentId === enr.studentId && c.groupId === enr.groupId);
            
            // Add each certificate as an independent row
            studentCerts.forEach(cert => {
                let statusLabel = 'Por firmar';
                if (cert.status === 'pending') statusLabel = 'Pendiente';
                if (cert.status === 'generated' || cert.status === 'issued') statusLabel = 'Generado';
                if (cert.status === 'annulled') statusLabel = 'Anulado';

                certificateRows.push({
                    student,
                    group,
                    course,
                    average,
                    attPct,
                    status: statusLabel,
                    reason: cert.observations || '',
                    certificate: cert,
                    type: cert.type || 'certificado',
                    id: cert.id
                });
            });

            // Check if can emit new document (only if not already created/active)
            const hasCert = studentCerts.some(c => c.type === 'certificado' && c.status !== 'annulled');
            const hasConst = studentCerts.some(c => c.type === 'constancia' && c.status !== 'annulled');

            const groupFinished = group.status === 'finished' || group.status === 'closed';
            let isApt = true;
            let reason = '';
            
            if (!groupFinished) {
                isApt = false;
                reason = 'Grupo activo';
            } else if (average < minPassingGrade) {
                isApt = false;
                reason = `Promedio bajo (${average.toFixed(1)} < ${minPassingGrade})`;
            } else if (group.modality === 'regular' && attPct < minAttendanceRequired) {
                isApt = false;
                reason = `Inasistencias (${attPct}% < ${minAttendanceRequired}%)`;
            }

            if (!isApt && studentCerts.length === 0) {
                // If not apt and has no documents at all, add a single "No apto" row
                certificateRows.push({
                    student,
                    group,
                    course,
                    average,
                    attPct,
                    status: 'No apto',
                    reason: reason,
                    certificate: null,
                    type: '',
                    id: 'NOAPTO-' + enr.id
                });
            } else {
                // If apt, add rows for eligible types if they don't already exist
                if (isApt && !hasCert) {
                    certificateRows.push({
                        student,
                        group,
                        course,
                        average,
                        attPct,
                        status: 'Apto',
                        reason: 'Disponible para emitir Certificado',
                        certificate: null,
                        type: 'certificado',
                        id: 'APTO-CERT-' + enr.id
                    });
                }
                if (isApt && !hasConst) {
                    certificateRows.push({
                        student,
                        group,
                        course,
                        average,
                        attPct,
                        status: 'Apto',
                        reason: 'Disponible para emitir Constancia',
                        certificate: null,
                        type: 'constancia',
                        id: 'APTO-CONS-' + enr.id
                    });
                }
            }
        });

        // Set Table Headers according to Current Logged Role
        const thead = document.querySelector('#certificatesTable thead');
        if (thead) {
            if (DataManager.currentUser && DataManager.currentUser.role === 'dean') {
                thead.innerHTML = `
                    <tr>
                        <th>Código Alumno</th>
                        <th>Alumno</th>
                        <th>Curso</th>
                        <th>Modalidad</th>
                        <th>Tipo Doc.</th>
                        <th>Estado</th>
                        <th>Firma Decano</th>
                        <th>Firma Director</th>
                        <th>Fecha Solicitud</th>
                        <th>Acciones</th>
                    </tr>
                `;
            } else if (DataManager.currentUser && DataManager.currentUser.role === 'admin') {
                thead.innerHTML = `
                    <tr>
                        <th>Código Alumno</th>
                        <th>Alumno</th>
                        <th>Curso</th>
                        <th>Modalidad</th>
                        <th>Tipo Doc.</th>
                        <th>Promedio</th>
                        <th>Asistencia</th>
                        <th>Estado</th>
                        <th>Firma Decano</th>
                        <th>Firma Director</th>
                        <th>Acciones</th>
                    </tr>
                `;
            } else {
                thead.innerHTML = `
                    <tr>
                        <th>Código Alumno</th>
                        <th>Alumno</th>
                        <th>Curso</th>
                        <th>Modalidad</th>
                        <th>Tipo Doc.</th>
                        <th>Promedio</th>
                        <th>Asistencia</th>
                        <th>Estado</th>
                        <th>Fecha Solicitud</th>
                        <th>Acciones</th>
                    </tr>
                `;
            }
        }

        // Apply Dean filters
        if (DataManager.currentUser && DataManager.currentUser.role === 'dean') {
            const filteredRows = certificateRows.filter(item => 
                item.certificate && 
                item.certificate.status === 'toBeSigned' && 
                !item.certificate.deanSigned
            );
            this.renderDeanCertificatesTable(filteredRows);
            return;
        }

        if (certificateRows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding:2rem; color:var(--color-text-secondary);">No se encontraron alumnos para constancias o certificados</td></tr>';
            return;
        }

        certificateRows.forEach(item => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', item.id);
            row.setAttribute('data-student-id', item.student.id);
            row.setAttribute('data-group-id', item.group.id);
            row.setAttribute('data-status', item.status);
            row.setAttribute('data-type', item.type || '');
            if (item.certificate) {
                row.setAttribute('data-cert-id', item.certificate.id);
            }

            let statusBadge = '';
            let actionBtn = '';
            const docTypeLabel = item.type === 'constancia' ? 'Constancia' : (item.type === 'certificado' ? 'Certificado' : '-');
            const isDirector = DataManager.currentUser && DataManager.currentUser.role === 'admin';
            const isSecretary = DataManager.currentUser && DataManager.currentUser.role === 'secretary';

            if (item.status === 'Generado') {
                statusBadge = '<span class="badge-status badge-active">Generado</span>';
                actionBtn = `
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewCertificate('${item.certificate.id}')" title="Ver Documento">&#128269;</button>
                        <button class="icon-btn icon-print" onclick="app.printCertificateSimulated('${item.certificate.id}')" title="Imprimir">&#128424;</button>
                        <button class="icon-btn icon-export" onclick="app.downloadCertificatePDFSimulated('${item.certificate.id}')" title="Descargar PDF">&#128197;</button>
                        ${isDirector ? `<button class="icon-btn icon-delete" onclick="app.annulCertificate('${item.certificate.id}')" title="Anular Certificado">&#128683;</button>` : ''}
                    </div>
                `;
            } else if (item.status === 'Por firmar') {
                statusBadge = '<span class="badge-status badge-pending">Por firmar</span>'; // yellow/orange
                
                let signBtn = '';
                if (isDirector && !item.certificate.directorSigned) {
                    signBtn = `<button class="icon-btn icon-add" onclick="app.signDocument('${item.certificate.id}', 'director')" title="Firmar como Director" style="color: var(--color-primary); font-weight: bold;">&#10003;</button>`;
                }
                
                actionBtn = `
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewCertificate('${item.certificate.id}')" title="Ver Documento">&#128269;</button>
                        ${signBtn}
                        ${item.certificate.observations ? `<button class="icon-btn icon-edit" onclick="alert('Observación del Decano: ${item.certificate.observations}')" title="Ver Observación" style="color:var(--color-accent);">&#128172;</button>` : ''}
                    </div>
                `;
            } else if (item.status === 'Pendiente') {
                statusBadge = '<span class="badge-status badge-pending-generation">Pendiente</span>'; // purple
                
                let genBtn = '';
                if (isSecretary || isDirector) {
                    genBtn = `<button class="icon-btn icon-edit" onclick="app.finalizeCertificate('${item.certificate.id}')" style="color: var(--color-accent-green);" title="Generar Documento">&#10003;</button>`;
                }
                
                actionBtn = `
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewCertificate('${item.certificate.id}')" title="Ver Documento">&#128269;</button>
                        ${genBtn}
                        ${isDirector ? `<button class="icon-btn icon-delete" onclick="app.annulCertificate('${item.certificate.id}')" title="Anular Documento">&#128683;</button>` : ''}
                    </div>
                `;
            } else if (item.status === 'Anulado') {
                statusBadge = '<span class="badge-status badge-inactive" style="background-color:rgba(120,120,120,0.12); color:#666; border:1px solid rgba(120,120,120,0.2);">Anulado</span>';
                actionBtn = `<button class="icon-btn icon-view" onclick="app.viewCertificate('${item.certificate.id}')" title="Ver Documento">&#128269;</button>`;
            } else if (item.status === 'Apto') {
                statusBadge = '<span class="badge-status badge-active" style="background-color:rgba(30,91,168,0.12); color:var(--color-primary); border:1px solid rgba(30,91,168,0.2);">Apto</span>';
                actionBtn = `<span style="font-size:0.8rem; color:var(--color-text-secondary); font-style:italic;">Disponible</span>`;
            } else {
                statusBadge = `<span class="badge-status badge-not-eligible" title="Motivo: ${item.reason}" style="cursor:help;">No apto</span>`;
                actionBtn = `<span style="font-size: 0.8rem; color: var(--color-text-light); font-style:italic;">${item.reason}</span>`;
            }

            if (isDirector) {
                const deanSignedBadge = item.certificate && item.certificate.deanSigned 
                    ? '<span class="badge-status badge-active">Firmado</span>' 
                    : (item.certificate ? '<span class="badge-status badge-inactive">Pendiente</span>' : '-');
                
                const directorSignedBadge = item.certificate && item.certificate.directorSigned 
                    ? '<span class="badge-status badge-active">Firmado</span>' 
                    : (item.certificate ? '<span class="badge-status badge-inactive">Pendiente</span>' : '-');

                row.innerHTML = `
                    <td>${item.student.code}</td>
                    <td><strong>${item.student.firstName} ${item.student.lastName}</strong></td>
                    <td>${item.course.name}</td>
                    <td>${item.group.modality === 'regular' ? 'Curso regular' : 'Examen'}</td>
                    <td>${docTypeLabel}</td>
                    <td>${item.average > 0 ? item.average.toFixed(1) : '-'}</td>
                    <td>${item.group.modality === 'exam' ? '100%' : item.attPct + '%'}</td>
                    <td>${statusBadge}</td>
                    <td>${deanSignedBadge}</td>
                    <td>${directorSignedBadge}</td>
                    <td>${actionBtn}</td>
                `;
            } else {
                const issueDate = item.certificate ? new Date(item.certificate.issueDate).toLocaleDateString() : '-';
                row.innerHTML = `
                    <td>${item.student.code}</td>
                    <td><strong>${item.student.firstName} ${item.student.lastName}</strong></td>
                    <td>${item.course.name}</td>
                    <td>${item.group.modality === 'regular' ? 'Curso regular' : 'Examen'}</td>
                    <td>${docTypeLabel}</td>
                    <td>${item.average > 0 ? item.average.toFixed(1) : '-'}</td>
                    <td>${item.group.modality === 'exam' ? '100%' : item.attPct + '%'}</td>
                    <td>${statusBadge}</td>
                    <td>${issueDate}</td>
                    <td>${actionBtn}</td>
                `;
            }

            tbody.appendChild(row);
        });
    }

    renderDeanCertificatesTable(rows) {
        const tbody = document.getElementById('certificatesTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:2rem; color:var(--color-text-secondary);">No hay documentos pendientes de su firma.</td></tr>';
            return;
        }

        rows.forEach(item => {
            const row = document.createElement('tr');
            row.setAttribute('data-cert-id', item.certificate.id);
            row.setAttribute('data-status', item.status);
            row.setAttribute('data-student-id', item.student.id);
            row.setAttribute('data-group-id', item.group.id);

            const docTypeLabel = item.type === 'constancia' ? 'Constancia' : 'Certificado';
            
            const statusBadge = '<span class="badge-status badge-pending">Por firmar</span>'; // yellow/orange
            
            const deanSignedBadge = '<span class="badge-status badge-inactive">Pendiente</span>'; // red/orange pending
            
            const directorSignedBadge = item.certificate.directorSigned 
                ? '<span class="badge-status badge-active">Firmado</span>' 
                : '<span class="badge-status badge-inactive">Pendiente</span>';

            const issueDate = item.certificate.issueDate ? new Date(item.certificate.issueDate).toLocaleDateString() : '-';

            const actionBtn = `
                <div class="action-icons">
                    <button class="icon-btn icon-view" onclick="app.viewCertificate('${item.certificate.id}')" title="Ver Documento">&#128269;</button>
                    <button class="icon-btn icon-add" onclick="app.signDocument('${item.certificate.id}', 'dean')" title="Firmar Documento" style="color: var(--color-primary); font-weight: bold;">&#10003;</button>
                    <button class="icon-btn icon-edit" onclick="app.openCertObservationModal('${item.certificate.id}')" title="Ayuda / Observación">&#128172;</button>
                </div>
            `;

            row.innerHTML = `
                <td>${item.student.code}</td>
                <td><strong>${item.student.firstName} ${item.student.lastName}</strong></td>
                <td>${item.course.name}</td>
                <td>${item.group.modality === 'regular' ? 'Curso regular' : 'Examen'}</td>
                <td>${docTypeLabel}</td>
                <td>${statusBadge}</td>
                <td>${deanSignedBadge}</td>
                <td>${directorSignedBadge}</td>
                <td>${issueDate}</td>
                <td>${actionBtn}</td>
            `;
            tbody.appendChild(row);
        });
    }

    generateCertificate(studentId, groupId) {
        // Redundancy handler just in case it is called directly
        const certificate = DataManager.generateCertificate(studentId, groupId);
        this.showToast('Certificado generado correctamente', 'success');
        this.viewCertificate(certificate.id);
        this.loadCertificates();
    }

    finalizeCertificate(certId) {
        const cert = mockData.certificates.find(c => c.id === certId);
        if (!cert) return;
        
        if (cert.status !== 'pending') {
            this.showToast('El documento aún requiere firmas del Decano y/o Director.', 'error');
            return;
        }

        cert.status = 'generated';
        cert.issueDate = new Date().toISOString().split('T')[0];
        
        this.showToast('Documento generado oficialmente con éxito.', 'success');
        this.viewCertificate(cert.id);
        this.loadCertificates();
    }

    generateBulkCertificates() {
        const count = DataManager.generateBulkCertificates();
        if (count > 0) {
            this.showToast(`${count} documentos generados y emitidos correctamente`, 'success');
            this.loadCertificates();
        } else {
            this.showToast('No hay documentos con firmas completas listos para generar (estado Pendiente)', 'info');
        }
    }

    annulCertificate(id) {
        if (confirm('¿Está seguro de que desea anular este documento?')) {
            const cert = mockData.certificates.find(c => c.id === id);
            if (cert) {
                cert.status = 'annulled';
                this.showToast('Documento anulado correctamente', 'success');
                this.loadCertificates();
            }
        }
    }

    printCertificateSimulated(id) {
        this.showToast('Enviando documento a la impresora (Simulado)', 'success');
    }

    downloadCertificatePDFSimulated(id) {
        this.showToast('Descargando archivo PDF (Simulado)', 'success');
    }

    viewCertificate(certificateId) {
        const cert = mockData.certificates.find(c => c.id === certificateId);
        if (!cert) return;

        const student = DataManager.getStudentById(cert.studentId);
        const group = DataManager.getGroupById(cert.groupId);
        const course = DataManager.getCourseById(group.courseId);

        const gradeRecord = mockData.grades.find(g => g.groupId === group.id && g.studentId === student.id);
        const average = DataManager.calculateAverage(gradeRecord?.moduleGrades || {}, course);
        const attPct = DataManager.calculateAttendancePercentage(student.id, group.id);

        const preview = document.getElementById('certificatePreview');
        const issueDateFormatted = this.formatDateToSpanish(cert.issueDate);
        const docType = cert.type || 'certificado';
        
        let htmlContent = '';
        
        if (docType === 'certificado') {
            htmlContent = `
                <div class="certificate-diploma-wrapper" style="background: #fbfaf5; border: 6px double #d4af37; padding: 40px; color: #222; text-align: center; position: relative; font-family: 'Georgia', serif; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; box-sizing: border-box; overflow: hidden;">
                    
                    <!-- Logos Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #003d82; padding-bottom: 10px; margin-bottom: 25px;">
                        <img src="logo-unp-transparent.png" style="width: 110px; height: 110px; object-fit: contain; flex-shrink: 0; mix-blend-mode: multiply;" alt="Escudo UNP">
                        <div style="flex: 1; text-align: center; font-family: 'Arial', sans-serif; padding: 0 10px;">
                            <div style="font-size: 1.25rem; font-weight: bold; color: #003d82; letter-spacing: 0.5px;">UNIVERSIDAD NACIONAL DE PIURA</div>
                            <div style="font-size: 0.95rem; font-weight: bold; color: #444; margin-top: 2px;">FACULTAD DE INGENIERÍA INDUSTRIAL</div>
                            <div style="font-size: 0.85rem; font-weight: 600; color: #666; margin-top: 1px;">INSTITUTO DE INFORMÁTICA</div>
                        </div>
                        <img src="logo-fii.png" style="width: 110px; height: 110px; object-fit: contain; mix-blend-mode: multiply; flex-shrink: 0;" alt="Escudo FII">
                    </div>

                    <!-- Título -->
                    <h1 style="font-family: 'Times New Roman', serif; font-size: 2.2rem; letter-spacing: 2px; color: #996515; margin: 15px 0 25px 0; font-weight: bold; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 10px;">CERTIFICADO</h1>
                    
                    <!-- Cuerpo -->
                    <div style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 25px;">
                        <p style="margin: 0; font-size: 0.9rem; text-align: justify; font-style: italic; text-align-last: center;">
                            EL DIRECTOR DEL INSTITUTO DE INFORMÁTICA DE LA FACULTAD DE INGENIERÍA INDUSTRIAL DE LA UNIVERSIDAD NACIONAL DE PIURA.
                        </p>
                        <p style="margin: 20px 0 5px 0; font-weight: bold; text-decoration: underline; font-size: 1rem; text-align: left;">CERTIFICA QUE:</p>
                        
                        <div style="font-size: 1.8rem; font-weight: bold; color: #111; text-transform: uppercase; margin: 15px 0; font-family: 'Georgia', serif;">
                            ${student.firstName} ${student.lastName}
                        </div>
                        
                        <p style="margin: 5px 0;">Identificado con DNI Nº <strong>${student.dni}</strong> y Código de Alumno <strong>${student.code}</strong></p>
                        <p style="margin: 15px 0 5px 0;">Ha APROBADO el Curso:</p>
                        
                        <div style="font-size: 1.5rem; font-weight: bold; color: #003d82; font-style: italic; margin: 10px 0;">
                            ${course.name}
                        </div>
                        
                        <p style="margin: 10px 0;">
                            ${group.modality === 'regular'
                                ? `Desarrollado del <strong>${group.startDate}</strong> al <strong>${group.endDate}</strong> con un total de <strong>${group.hours}</strong> horas.`
                                : `Aprobado mediante Examen de Suficiencia realizado el <strong>${group.startDate}</strong>.`}
                        </p>
                        
                        <p style="font-size: 0.95rem; margin-top: 20px; color: #555;">
                            ${issueDateFormatted}
                        </p>
                    </div>

                    <!-- Firmas con Sellos Coherentes -->
                    <div style="margin-top: 40px; display: flex; justify-content: space-around; align-items: flex-end; gap: 20px; position: relative;">
                        
                        <!-- Firma Decano -->
                        <div style="display: flex; flex-direction: column; align-items: center; width: 280px; position: relative;">
                            <!-- Sello Decanato de fondo -->
                            <div style="position: absolute; left: 40px; top: -15px; pointer-events: none; z-index: 1;">
                                ${cert.deanSigned ? `
                                <svg viewBox="0 0 100 100" style="width: 75px; height: 75px; opacity: 0.28;">
                                  <circle cx="50" cy="50" r="45" fill="none" stroke="#008080" stroke-width="1.5"/>
                                  <circle cx="50" cy="50" r="41" fill="none" stroke="#008080" stroke-dasharray="2 1" stroke-width="0.5"/>
                                  <circle cx="50" cy="50" r="28" fill="none" stroke="#008080" stroke-width="1"/>
                                  <path id="decTextPathTop" d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="none"/>
                                  <path id="decTextPathBottom" d="M 88 50 A 38 38 0 0 1 12 50" fill="none" stroke="none"/>
                                  <text font-family="'Arial', sans-serif" font-size="6" fill="#008080" font-weight="bold">
                                    <textPath href="#decTextPathTop" startOffset="50%" text-anchor="middle">UNIVERSIDAD NACIONAL DE PIURA</textPath>
                                  </text>
                                  <text font-family="'Arial', sans-serif" font-size="5" fill="#008080" font-weight="bold">
                                    <textPath href="#decTextPathBottom" startOffset="50%" text-anchor="middle">FAC. INGENIERIA INDUSTRIAL</textPath>
                                  </text>
                                  <text x="50" y="48" font-family="'Arial', sans-serif" font-size="7" font-weight="bold" fill="#008080" text-anchor="middle">DECANATO</text>
                                  <text x="50" y="59" font-family="'Arial', sans-serif" font-size="8" fill="#008080" text-anchor="middle">🎓</text>
                                </svg>
                                ` : ''}
                            </div>
                            <div style="height: 50px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2;">
                                ${cert.deanSigned 
                                    ? `<span style="font-family: 'Brush Script MT', 'Great Vibes', cursive; font-size: 2.2rem; color: #1e5ba8; transform: rotate(-3deg); font-style: italic; user-select: none;">F. Cruz V.</span>` 
                                    : `<span style="color: #c62828; font-size: 0.8rem; font-style: italic; border: 1px dashed rgba(211,47,47,0.3); padding: 4px 8px; border-radius:4px; background:rgba(211,47,47,0.05);">⚠️ Pendiente de firma</span>`}
                            </div>
                            <div style="width: 100%; border-top: 1px solid #777; margin-top: 5px; padding-top: 5px; text-align: center; font-size: 0.75rem; line-height: 1.3; position: relative; z-index: 2;">
                                <strong>DR. FRANCISCO JAVIER CRUZ VILCHEZ</strong><br>
                                Decano de la Facultad de Ing. Industrial
                            </div>
                        </div>

                        <!-- Firma Director -->
                        <div style="display: flex; flex-direction: column; align-items: center; width: 280px; position: relative;">
                            <!-- Sello Instituto de fondo -->
                            <div style="position: absolute; left: 40px; top: -15px; pointer-events: none; z-index: 1;">
                                ${cert.directorSigned ? `
                                <svg viewBox="0 0 100 100" style="width: 75px; height: 75px; opacity: 0.28;">
                                  <circle cx="50" cy="50" r="45" fill="none" stroke="#003d82" stroke-width="1.5"/>
                                  <circle cx="50" cy="50" r="41" fill="none" stroke="#003d82" stroke-dasharray="2 1" stroke-width="0.5"/>
                                  <circle cx="50" cy="50" r="28" fill="none" stroke="#003d82" stroke-width="1"/>
                                  <path id="dirTextPathTop" d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="none"/>
                                  <path id="dirTextPathBottom" d="M 88 50 A 38 38 0 0 1 12 50" fill="none" stroke="none"/>
                                  <text font-family="'Arial', sans-serif" font-size="6" fill="#003d82" font-weight="bold">
                                    <textPath href="#dirTextPathTop" startOffset="50%" text-anchor="middle">UNIVERSIDAD NACIONAL DE PIURA</textPath>
                                  </text>
                                  <text font-family="'Arial', sans-serif" font-size="5" fill="#003d82" font-weight="bold">
                                    <textPath href="#dirTextPathBottom" startOffset="50%" text-anchor="middle">FAC. INGENIERIA INDUSTRIAL</textPath>
                                  </text>
                                  <text x="50" y="46" font-family="'Arial', sans-serif" font-size="5" font-weight="bold" fill="#003d82" text-anchor="middle">INSTITUTO DE</text>
                                  <text x="50" y="53" font-family="'Arial', sans-serif" font-size="5" font-weight="bold" fill="#003d82" text-anchor="middle">INFORMATICA</text>
                                  <text x="50" y="62" font-family="'Arial', sans-serif" font-size="7" fill="#003d82" text-anchor="middle">💻</text>
                                </svg>
                                ` : ''}
                            </div>
                            <div style="height: 50px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2;">
                                ${cert.directorSigned 
                                    ? `<span style="font-family: 'Brush Script MT', 'Great Vibes', cursive; font-size: 2.2rem; color: #003d82; transform: rotate(-3deg); font-style: italic; user-select: none;">J. Nima R.</span>` 
                                    : `<span style="color: #c62828; font-size: 0.8rem; font-style: italic; border: 1px dashed rgba(211,47,47,0.3); padding: 4px 8px; border-radius:4px; background:rgba(211,47,47,0.05);">⚠️ Pendiente de firma</span>`}
                            </div>
                            <div style="width: 100%; border-top: 1px solid #777; margin-top: 5px; padding-top: 5px; text-align: center; font-size: 0.75rem; line-height: 1.3; position: relative; z-index: 2;">
                                <strong>DR. JONATHAN DAVID NIMA RAMOS</strong><br>
                                Director del Instituto de Informática
                            </div>
                        </div>
                    </div>

                    <!-- Footer / Validación -->
                    <div style="margin-top: 35px; border-top: 1px solid #ccc; padding-top: 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #666;">
                        <span>CAMPUS UNIVERSITARIO - MIRAFLORES - CASTILLA - PIURA</span>
                        <strong style="font-family: 'Courier New', monospace;">CERT. Nº ${cert.code}</strong>
                    </div>
                </div>
            `;
        } else {
            // Constancia
            htmlContent = `
                <div class="certificate-diploma-wrapper" style="background: #fbfaf5; border: 6px double #d4af37; padding: 40px; color: #222; text-align: center; position: relative; font-family: 'Georgia', serif; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; box-sizing: border-box; overflow: hidden;">
                    
                    <!-- Logos Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #003d82; padding-bottom: 10px; margin-bottom: 25px;">
                        <img src="logo-unp-transparent.png" style="width: 110px; height: 110px; object-fit: contain; flex-shrink: 0; mix-blend-mode: multiply;" alt="Escudo UNP">
                        <div style="flex: 1; text-align: center; font-family: 'Arial', sans-serif; padding: 0 10px;">
                            <div style="font-size: 1.25rem; font-weight: bold; color: #003d82; letter-spacing: 0.5px;">UNIVERSIDAD NACIONAL DE PIURA</div>
                            <div style="font-size: 0.95rem; font-weight: bold; color: #444; margin-top: 2px;">FACULTAD DE INGENIERÍA INDUSTRIAL</div>
                            <div style="font-size: 0.85rem; font-weight: 600; color: #666; margin-top: 1px;">INSTITUTO DE INFORMÁTICA</div>
                        </div>
                        <img src="logo-fii.png" style="width: 110px; height: 110px; object-fit: contain; mix-blend-mode: multiply; flex-shrink: 0;" alt="Escudo FII">
                    </div>

                    <!-- Título -->
                    <h1 style="font-family: 'Times New Roman', serif; font-size: 2.2rem; letter-spacing: 2px; color: #996515; margin: 15px 0 25px 0; font-weight: bold; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 10px;">CONSTANCIA</h1>
                    
                    <!-- Cuerpo -->
                    <div style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 25px;">
                        <p style="margin: 0; font-size: 0.9rem; text-align: justify; font-style: italic; text-align-last: center;">
                            EL DIRECTOR DEL INSTITUTO DE INFORMÁTICA DE LA FACULTAD DE INGENIERÍA INDUSTRIAL DE LA UNIVERSIDAD NACIONAL DE PIURA.
                        </p>
                        <p style="margin: 20px 0 5px 0; font-weight: bold; text-decoration: underline; font-size: 1rem; text-align: left;">HACE CONSTAR QUE:</p>
                        
                        <div style="font-size: 1.8rem; font-weight: bold; color: #111; text-transform: uppercase; margin: 15px 0; font-family: 'Georgia', serif;">
                            ${student.firstName} ${student.lastName}
                        </div>
                        
                        <p style="margin: 5px 0; text-align: justify;">
                            Ha participado en el curso <strong>${course.name}</strong>, tal como se detalla a continuación:
                        </p>

                        <div style="margin: 20px auto; max-width: 550px; display: grid; grid-template-columns: 200px 1fr; gap: 8px; text-align: left; font-size: 0.95rem; background: rgba(0,0,0,0.02); padding: 15px; border-radius: 4px; border: 1px solid #eee;">
                            <div><strong>FECHA DE INICIO:</strong></div><div>${group.startDate}</div>
                            <div><strong>FECHA DE TÉRMINO:</strong></div><div>${group.endDate}</div>
                            <div><strong>HORARIO:</strong></div><div>${group.schedule || 'Sábados y Domingos'}</div>
                            <div><strong>DURACIÓN:</strong></div><div>${group.hours} HORAS</div>
                            <div><strong>NOTA:</strong></div><div><strong>${average.toFixed(2)}</strong></div>
                            <div><strong>GRUPO:</strong></div><div>${group.code}</div>
                        </div>
                        
                        <p style="margin: 20px 0; text-align: justify; font-size: 0.95rem; font-style: italic;">
                            Se expide el presente a solicitud del interesado (a), para los fines que estime conveniente.
                        </p>
                        
                        <p style="font-size: 0.95rem; margin-top: 20px; color: #555; text-align: right;">
                            ${issueDateFormatted}
                        </p>
                    </div>

                    <!-- Firmas con Sellos Coherentes -->
                    <div style="margin-top: 40px; display: flex; justify-content: space-around; align-items: flex-end; gap: 20px; position: relative;">
                        
                        <!-- Firma Decano -->
                        <div style="display: flex; flex-direction: column; align-items: center; width: 280px; position: relative;">
                            <!-- Sello Decanato de fondo -->
                            <div style="position: absolute; left: 40px; top: -15px; pointer-events: none; z-index: 1;">
                                ${cert.deanSigned ? `
                                <svg viewBox="0 0 100 100" style="width: 75px; height: 75px; opacity: 0.28;">
                                  <circle cx="50" cy="50" r="45" fill="none" stroke="#008080" stroke-width="1.5"/>
                                  <circle cx="50" cy="50" r="41" fill="none" stroke="#008080" stroke-dasharray="2 1" stroke-width="0.5"/>
                                  <circle cx="50" cy="50" r="28" fill="none" stroke="#008080" stroke-width="1"/>
                                  <path id="decTextPathTop" d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="none"/>
                                  <path id="decTextPathBottom" d="M 88 50 A 38 38 0 0 1 12 50" fill="none" stroke="none"/>
                                  <text font-family="'Arial', sans-serif" font-size="6" fill="#008080" font-weight="bold">
                                    <textPath href="#decTextPathTop" startOffset="50%" text-anchor="middle">UNIVERSIDAD NACIONAL DE PIURA</textPath>
                                  </text>
                                  <text font-family="'Arial', sans-serif" font-size="5" fill="#008080" font-weight="bold">
                                    <textPath href="#decTextPathBottom" startOffset="50%" text-anchor="middle">FAC. INGENIERIA INDUSTRIAL</textPath>
                                  </text>
                                  <text x="50" y="48" font-family="'Arial', sans-serif" font-size="7" font-weight="bold" fill="#008080" text-anchor="middle">DECANATO</text>
                                  <text x="50" y="59" font-family="'Arial', sans-serif" font-size="8" fill="#008080" text-anchor="middle">🎓</text>
                                </svg>
                                ` : ''}
                            </div>
                            <div style="height: 50px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2;">
                                ${cert.deanSigned 
                                    ? `<span style="font-family: 'Brush Script MT', 'Great Vibes', cursive; font-size: 2.2rem; color: #1e5ba8; transform: rotate(-3deg); font-style: italic; user-select: none;">F. Cruz V.</span>` 
                                    : `<span style="color: #c62828; font-size: 0.8rem; font-style: italic; border: 1px dashed rgba(211,47,47,0.3); padding: 4px 8px; border-radius:4px; background:rgba(211,47,47,0.05);">⚠️ Pendiente de firma</span>`}
                            </div>
                            <div style="width: 100%; border-top: 1px solid #777; margin-top: 5px; padding-top: 5px; text-align: center; font-size: 0.75rem; line-height: 1.3; position: relative; z-index: 2;">
                                <strong>DR. FRANCISCO JAVIER CRUZ VILCHEZ</strong><br>
                                Decano de la Facultad de Ing. Industrial
                            </div>
                        </div>

                        <!-- Firma Director -->
                        <div style="display: flex; flex-direction: column; align-items: center; width: 280px; position: relative;">
                            <!-- Sello Instituto de fondo -->
                            <div style="position: absolute; left: 40px; top: -15px; pointer-events: none; z-index: 1;">
                                ${cert.directorSigned ? `
                                <svg viewBox="0 0 100 100" style="width: 75px; height: 75px; opacity: 0.28;">
                                  <circle cx="50" cy="50" r="45" fill="none" stroke="#003d82" stroke-width="1.5"/>
                                  <circle cx="50" cy="50" r="41" fill="none" stroke="#003d82" stroke-dasharray="2 1" stroke-width="0.5"/>
                                  <circle cx="50" cy="50" r="28" fill="none" stroke="#003d82" stroke-width="1"/>
                                  <path id="dirTextPathTop" d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="none"/>
                                  <path id="dirTextPathBottom" d="M 88 50 A 38 38 0 0 1 12 50" fill="none" stroke="none"/>
                                  <text font-family="'Arial', sans-serif" font-size="6" fill="#003d82" font-weight="bold">
                                    <textPath href="#dirTextPathTop" startOffset="50%" text-anchor="middle">UNIVERSIDAD NACIONAL DE PIURA</textPath>
                                  </text>
                                  <text font-family="'Arial', sans-serif" font-size="5" fill="#003d82" font-weight="bold">
                                    <textPath href="#dirTextPathBottom" startOffset="50%" text-anchor="middle">FAC. INGENIERIA INDUSTRIAL</textPath>
                                  </text>
                                  <text x="50" y="46" font-family="'Arial', sans-serif" font-size="5" font-weight="bold" fill="#003d82" text-anchor="middle">INSTITUTO DE</text>
                                  <text x="50" y="53" font-family="'Arial', sans-serif" font-size="5" font-weight="bold" fill="#003d82" text-anchor="middle">INFORMATICA</text>
                                  <text x="50" y="62" font-family="'Arial', sans-serif" font-size="7" fill="#003d82" text-anchor="middle">💻</text>
                                </svg>
                                ` : ''}
                            </div>
                            <div style="height: 50px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2;">
                                ${cert.directorSigned 
                                    ? `<span style="font-family: 'Brush Script MT', 'Great Vibes', cursive; font-size: 2.2rem; color: #003d82; transform: rotate(-3deg); font-style: italic; user-select: none;">J. Nima R.</span>` 
                                    : `<span style="color: #c62828; font-size: 0.8rem; font-style: italic; border: 1px dashed rgba(211,47,47,0.3); padding: 4px 8px; border-radius:4px; background:rgba(211,47,47,0.05);">⚠️ Pendiente de firma</span>`}
                            </div>
                            <div style="width: 100%; border-top: 1px solid #777; margin-top: 5px; padding-top: 5px; text-align: center; font-size: 0.75rem; line-height: 1.3; position: relative; z-index: 2;">
                                <strong>DR. JONATHAN DAVID NIMA RAMOS</strong><br>
                                Director del Instituto de Informática
                            </div>
                        </div>
                    </div>

                    <!-- Footer / Validación -->
                    <div style="margin-top: 35px; border-top: 1px solid #ccc; padding-top: 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #666;">
                        <span>CAMPUS UNIVERSITARIO - MIRAFLORES - CASTILLA - PIURA</span>
                        <strong style="font-family: 'Courier New', monospace;">CONS. Nº ${cert.code}</strong>
                    </div>
                </div>
            `;
        }
        
        preview.innerHTML = htmlContent;

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('certificateModal').style.display = 'block';
    }

    openCertificateModal() {
        const selectedRow = document.querySelector('#certificatesTableBody tr.selected-row');
        if (!selectedRow) {
            this.showToast('Seleccione un alumno aprobado en la tabla', 'error');
            return;
        }

        const studentId = selectedRow.getAttribute('data-student-id');
        const groupId = selectedRow.getAttribute('data-group-id');
        const type = selectedRow.getAttribute('data-type');

        const student = DataManager.getStudentById(studentId);
        const group = DataManager.getGroupById(groupId);

        if (student && group) {
            document.getElementById('emitStudentId').value = studentId;
            document.getElementById('emitGroupId').value = groupId;
            document.getElementById('emitStudentName').value = `${student.firstName} ${student.lastName}`;
            document.getElementById('emitGroupName').value = `${group.courseName} (${group.code})`;
            document.getElementById('emitDocType').value = type || 'certificado';

            document.getElementById('modalOverlay').style.display = 'block';
            document.getElementById('emitCertModal').style.display = 'block';
        }
    }

    handleEmitCertSubmit(e) {
        e.preventDefault();
        const studentId = document.getElementById('emitStudentId').value;
        const groupId = document.getElementById('emitGroupId').value;
        const type = document.getElementById('emitDocType').value;

        // Check if certificate/constancia already exists active
        const exists = mockData.certificates.some(c => 
            c.studentId === studentId && 
            c.groupId === groupId && 
            c.type === type && 
            c.status !== 'annulled'
        );

        if (exists) {
            this.showToast(`Ya se ha emitido o solicitado un(a) ${type} para este alumno en este grupo.`, 'error');
            this.closeModal();
            return;
        }

        // Create new certificate record in status 'toBeSigned'
        const cert = DataManager.createCertificate({
            studentId,
            groupId,
            type,
            status: 'toBeSigned',
            deanSigned: false,
            directorSigned: false,
            issueDate: new Date().toISOString().split('T')[0]
        });

        if (cert) {
            this.showToast('Documento preparado y enviado a firma del Decano y Director.', 'success');
            this.closeModal();
            this.loadCertificates();
            
            // Disable emit button
            const emitBtn = document.getElementById('emitCertBtn');
            if (emitBtn) emitBtn.setAttribute('disabled', 'true');
        } else {
            this.showToast('Error al crear el documento.', 'error');
        }
    }

    signDocument(certId, role) {
        const cert = mockData.certificates.find(c => c.id === certId);
        if (!cert) return;

        const today = new Date().toISOString().split('T')[0];

        if (role === 'dean') {
            cert.deanSigned = true;
            cert.deanSignedAt = today;
            cert.deanSignerName = 'DR. FRANCISCO JAVIER CRUZ VILCHEZ';
            this.showToast('Documento firmado por el Decano', 'success');
        } else if (role === 'director') {
            cert.directorSigned = true;
            cert.directorSignedAt = today;
            cert.directorSignerName = 'DR. JONATHAN DAVID NIMA RAMOS';
            this.showToast('Documento firmado por el Director', 'success');
        }

        // Re-evaluate status automatically if both signed
        if (cert.deanSigned && cert.directorSigned) {
            cert.status = 'pending';
            this.showToast('Firma completa. El documento se encuentra en estado Pendiente listo para ser emitido.', 'success');
        }

        this.loadCertificates();
    }

    openCertObservationModal(certId) {
        document.getElementById('obsCertId').value = certId;
        const cert = mockData.certificates.find(c => c.id === certId);
        document.getElementById('certObsText').value = cert ? cert.observations || '' : '';
        
        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('certObsModal').style.display = 'block';
    }

    submitCertObservation() {
        const certId = document.getElementById('obsCertId').value;
        const text = document.getElementById('certObsText').value.trim();

        const cert = mockData.certificates.find(c => c.id === certId);
        if (cert) {
            cert.observations = text;
            this.showToast('Observación del Decano guardada correctamente', 'success');
            this.closeModal();
            this.loadCertificates();
        }
    }

    formatDateToSpanish(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let formatted = d.toLocaleDateString('es-PE', options);
        // Capitalize first letter of weekday
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        return 'Piura, ' + formatted;
    }

    // ========== REPORTS MODULE ==========
    loadReports() {
        const reportTableBody = document.getElementById('reportTableBody');
        if (reportTableBody) {
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
                        if (average >= mockData.settings.minPassingGrade) {
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

        // Calculate and display top KPI stats
        this.updateReportKPIs();

        // Load saved reports
        this.loadSavedReportsTable();
    }

    updateReportKPIs() {
        const totalStudents = mockData.students.length;
        let approvedCount = 0;
        let disapprovedCount = 0;
        let sumAverage = 0;
        let gradeCount = 0;

        mockData.enrollments.forEach(enr => {
            const group = DataManager.getGroupById(enr.groupId);
            if (!group) return;
            const course = DataManager.getCourseById(group.courseId);
            if (!course) return;

            const gradeRecord = mockData.grades.find(g => g.groupId === enr.groupId && g.studentId === enr.studentId);
            if (gradeRecord) {
                const average = DataManager.calculateAverage(gradeRecord.moduleGrades, course);
                sumAverage += average;
                gradeCount++;
                if (average >= mockData.settings.minPassingGrade) {
                    approvedCount++;
                } else {
                    disapprovedCount++;
                }
            }
        });

        const generalAverage = gradeCount > 0 ? (sumAverage / gradeCount).toFixed(1) : '0';
        const certCount = mockData.certificates.length;

        // Calculate average attendance
        let totalAttDays = 0;
        let totalPresentDays = 0;
        mockData.studentAttendanceByGroup.forEach(att => {
            const enrolled = DataManager.getEnrolledStudentsByGroup(att.groupId).length;
            const daysCount = att.days.length;
            totalAttDays += enrolled * daysCount;

            att.students.forEach(st => {
                att.days.forEach(d => {
                    const status = st.attendance[d];
                    if (status === 'presente' || status === 'tarde') {
                        totalPresentDays++;
                    }
                });
            });
        });
        const avgAttendance = totalAttDays > 0 ? Math.round((totalPresentDays / totalAttDays) * 100) + '%' : '100%';

        if (document.getElementById('reportTotalStudents')) document.getElementById('reportTotalStudents').textContent = totalStudents;
        if (document.getElementById('reportApproved')) document.getElementById('reportApproved').textContent = approvedCount;
        if (document.getElementById('reportDisapproved')) document.getElementById('reportDisapproved').textContent = disapprovedCount;
        if (document.getElementById('reportGeneralAverage')) document.getElementById('reportGeneralAverage').textContent = generalAverage;
        if (document.getElementById('reportCertificates')) document.getElementById('reportCertificates').textContent = certCount;
        if (document.getElementById('reportAvgAttendance')) document.getElementById('reportAvgAttendance').textContent = avgAttendance;
    }

    loadSavedReportsTable() {
        const tbody = document.getElementById('savedReportsTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const reports = DataManager.getSavedReports();
        
        const typeLabels = {
            attendance: 'Asistencia de Alumnos',
            grades: 'Notas y Calificaciones',
            certificates: 'Certificados Emitidos',
            enrollments: 'Matrículas'
        };

        if (reports.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--color-text-secondary);">No hay reportes personalizados guardados</td></tr>';
            return;
        }

        reports.forEach(rep => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${rep.name}</strong></td>
                <td>${typeLabels[rep.type] || rep.type}</td>
                <td>${rep.createdBy}</td>
                <td>${rep.createdAt}</td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-view" onclick="app.viewReportPreview('${rep.id}')" title="Ver Reporte">&#128269;</button>
                        <button class="icon-btn icon-edit" onclick="app.editReport('${rep.id}')" title="Editar Configuración">&#9998;</button>
                        <button class="icon-btn icon-delete" onclick="app.deleteReport('${rep.id}')" title="Eliminar">&#128683;</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    openNewReportModal() {
        const form = document.getElementById('reportForm');
        form.reset();
        document.getElementById('reportModalTitle').textContent = 'Nuevo Reporte Personalizado';
        this._editingReportId = null;

        // Populate courses select filter in report modal
        const courseSelect = document.getElementById('reportFilterCourse');
        courseSelect.innerHTML = '<option value="">Todos los cursos</option>';
        DataManager.getCourses().forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            courseSelect.appendChild(opt);
        });

        this.onReportTypeChange('attendance');

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('reportModal').style.display = 'block';
    }

    onReportTypeChange(type) {
        const minAttContainer = document.getElementById('repAttMinContainer');
        if (type === 'attendance') {
            minAttContainer.style.display = 'block';
        } else {
            minAttContainer.style.display = 'none';
        }
    }

    handleReportSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('reportName').value.trim();
        const type = document.getElementById('reportType').value;
        const courseId = document.getElementById('reportFilterCourse').value;
        const minAtt = document.getElementById('reportFilterMinAtt').value;

        const reportData = {
            name: name,
            type: type,
            createdBy: DataManager.currentUser ? DataManager.currentUser.fullName : 'Admin',
            queryConfig: {
                courseId: courseId,
                minAtt: type === 'attendance' ? Number(minAtt) : null
            }
        };

        if (this._editingReportId) {
            DataManager.updateReport(this._editingReportId, reportData);
            this.showToast('Reporte actualizado correctamente', 'success');
        } else {
            DataManager.createReport(reportData);
            this.showToast('Reporte guardado correctamente', 'success');
        }

        this.closeModal();
        this.loadReports();
    }

    editReport(id) {
        this._editingReportId = id;
        const rep = DataManager.getSavedReports().find(r => r.id === id);
        if (!rep) return;

        document.getElementById('reportModalTitle').textContent = 'Editar Reporte Personalizado';
        document.getElementById('reportName').value = rep.name;
        document.getElementById('reportType').value = rep.type;

        // Populate courses select filter
        const courseSelect = document.getElementById('reportFilterCourse');
        courseSelect.innerHTML = '<option value="">Todos los cursos</option>';
        DataManager.getCourses().forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            if (c.id === rep.queryConfig.courseId) {
                opt.selected = true;
            }
            courseSelect.appendChild(opt);
        });

        this.onReportTypeChange(rep.type);
        if (rep.type === 'attendance' && rep.queryConfig.minAtt) {
            document.getElementById('reportFilterMinAtt').value = rep.queryConfig.minAtt;
        }

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('reportModal').style.display = 'block';
    }

    deleteReport(id) {
        if (confirm('¿Eliminar este reporte guardado?')) {
            DataManager.deleteReport(id);
            this.showToast('Reporte eliminado', 'success');
            this.loadReports();
        }
    }

    viewReportPreview(id) {
        const rep = DataManager.getSavedReports().find(r => r.id === id);
        if (!rep) return;

        document.getElementById('reportPreviewTitle').textContent = rep.name;
        const typeLabels = {
            attendance: 'Asistencia de Alumnos',
            grades: 'Notas y Calificaciones',
            certificates: 'Certificados Emitidos',
            enrollments: 'Matrículas'
        };
        document.getElementById('reportPreviewType').textContent = typeLabels[rep.type] || rep.type;
        document.getElementById('reportPreviewDate').textContent = rep.createdAt;

        const tableHead = document.getElementById('reportPreviewTableHead');
        const tableBody = document.getElementById('reportPreviewTableBody');
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        const courseId = rep.queryConfig.courseId;

        if (rep.type === 'attendance') {
            tableHead.innerHTML = `
                <tr>
                    <th>Fecha</th>
                    <th>Alumno</th>
                    <th>Código</th>
                    <th>Grupo</th>
                    <th>Curso</th>
                    <th>Estado</th>
                    <th>Detalle</th>
                </tr>
            `;

            let rowsCount = 0;
            mockData.studentAttendanceByGroup.forEach(att => {
                const group = DataManager.getGroupById(att.groupId);
                if (courseId && group.courseId !== courseId) return;

                att.students.forEach(st => {
                    const student = DataManager.getStudentById(st.studentId);
                    att.days.forEach(d => {
                        const status = st.attendance[d];
                        // If it matches risk or just list all
                        const attPct = DataManager.calculateAttendancePercentage(st.studentId, att.groupId);
                        if (rep.queryConfig.minAtt && attPct >= rep.queryConfig.minAtt) return;

                        rowsCount++;
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${d}</td>
                            <td>${student.firstName} ${student.lastName}</td>
                            <td>${student.code}</td>
                            <td>${group.code}</td>
                            <td>${group.courseName}</td>
                            <td><span class="badge-status ${status === 'presente' ? 'badge-active' : status === 'tarde' ? 'badge-pending' : 'badge-inactive'}">${(status || 'falta').toUpperCase()}</span></td>
                            <td>Asistencia global: ${attPct}%</td>
                        `;
                        tableBody.appendChild(row);
                    });
                });
            });

            if (rowsCount === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No se encontraron registros de inasistencias</td></tr>';
            }

        } else if (rep.type === 'grades') {
            tableHead.innerHTML = `
                <tr>
                    <th>Alumno</th>
                    <th>Código</th>
                    <th>Grupo</th>
                    <th>Curso</th>
                    <th>Promedio</th>
                    <th>Estado</th>
                </tr>
            `;

            let rowsCount = 0;
            mockData.enrollments.forEach(enr => {
                const group = DataManager.getGroupById(enr.groupId);
                if (courseId && group.courseId !== courseId) return;

                const student = DataManager.getStudentById(enr.studentId);
                const course = DataManager.getCourseById(group.courseId);
                const gradeRecord = mockData.grades.find(g => g.groupId === enr.groupId && g.studentId === enr.studentId);
                const average = gradeRecord ? DataManager.calculateAverage(gradeRecord.moduleGrades, course) : 0;
                const status = average >= mockData.settings.minPassingGrade ? 'APROBADO' : 'DESAPROBADO';

                rowsCount++;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.firstName} ${student.lastName}</td>
                    <td>${student.code}</td>
                    <td>${group.code}</td>
                    <td>${group.courseName}</td>
                    <td><strong>${average > 0 ? average.toFixed(1) : '-'}</strong></td>
                    <td><span class="badge-status ${average >= mockData.settings.minPassingGrade ? 'badge-active' : 'badge-inactive'}">${status}</span></td>
                `;
                tableBody.appendChild(row);
            });

            if (rowsCount === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem;">No se encontraron registros de notas</td></tr>';
            }

        } else if (rep.type === 'certificates') {
            tableHead.innerHTML = `
                <tr>
                    <th>Alumno</th>
                    <th>Código</th>
                    <th>Curso</th>
                    <th>Modalidad</th>
                    <th>Certificado Código</th>
                    <th>Fecha Emisión</th>
                </tr>
            `;

            let rowsCount = 0;
            mockData.certificates.forEach(cert => {
                const student = DataManager.getStudentById(cert.studentId);
                const group = DataManager.getGroupById(cert.groupId);
                if (courseId && group.courseId !== courseId) return;

                rowsCount++;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.firstName} ${student.lastName}</td>
                    <td>${student.code}</td>
                    <td>${group.courseName}</td>
                    <td>${group.modality === 'regular' ? 'Curso regular' : 'Examen'}</td>
                    <td><strong>${cert.code}</strong></td>
                    <td>${new Date(cert.issueDate).toLocaleDateString()}</td>
                `;
                tableBody.appendChild(row);
            });

            if (rowsCount === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem;">No hay certificados registrados para el filtro seleccionado</td></tr>';
            }

        } else if (rep.type === 'enrollments') {
            tableHead.innerHTML = `
                <tr>
                    <th>Alumno</th>
                    <th>Código</th>
                    <th>DNI</th>
                    <th>Grupo</th>
                    <th>Curso</th>
                    <th>Fecha Matrícula</th>
                    <th>Estado</th>
                </tr>
            `;

            let rowsCount = 0;
            mockData.enrollments.forEach(enr => {
                const student = DataManager.getStudentById(enr.studentId);
                const group = DataManager.getGroupById(enr.groupId);
                if (courseId && group.courseId !== courseId) return;

                rowsCount++;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.firstName} ${student.lastName}</td>
                    <td>${student.code}</td>
                    <td>${student.dni}</td>
                    <td>${group.code}</td>
                    <td>${group.courseName}</td>
                    <td>${enr.enrollmentDate}</td>
                    <td><span class="badge-status badge-active">Activo</span></td>
                `;
                tableBody.appendChild(row);
            });

            if (rowsCount === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">No hay matrículas registradas para el filtro seleccionado</td></tr>';
            }
        }

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('reportPreviewModal').style.display = 'block';
    }

    exportReportSimulated(format) {
        this.showToast(`Reporte exportado correctamente en formato ${format.toUpperCase()} (Simulado)`, 'success');
    }

    // ========== USERS AND ROLES MODULE ==========
    switchUsersTab(tab) {
        const usersPanel = document.getElementById('usersPanel');
        const rolesPanel = document.getElementById('rolesPanel');
        const tabUsersBtn = document.getElementById('tabUsersBtn');
        const tabRolesBtn = document.getElementById('tabRolesBtn');

        if (tab === 'users') {
            usersPanel.style.display = 'block';
            rolesPanel.style.display = 'none';
            tabUsersBtn.classList.add('active');
            tabRolesBtn.classList.remove('active');
            tabUsersBtn.style.borderBottom = '3px solid var(--color-primary)';
            tabRolesBtn.style.borderBottom = 'none';
            tabUsersBtn.style.color = 'var(--color-text-primary)';
            tabRolesBtn.style.color = 'var(--color-text-secondary)';
            this.loadUsers();
        } else {
            usersPanel.style.display = 'none';
            rolesPanel.style.display = 'block';
            tabUsersBtn.classList.remove('active');
            tabRolesBtn.classList.add('active');
            tabUsersBtn.style.borderBottom = 'none';
            tabRolesBtn.style.borderBottom = '3px solid var(--color-primary)';
            tabUsersBtn.style.color = 'var(--color-text-secondary)';
            tabRolesBtn.style.color = 'var(--color-text-primary)';
            this.loadRoles();
        }
    }

    loadUsers() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const roleLabels = {
            'admin': 'Administrador',
            'secretary': 'Secretaria Académica',
            'teacher': 'Docente',
            'coordinator': 'Coordinador Académico'
        };

        mockData.users.forEach(user => {
            const statusLabel = user.status === 'active' ? 'Activo' : 'Inactivo';
            const statusClass = user.status === 'active' ? 'badge-active' : 'badge-inactive';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.fullName}</td>
                <td>
                    <span class="badge-status badge-active" style="background-color: var(--color-primary-light); color: white;">
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

    openNewUserModal() {
        const form = document.getElementById('userForm');
        form.reset();
        document.getElementById('userModalTitle').textContent = 'Nuevo Usuario';
        document.getElementById('userUsername').readOnly = false;
        this._editingUserId = null;

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('userFormModal').style.display = 'block';
    }

    editUser(userId) {
        this._editingUserId = userId;
        const user = mockData.users.find(u => u.id === userId);
        if (!user) return;

        document.getElementById('userModalTitle').textContent = 'Editar Usuario';
        document.getElementById('userUsername').value = user.username;
        document.getElementById('userUsername').readOnly = true;
        document.getElementById('userFullName').value = user.fullName;
        document.getElementById('userPassword').value = user.password;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userStatus').value = user.status;

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('userFormModal').style.display = 'block';
    }

    handleUserSubmit(e) {
        e.preventDefault();
        const username = document.getElementById('userUsername').value.trim();
        const fullName = document.getElementById('userFullName').value.trim();
        const password = document.getElementById('userPassword').value;
        const email = document.getElementById('userEmail').value.trim();
        const role = document.getElementById('userRole').value;
        const status = document.getElementById('userStatus').value;

        const userData = { username, fullName, password, email, role, status };

        if (this._editingUserId) {
            DataManager.updateUser(this._editingUserId, userData);
            this.showToast('Usuario actualizado correctamente', 'success');
        } else {
            // Check duplicate username
            const duplicate = mockData.users.some(u => u.username.toLowerCase() === username.toLowerCase());
            if (duplicate) {
                this.showToast('El nombre de usuario ya está registrado', 'error');
                return;
            }
            DataManager.createUser(userData);
            this.showToast('Usuario creado correctamente', 'success');
        }

        this.closeModal();
        this.loadUsers();
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

    loadRoles() {
        const tbody = document.getElementById('rolesTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const roles = DataManager.getRoles();
        roles.forEach(role => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${role.id.toUpperCase()}</strong></td>
                <td>${role.name}</td>
                <td>
                    <div style="max-width: 450px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${role.permissions.join(', ')}">
                        ${role.permissions.map(p => `<span class="badge-status badge-active" style="margin-right:4px; font-size:0.75rem; background-color: var(--color-bg-tertiary); color: var(--color-text-primary); border: 1px solid var(--color-border);">${p}</span>`).join('')}
                    </div>
                </td>
                <td>
                    <div class="action-icons">
                        <button class="icon-btn icon-edit" onclick="app.editRole('${role.id}')" title="Editar Permisos">&#9998;</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editRole(roleId) {
        this._editingRoleId = roleId;
        const role = DataManager.getRoles().find(r => r.id === roleId);
        if (!role) return;

        document.getElementById('roleNameInput').value = role.name;

        const listContainer = document.getElementById('rolePermissionsList');
        listContainer.innerHTML = '';

        const allViews = [
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'students', label: 'Gestión de Alumnos' },
            { id: 'courses', label: 'Cursos y Módulos' },
            { id: 'teachers', label: 'Gestión de Docentes' },
            { id: 'groups', label: 'Grupos Académicos' },
            { id: 'enrollments', label: 'Matrículas' },
            { id: 'attendance', label: 'Asistencia de Alumnos' },
            { id: 'grades', label: 'Registro de Notas' },
            { id: 'certificates', label: 'Certificados y Constancias' },
            { id: 'reports', label: 'Reportes y Estadísticas' },
            { id: 'users', label: 'Usuarios y Accesos' },
            { id: 'settings', label: 'Configuración' }
        ];

        allViews.forEach(v => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.gap = '8px';

            const checked = role.permissions.includes(v.id) ? 'checked' : '';
            div.innerHTML = `
                <input type="checkbox" id="perm_${v.id}" value="${v.id}" ${checked}>
                <label for="perm_${v.id}">${v.label}</label>
            `;
            listContainer.appendChild(div);
        });

        document.getElementById('modalOverlay').style.display = 'block';
        document.getElementById('roleModal').style.display = 'block';
    }

    handleRoleSubmit(e) {
        e.preventDefault();
        const roleId = this._editingRoleId;
        const checkboxes = document.querySelectorAll('#rolePermissionsList input[type="checkbox"]');
        const selectedPermissions = [];
        checkboxes.forEach(cb => {
            if (cb.checked) {
                selectedPermissions.push(cb.value);
            }
        });

        const success = DataManager.updateRolePermissions(roleId, selectedPermissions);
        if (success) {
            this.showToast('Permisos de rol actualizados', 'success');
            this.closeModal();
            this.loadRoles();
            
            // Reapply permissions immediately if current active role is the edited one
            if (DataManager.currentUser && DataManager.currentUser.role === roleId) {
                this.setRolePermissions(roleId);
            }
        } else {
            this.showToast('Error al actualizar permisos', 'error');
        }
    }

    // ========== SETTINGS MODULE ==========
    loadSettings() {
        const sets = DataManager.getSettings();
        if (!sets) return;

        document.getElementById('settingsSystemName').value = sets.systemName;
        document.getElementById('settingsInstituteName').value = sets.instituteName;
        document.getElementById('settingsUniversityName').value = sets.universityName;
        document.getElementById('settingsEmail').value = sets.instituteEmail;
        document.getElementById('settingsPhone').value = sets.institutePhone;
        document.getElementById('settingsAcademicPeriod').value = sets.academicPeriod;
        document.getElementById('settingsMinPassingGrade').value = sets.minPassingGrade;
        document.getElementById('settingsMinAttendanceRequired').value = sets.minAttendanceRequired;
        document.getElementById('settingsResponsibleAcademic').value = sets.responsibleAcademic;
        document.getElementById('settingsEnableNotifications').checked = sets.enableNotifications;
        document.getElementById('settingsEnableAutoSave').checked = sets.enableAutoSave;
        document.getElementById('settingsDefaultTheme').value = sets.defaultTheme;
        document.getElementById('settingsLanguage').value = sets.systemLanguage;
    }

    saveSystemSettings() {
        const systemName = document.getElementById('settingsSystemName').value.trim();
        const instituteName = document.getElementById('settingsInstituteName').value.trim();
        const universityName = document.getElementById('settingsUniversityName').value.trim();
        const email = document.getElementById('settingsEmail').value.trim();
        const phone = document.getElementById('settingsPhone').value.trim();
        const academicPeriod = document.getElementById('settingsAcademicPeriod').value.trim();
        const minPassingGrade = Number(document.getElementById('settingsMinPassingGrade').value);
        const minAttendanceRequired = Number(document.getElementById('settingsMinAttendanceRequired').value);
        const responsible = document.getElementById('settingsResponsibleAcademic').value.trim();
        const notifications = document.getElementById('settingsEnableNotifications').checked;
        const autoSave = document.getElementById('settingsEnableAutoSave').checked;
        const defaultTheme = document.getElementById('settingsDefaultTheme').value;
        const language = document.getElementById('settingsLanguage').value;

        const updatedSettings = {
            systemName, instituteName, universityName,
            instituteEmail: email, institutePhone: phone,
            academicPeriod, minPassingGrade, minAttendanceRequired,
            responsibleAcademic: responsible,
            enableNotifications: notifications,
            enableAutoSave: autoSave,
            defaultTheme, systemLanguage: language
        };

        DataManager.saveSettings(updatedSettings);
        this.showToast('Configuración guardada correctamente', 'success');

        // Apply visual updates immediately
        document.querySelector('.header-institution-label').textContent = `${systemName} - Sistema Administrativo del ${instituteName} — UNP`;
        
        // Apply theme if requested
        if (defaultTheme === 'dark' && !this.isDarkMode) {
            this.toggleTheme();
        } else if (defaultTheme === 'light' && this.isDarkMode) {
            this.toggleTheme();
        }

        this.loadSettings();
    }

    restoreDefaultSettings() {
        if (confirm('¿Restaurar todos los valores de configuración por defecto?')) {
            const defaults = DataManager.restoreDefaultSettings();
            this.loadSettings();
            this.showToast('Valores restaurados por defecto', 'success');
            
            // Reapply system name labels
            document.querySelector('.header-institution-label').textContent = `${defaults.systemName} - Sistema Administrativo del ${defaults.instituteName} — UNP`;
            if (defaults.defaultTheme === 'light' && this.isDarkMode) {
                this.toggleTheme();
            }
        }
    }

    // ========== MODAL MANAGEMENT ==========
    closeModal() {
        document.getElementById('modalOverlay').style.display = 'none';
        document.querySelectorAll('.modal').forEach(m => {
            m.style.display = 'none';
            m.classList.remove('modal-fullscreen');
        });
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

// Global helpers to map HTML inline event handlers
window.closeModal = () => app.closeModal();
