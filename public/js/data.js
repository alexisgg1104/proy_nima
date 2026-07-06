// SAII Mock Data
const mockData = {
    // Current logged-in user
    currentUser: {
        id: 'USR001',
        username: 'admin',
        fullName: 'Administrador Principal',
        email: 'admin@institutoinformatica.edu.pe',
        role: 'admin',
        lastLogin: new Date()
    },

    // Students
    students: [
        { id: 'ALU001', code: '2024001000', dni: '12345678', firstName: 'Juan', lastName: 'Pérez García', email: 'juan.perez@student.edu.pe', phone: '987654321', cycle: 'I', promotion: '2024', status: 'active', observations: '' },
        { id: 'ALU002', code: '2024002000', dni: '23456789', firstName: 'María', lastName: 'López Rodríguez', email: 'maria.lopez@student.edu.pe', phone: '987654322', cycle: 'II', promotion: '2024', status: 'active', observations: '' },
        { id: 'ALU003', code: '2024003000', dni: '34567890', firstName: 'Carlos', lastName: 'Martínez Sánchez', email: 'carlos.martinez@student.edu.pe', phone: '987654323', cycle: 'I', promotion: '2023', status: 'active', observations: '' },
        { id: 'ALU004', code: '2024004000', dni: '45678901', firstName: 'Ana', lastName: 'García Flores', email: 'ana.garcia@student.edu.pe', phone: '987654324', cycle: 'III', promotion: '2024', status: 'active', observations: '' },
        { id: 'ALU005', code: '2024005000', dni: '56789012', firstName: 'Pedro', lastName: 'Gutiérrez López', email: 'pedro.gutierrez@student.edu.pe', phone: '987654325', cycle: 'II', promotion: '2023', status: 'inactive', observations: 'Solicitud de retiro' },
        { id: 'ALU006', code: '2024006000', dni: '67890123', firstName: 'Rosa', lastName: 'Hernández Torres', email: 'rosa.hernandez@student.edu.pe', phone: '987654326', cycle: 'IV', promotion: '2022', status: 'active', observations: '' },
        { id: 'ALU007', code: '2024007000', dni: '78901234', firstName: 'Diego', lastName: 'Ramírez Cruz', email: 'diego.ramirez@student.edu.pe', phone: '987654327', cycle: 'I', promotion: '2024', status: 'active', observations: '' },
        { id: 'ALU008', code: '2024008000', dni: '89012345', firstName: 'Sofia', lastName: 'Castillo Mendoza', email: 'sofia.castillo@student.edu.pe', phone: '987654328', cycle: 'II', promotion: '2024', status: 'active', observations: '' },
        { id: 'ALU009', code: '2024009000', dni: '90123456', firstName: 'Luis', lastName: 'Vargas Ruiz', email: 'luis.vargas@student.edu.pe', phone: '987654329', cycle: 'III', promotion: '2023', status: 'active', observations: '' },
        { id: 'ALU010', code: '2024010000', dni: '01234567', firstName: 'Carmen', lastName: 'Jiménez Morales', email: 'carmen.jimenez@student.edu.pe', phone: '987654330', cycle: 'I', promotion: '2024', status: 'active', observations: '' },
    ],

    // Courses
    courses: [
        {
            id: 'CRS001',
            code: 'CB001',
            name: 'Computación Básica',
            description: 'Curso fundamental de informática',
            totalHours: 120,
            status: 'active',
            modules: [
                { id: 'MOD001', name: 'Windows', percentage: 20 },
                { id: 'MOD002', name: 'Word', percentage: 40 },
                { id: 'MOD003', name: 'Excel', percentage: 40 }
            ]
        },
        {
            id: 'CRS002',
            code: 'MO001',
            name: 'Microsoft Office',
            description: 'Aplicaciones de productividad',
            totalHours: 150,
            status: 'active',
            modules: [
                { id: 'MOD004', name: 'Windows', percentage: 10 },
                { id: 'MOD005', name: 'Word', percentage: 20 },
                { id: 'MOD006', name: 'Excel', percentage: 25 },
                { id: 'MOD007', name: 'Access', percentage: 20 },
                { id: 'MOD008', name: 'PowerPoint', percentage: 15 },
                { id: 'MOD009', name: 'Internet', percentage: 10 }
            ]
        },
        {
            id: 'CRS003',
            code: 'CI001',
            name: 'Computación para Ingenieros',
            description: 'Herramientas computacionales para ingeniería',
            totalHours: 160,
            status: 'active',
            modules: [
                { id: 'MOD010', name: 'Windows', percentage: 10 },
                { id: 'MOD011', name: 'Word', percentage: 20 },
                { id: 'MOD012', name: 'Excel', percentage: 20 },
                { id: 'MOD013', name: 'Access', percentage: 20 },
                { id: 'MOD014', name: 'PowerPoint', percentage: 10 },
                { id: 'MOD015', name: 'Matlab', percentage: 10 },
                { id: 'MOD016', name: 'Internet', percentage: 10 }
            ]
        }
    ],

    // Teachers
    teachers: [
        { id: 'TCH001', code: 'DOC001', dni: '11111111', firstName: 'Roberto', lastName: 'Silva Acosta', email: 'roberto.silva@institutoinformatica.edu.pe', phone: '987111111', specialty: 'Ofimática', status: 'active' },
        { id: 'TCH002', code: 'DOC002', dni: '22222222', firstName: 'Patricia', lastName: 'Moreno Ruiz', email: 'patricia.moreno@institutoinformatica.edu.pe', phone: '987222222', specialty: 'Programación', status: 'active' },
        { id: 'TCH003', code: 'DOC003', dni: '33333333', firstName: 'Fernando', lastName: 'Gutierrez Palma', email: 'fernando.gutierrez@institutoinformatica.edu.pe', phone: '987333333', specialty: 'Diseño', status: 'active' },
        { id: 'TCH004', code: 'DOC004', dni: '44444444', firstName: 'Lucia', lastName: 'Espinoza Torres', email: 'lucia.espinoza@institutoinformatica.edu.pe', phone: '987444444', specialty: 'Computación básica', status: 'active' },
        { id: 'TCH005', code: 'DOC005', dni: '55555555', firstName: 'Víctor', lastName: 'Campos López', email: 'victor.campos@institutoinformatica.edu.pe', phone: '987555555', specialty: 'Matemática aplicada / Matlab', status: 'active' },
    ],

    // Academic Groups
    groups: [
        { 
            id: 'GRP001', 
            code: 'CB-2024-01', 
            courseId: 'CRS001', 
            courseName: 'Computación Básica',
            teacherId: 'TCH001', 
            teacherName: 'Roberto Silva',
            modality: 'regular',
            schedule: 'Lun-Mié 08:00–10:00',
            startDate: '2024-01-15',
            endDate: '2024-03-15',
            hours: 120,
            maxQuota: 30,
            status: 'inprogress',
            observations: ''
        },
        { 
            id: 'GRP002', 
            code: 'CB-2024-02', 
            courseId: 'CRS001', 
            courseName: 'Computación Básica',
            teacherId: 'TCH004', 
            teacherName: 'Lucia Espinoza',
            modality: 'regular',
            schedule: 'Mar-Jue 10:00–12:00',
            startDate: '2024-02-01',
            endDate: '2024-04-01',
            hours: 120,
            maxQuota: 25,
            status: 'open',
            observations: ''
        },
        { 
            id: 'GRP003', 
            code: 'MO-2024-01', 
            courseId: 'CRS002', 
            courseName: 'Microsoft Office',
            teacherId: 'TCH001', 
            teacherName: 'Roberto Silva',
            modality: 'regular',
            schedule: 'Sáb 08:00–12:00',
            startDate: '2024-01-20',
            endDate: '2024-04-20',
            hours: 150,
            maxQuota: 30,
            status: 'finished',
            observations: ''
        },
        { 
            id: 'GRP004', 
            code: 'CI-2024-01', 
            courseId: 'CRS003', 
            courseName: 'Computación para Ingenieros',
            teacherId: 'TCH005', 
            teacherName: 'Víctor Campos',
            modality: 'regular',
            schedule: 'Lun-Vié 16:00–18:00',
            startDate: '2024-02-10',
            endDate: '2024-05-10',
            hours: 160,
            maxQuota: 20,
            status: 'open',
            observations: ''
        },
        { 
            id: 'GRP005', 
            code: 'CB-2024-SUF', 
            courseId: 'CRS001', 
            courseName: 'Computación Básica',
            teacherId: 'TCH004', 
            teacherName: 'Lucia Espinoza',
            modality: 'exam',
            schedule: '10:00',
            startDate: '2024-03-20',
            endDate: '2024-03-20',
            hours: 2,
            maxQuota: 50,
            status: 'open',
            observations: 'Examen de suficiencia'
        },
    ],

    // Enrollments
    enrollments: [
        { id: 'ENR001', groupId: 'GRP001', studentId: 'ALU001', enrollmentDate: '2024-01-10', status: 'active' },
        { id: 'ENR002', groupId: 'GRP001', studentId: 'ALU002', enrollmentDate: '2024-01-10', status: 'active' },
        { id: 'ENR003', groupId: 'GRP001', studentId: 'ALU003', enrollmentDate: '2024-01-11', status: 'active' },
        { id: 'ENR004', groupId: 'GRP001', studentId: 'ALU004', enrollmentDate: '2024-01-11', status: 'active' },
        { id: 'ENR005', groupId: 'GRP001', studentId: 'ALU007', enrollmentDate: '2024-01-12', status: 'active' },
        { id: 'ENR006', groupId: 'GRP002', studentId: 'ALU005', enrollmentDate: '2024-02-01', status: 'active' },
        { id: 'ENR007', groupId: 'GRP002', studentId: 'ALU006', enrollmentDate: '2024-02-02', status: 'active' },
        { id: 'ENR008', groupId: 'GRP003', studentId: 'ALU001', enrollmentDate: '2024-01-15', status: 'active' },
        { id: 'ENR009', groupId: 'GRP003', studentId: 'ALU008', enrollmentDate: '2024-01-15', status: 'active' },
        { id: 'ENR010', groupId: 'GRP003', studentId: 'ALU009', enrollmentDate: '2024-01-16', status: 'active' },
        { id: 'ENR011', groupId: 'GRP005', studentId: 'ALU001', enrollmentDate: '2024-03-15', status: 'active' },
        { id: 'ENR012', groupId: 'GRP005', studentId: 'ALU002', enrollmentDate: '2024-03-15', status: 'active' },
    ],

    // Student Attendance — Control de Asistencia de Alumnos (Fase 5 - Enfoque Matriz)
    studentAttendanceByGroup: [
        {
            id: "AST-CB-2024-01",
            groupId: "GRP001",
            teacherId: "TCH001",
            status: "borrador",
            days: ["2024-01-22", "2024-01-24", "2024-01-26", "2024-01-29"],
            students: [
                {
                    studentId: "ALU001",
                    attendance: { "2024-01-22": "presente", "2024-01-24": "presente", "2024-01-26": "presente", "2024-01-29": "presente" }
                },
                {
                    studentId: "ALU002",
                    attendance: { "2024-01-22": "presente", "2024-01-24": "falta", "2024-01-26": "presente", "2024-01-29": "presente" }
                },
                {
                    studentId: "ALU003",
                    attendance: { "2024-01-22": "presente", "2024-01-24": "presente", "2024-01-26": "justificado", "2024-01-29": "presente" }
                },
                {
                    studentId: "ALU004",
                    attendance: { "2024-01-22": "falta", "2024-01-24": "presente", "2024-01-26": "presente", "2024-01-29": "presente" }
                },
                {
                    studentId: "ALU007",
                    attendance: { "2024-01-22": "presente", "2024-01-24": "presente", "2024-01-26": "presente", "2024-01-29": "presente" }
                }
            ]
        },
        {
            id: "AST-CB-2024-02",
            groupId: "GRP002",
            teacherId: "TCH004",
            status: "borrador",
            days: ["2024-02-05", "2024-02-07"],
            students: [
                {
                    studentId: "ALU005",
                    attendance: { "2024-02-05": "presente", "2024-02-07": "presente" }
                },
                {
                    studentId: "ALU006",
                    attendance: { "2024-02-05": "falta", "2024-02-07": "presente" }
                }
            ]
        },
        {
            id: "AST-MO-2024-01",
            groupId: "GRP003",
            teacherId: "TCH001",
            status: "cerrado",
            days: ["2024-01-20", "2024-01-27"],
            students: [
                {
                    studentId: "ALU001",
                    attendance: { "2024-01-20": "presente", "2024-01-27": "presente" }
                },
                {
                    studentId: "ALU008",
                    attendance: { "2024-01-20": "presente", "2024-01-27": "falta" }
                },
                {
                    studentId: "ALU009",
                    attendance: { "2024-01-20": "presente", "2024-01-27": "justificado" }
                }
            ]
        },
        {
            id: "AST-CI-2024-01",
            groupId: "GRP004",
            teacherId: "TCH005",
            status: "borrador",
            days: ["2024-02-12", "2024-02-14"],
            students: []
        },
        {
            id: "AST-CB-2024-SUF",
            groupId: "GRP005",
            teacherId: "TCH004",
            status: "borrador",
            days: ["2024-03-20"],
            students: [
                {
                    studentId: "ALU001",
                    attendance: { "2024-03-20": "presente" }
                },
                {
                    studentId: "ALU002",
                    attendance: { "2024-03-20": "presente" }
                }
            ]
        }
    ],

    // Grades
    grades: [
        { id: 'GRD001', groupId: 'GRP001', studentId: 'ALU001', moduleGrades: { MOD001: 16, MOD002: 15, MOD003: 17 } },
        { id: 'GRD002', groupId: 'GRP001', studentId: 'ALU002', moduleGrades: { MOD001: 14, MOD002: 13, MOD003: 15 } },
        { id: 'GRD003', groupId: 'GRP001', studentId: 'ALU003', moduleGrades: { MOD001: 18, MOD002: 17, MOD003: 16 } },
        { id: 'GRD004', groupId: 'GRP001', studentId: 'ALU004', moduleGrades: { MOD001: 12, MOD002: 10, MOD003: 9 } },
        { id: 'GRD005', groupId: 'GRP001', studentId: 'ALU007', moduleGrades: { MOD001: 15, MOD002: 16, MOD003: 14 } },
        { id: 'GRD006', groupId: 'GRP003', studentId: 'ALU001', moduleGrades: { MOD004: 15, MOD005: 16, MOD006: 14, MOD007: 15, MOD008: 16, MOD009: 15 } },
        { id: 'GRD007', groupId: 'GRP003', studentId: 'ALU008', moduleGrades: { MOD004: 14, MOD005: 15, MOD006: 13, MOD007: 14, MOD008: 15, MOD009: 14 } },
        { id: 'GRD008', groupId: 'GRP003', studentId: 'ALU009', moduleGrades: { MOD004: 16, MOD005: 17, MOD006: 15, MOD007: 16, MOD008: 17, MOD009: 16 } },
    ],

    // Grade Sheets status (Fase 6)
    gradeSheets: [
        { groupId: 'GRP001', status: 'borrador', updatedAt: '2024-03-15' },
        { groupId: 'GRP003', status: 'cerrada', updatedAt: '2024-03-20' }
    ],

    // Certificates
    certificates: [
        { id: 'CRT001', studentId: 'ALU001', groupId: 'GRP001', code: 'CERT-2024-00001', issueDate: '2024-03-20', status: 'generated', type: 'certificado', deanSigned: true, directorSigned: true, deanSignedAt: '2024-03-20', directorSignedAt: '2024-03-20', deanSignerName: 'DR. FRANCISCO JAVIER CRUZ VILCHEZ', directorSignerName: 'DR. JONATHAN DAVID NIMA RAMOS', observations: '' },
        { id: 'CRT002', studentId: 'ALU002', groupId: 'GRP001', code: 'CERT-2024-00002', issueDate: '2024-03-20', status: 'pending', type: 'constancia', deanSigned: true, directorSigned: true, deanSignedAt: '2024-03-20', directorSignedAt: '2024-03-20', deanSignerName: 'DR. FRANCISCO JAVIER CRUZ VILCHEZ', directorSignerName: 'DR. JONATHAN DAVID NIMA RAMOS', observations: '' },
        { id: 'CRT003', studentId: 'ALU003', groupId: 'GRP001', code: 'CERT-2024-00003', issueDate: '2024-03-20', status: 'toBeSigned', type: 'certificado', deanSigned: false, directorSigned: false, deanSignedAt: null, directorSignedAt: null, deanSignerName: null, directorSignerName: null, observations: '' },
        { id: 'CRT004', studentId: 'ALU007', groupId: 'GRP001', code: 'CERT-2024-00004', issueDate: '2024-03-20', status: 'toBeSigned', type: 'certificado', deanSigned: false, directorSigned: true, deanSignedAt: null, directorSignedAt: '2024-03-20', deanSignerName: null, directorSignerName: 'DR. JONATHAN DAVID NIMA RAMOS', observations: '' },
        { id: 'CRT005', studentId: 'ALU001', groupId: 'GRP003', code: 'CERT-2024-00005', issueDate: '2024-03-20', status: 'toBeSigned', type: 'certificado', deanSigned: true, directorSigned: false, deanSignedAt: '2024-03-20', directorSignedAt: null, deanSignerName: 'DR. FRANCISCO JAVIER CRUZ VILCHEZ', directorSignerName: null, observations: '' }
    ],

    // System Users
    users: [
        { id: 'USR001', username: 'admin', password: 'admin123', fullName: 'DR. JONATHAN DAVID NIMA RAMOS', role: 'admin', email: 'admin@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-15 10:30' },
        { id: 'USR002', username: 'secretaria', password: 'secretaria123', fullName: 'Juan María Secretaria', role: 'secretary', email: 'secretaria@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-14 09:15' },
        { id: 'USR003', username: 'roberto.silva', password: 'docente123', fullName: 'Roberto Silva', role: 'teacher', email: 'roberto.silva@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-15 08:00' },
        { id: 'USR004', username: 'coordinador', password: 'coordinador123', fullName: 'Carlos Coordinador Académico', role: 'coordinator', email: 'coordinador@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-13 14:45' },
        { id: 'USR005', username: 'lucia.espinoza', password: 'docente123', fullName: 'Lucía Espinoza', role: 'teacher', email: 'lucia.espinoza@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-15 08:30' },
        { id: 'USR006', username: 'decano', password: 'decano123', fullName: 'Dr. Francisco Javier Cruz Vilchez', role: 'dean', email: 'decano@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-15 11:00' }
    ],

    // System Settings (Fase 7)
    settings: {
        systemName: 'SAII',
        instituteName: 'Instituto de Informática',
        universityName: 'Universidad Nacional de Piura',
        instituteEmail: 'info@institutoinformatica.edu.pe',
        institutePhone: '+51 (73) 123-4567',
        academicPeriod: '2024-I',
        minPassingGrade: 11,
        minAttendanceRequired: 70,
        defaultTheme: 'light',
        enableNotifications: true,
        enableAutoSave: true,
        systemLanguage: 'es',
        responsibleAcademic: 'DR. JONATHAN DAVID NIMA RAMOS - Director'
    },

    // Role Permissions (Fase 7)
    rolePermissions: {
        admin: ['dashboard', 'students', 'courses', 'teachers', 'groups', 'enrollments', 'attendance', 'grades', 'certificates', 'reports', 'users', 'settings'],
        secretary: ['dashboard', 'students', 'enrollments', 'certificates', 'reports'],
        teacher: ['dashboard', 'grades', 'attendance', 'reports'],
        coordinator: ['dashboard', 'courses', 'groups', 'reports', 'students'],
        dean: ['dashboard', 'certificates']
    },

    // Saved Reports (Fase 7)
    savedReports: [
        { id: 'REP001', name: 'Alumnos en Riesgo Académico (Asistencia < 70%)', type: 'attendance', createdBy: 'Admin', createdAt: '2024-03-01', queryConfig: { minAtt: 70 } },
        { id: 'REP002', name: 'Resumen de Calificaciones por Curso', type: 'grades', createdBy: 'Admin', createdAt: '2024-03-05', queryConfig: {} },
        { id: 'REP003', name: 'Historial de Certificados Emitidos 2024-I', type: 'certificates', createdBy: 'Secretaria', createdAt: '2024-03-10', queryConfig: {} }
    ]

};

// Utility functions for data management
const USE_MOCK = false;

// Mappers to translate snake_case from DB into camelCase for UI, and vice versa
const mappers = {
    user: function(u) {
        if (!u) return null;
        return {
            id: u.id,
            username: u.username,
            fullName: u.full_name || u.fullName,
            role: u.role_key || u.role,
            email: u.email,
            status: u.status,
            lastLogin: u.last_login || u.lastLogin || '-'
        };
    },
    student: function(s) {
        if (!s) return null;
        return {
            id: s.id,
            code: s.code,
            dni: s.dni,
            firstName: s.first_name,
            lastName: s.last_name,
            email: s.email,
            phone: s.phone,
            cycle: s.cycle || 'I',
            promotion: s.promotion || '2024',
            status: s.status,
            observations: s.observations || ''
        };
    },
    teacher: function(t) {
        if (!t) return null;
        return {
            id: t.id,
            code: t.code,
            dni: t.dni,
            firstName: t.first_name,
            lastName: t.last_name,
            email: t.email,
            phone: t.phone,
            specialty: t.specialty,
            status: t.status
        };
    },
    course: function(c) {
        if (!c) return null;
        return {
            id: c.id,
            code: c.code,
            name: c.name,
            description: c.description || '',
            totalHours: c.total_hours,
            status: c.status,
            modules: (c.modules || []).map(m => ({
                id: m.id || m.course_module_id,
                name: m.name || m.module_name,
                percentage: m.percentage || m.module_percentage
            }))
        };
    },
    group: function(g) {
        if (!g) return null;
        return {
            id: g.id,
            code: g.code,
            courseId: g.course_id,
            courseName: g.course_name,
            teacherId: g.teacher_id,
            teacherName: g.teacher_name,
            modality: g.modality,
            schedule: g.schedule,
            classroom: g.schedule, // Mapear schedule del backend a classroom en el frontend
            startDate: g.start_date,
            endDate: g.end_date,
            hours: g.hours,
            maxQuota: g.max_quota,
            status: g.status,
            observations: g.observations || ''
        };
    },
    enrollment: function(e) {
        if (!e) return null;
        return {
            id: e.id,
            groupId: e.group_id,
            studentId: e.student_id,
            enrollmentDate: e.enrollment_date,
            status: e.status,
            studentName: e.student_name,
            studentCode: e.student_code,
            groupCode: e.group_code,
            courseName: e.course_name
        };
    },
    attendanceList: function(a) {
        if (!a) return null;
        return {
            id: a.id,
            groupId: a.group_id,
            date: a.date,
            status: a.status,
            teacherId: a.teacher_id,
            adminObservation: a.admin_observation || ''
        };
    },
    settings: function(s) {
        if (!s) return null;
        return {
            systemName: s.system_name,
            instituteName: s.institute_name,
            universityName: s.university_name,
            instituteEmail: s.institute_email,
            institutePhone: s.institute_phone,
            academicPeriod: s.academic_period,
            minPassingGrade: Number(s.min_passing_grade),
            minAttendanceRequired: Number(s.min_attendance_required),
            defaultTheme: s.default_theme,
            enableNotifications: s.enable_notifications == 1,
            enableAutoSave: s.enable_auto_save == 1,
            systemLanguage: s.system_language,
            responsibleAcademic: s.responsible_academic
        };
    },
    savedReport: function(r) {
        if (!r) return null;
        return {
            id: r.id,
            name: r.name,
            type: r.type,
            createdBy: r.created_by,
            queryConfig: typeof r.query_config === 'string' ? JSON.parse(r.query_config) : r.query_config,
            createdAt: r.created_at
        };
    },
    certificate: function(c) {
        if (!c) return null;
        const signatures = c.signatures || [];
        const dirSig = signatures.find(s => s.signer_role === 'director');
        const decSig = signatures.find(s => s.signer_role === 'decano');
        return {
            id: c.id,
            code: c.code,
            studentId: c.student_id,
            groupId: c.group_id,
            type: c.type,
            status: c.status,
            deanSigned: decSig ? (decSig.is_signed == 1) : false,
            directorSigned: dirSig ? (dirSig.is_signed == 1) : false,
            deanSignedAt: decSig ? decSig.signed_at : null,
            directorSignedAt: dirSig ? dirSig.signed_at : null,
            deanSignerName: decSig ? decSig.signer_name : null,
            directorSignerName: dirSig ? dirSig.signer_name : null,
            issueDate: c.issue_date || null,
            observations: c.observations || '',
            studentName: c.student_name,
            studentCode: c.student_code,
            groupCode: c.group_code,
            courseName: c.course_name
        };
    }
};

const studentToAPI = function(s) {
    return {
        code: s.code,
        dni: s.dni,
        first_name: s.firstName,
        last_name: s.lastName,
        email: s.email,
        phone: s.phone,
        status: s.status,
        observations: s.observations || ''
    };
};

const teacherToAPI = function(t) {
    return {
        code: t.code,
        dni: t.dni,
        first_name: t.firstName,
        last_name: t.lastName,
        email: t.email,
        phone: t.phone,
        specialty: t.specialty,
        status: t.status
    };
};

const courseToAPI = function(c) {
    return {
        code: c.code,
        name: c.name,
        description: c.description || '',
        total_hours: c.totalHours,
        status: c.status,
        modules: c.modules
    };
};

const groupToAPI = function(g) {
    return {
        code: g.code,
        course_id: g.courseId,
        teacher_id: g.teacherId,
        modality: g.modality,
        schedule: g.schedule,
        start_date: g.startDate,
        end_date: g.endDate,
        hours: g.hours,
        max_quota: g.maxQuota,
        status: g.status,
        observations: g.observations || ''
    };
};

const settingsToAPI = function(s) {
    return {
        system_name: s.systemName,
        institute_name: s.instituteName,
        university_name: s.universityName,
        institute_email: s.instituteEmail,
        institute_phone: s.institutePhone,
        academic_period: s.academicPeriod,
        min_passing_grade: s.minPassingGrade,
        min_attendance_required: s.minAttendanceRequired,
        default_theme: s.defaultTheme,
        enable_notifications: s.enableNotifications ? 1 : 0,
        enable_auto_save: s.enableAutoSave ? 1 : 0,
        system_language: s.systemLanguage,
        responsible_academic: s.responsibleAcademic
    };
};

const userToAPI = function(u) {
    const roleNumericIds = {
        admin: 1,
        secretary: 2,
        teacher: 3,
        coordinator: 4,
        dean: 5
    };
    return {
        username: u.username,
        password: u.password,
        full_name: u.fullName,
        email: u.email,
        role_id: roleNumericIds[u.role] || u.role,
        status: u.status
    };
};

const DataManager = {
    currentUser: null,

    // In-memory cache for fast, synchronous read getters
    cache: {
        students: [],
        teachers: [],
        courses: [],
        groups: [],
        enrollments: [],
        settings: {},
        reports: [],
        certificates: [],
        grades: [],
        attendanceLists: [],
        attendanceRecords: [],
        users: [],
        roles: []
    },

    // Preload all backend API data into local memory cache
    preload: async function() {
        if (USE_MOCK) return;
        try {
            const [
                studentsRes, teachersRes, coursesRes, groupsRes, 
                enrollmentsRes, settingsRes, reportsRes, certificatesRes,
                gradesRes, gradesSheetsRes, attendanceListsRes, attendanceRecordsRes, usersRes, rolesRes
            ] = await Promise.all([
                APIClient.request('/students'),
                APIClient.request('/teachers'),
                APIClient.request('/courses'),
                APIClient.request('/groups'),
                APIClient.request('/enrollments'),
                APIClient.request('/settings'),
                APIClient.request('/reports/saved'),
                APIClient.request('/certificates'),
                APIClient.request('/grades'),
                APIClient.request('/grades/sheets'),
                APIClient.request('/attendance'),
                APIClient.request('/attendance/records'),
                APIClient.request('/users').catch(() => ({ data: [] })),
                APIClient.request('/roles').catch(() => ({ data: [] }))
            ]);

            this.cache.students = (studentsRes.data || []).map(mappers.student);
            this.cache.teachers = (teachersRes.data || []).map(mappers.teacher);
            this.cache.courses = (coursesRes.data || []).map(mappers.course);
            this.cache.groups = (groupsRes.data || []).map(mappers.group);
            this.cache.enrollments = (enrollmentsRes.data || []).map(mappers.enrollment);
            this.cache.settings = mappers.settings(settingsRes.data);
            this.cache.reports = (reportsRes.data || []).map(mappers.savedReport);
            this.cache.certificates = (certificatesRes.data || []).map(mappers.certificate);
            this.cache.gradeSheets = gradesSheetsRes.data || [];
            
            // Map grades
            const groupedGrades = {};
            (gradesRes.data || []).forEach(r => {
                const key = `${r.group_id}-${r.student_id}`;
                if (!groupedGrades[key]) {
                    groupedGrades[key] = {
                        groupId: Number(r.group_id),
                        studentId: Number(r.student_id),
                        moduleGrades: {}
                    };
                }
                groupedGrades[key].moduleGrades[r.course_module_id] = parseFloat(r.grade);
            });
            this.cache.grades = Object.values(groupedGrades);

            // Map attendance lists and records
            this.cache.attendanceLists = (attendanceListsRes.data || []).map(mappers.attendanceList);
            this.cache.attendanceRecords = (attendanceRecordsRes.data || []).map(r => ({
                studentId: Number(r.student_id),
                status: r.status,
                groupId: Number(r.group_id),
                date: r.date
            }));
            this.cache.users = (usersRes.data || []).map(mappers.user);
            this.cache.roles = rolesRes.data || [];
        } catch (e) {
            console.error("Error preloading SAII REST API cache:", e);
            throw e;
        }
    },

    // Login validation
    validateLogin: async function(username, password, role) {
        if (USE_MOCK) {
            if (username && password && role) {
                const user = mockData.users.find(u => 
                    u.username.toLowerCase() === username.toLowerCase() && 
                    u.password === password && 
                    u.role.toLowerCase() === role.toLowerCase()
                );
                if (user) {
                    let teacherId = null;
                    if (user.role === 'teacher') {
                        const teacher = mockData.teachers.find(t => t.email === user.email);
                        teacherId = teacher ? teacher.id : null;
                    }
                    const loggedUser = {
                        id: user.id,
                        username: user.username,
                        fullName: user.fullName,
                        role: user.role,
                        email: user.email,
                        teacherId: teacherId
                    };
                    mockData.currentUser = loggedUser;
                    DataManager.currentUser = loggedUser;
                    localStorage.setItem('saii_currentUser', JSON.stringify(loggedUser));
                    return true;
                }
            }
            return false;
        }

        const res = await APIClient.request('/auth/login', {
            method: 'POST',
            body: { username, password, role }
        });
        if (res && res.status === 'success') {
            const loggedUser = {
                id: res.data.id,
                username: res.data.username,
                fullName: res.data.fullName,
                role: res.data.role,
                email: res.data.email,
                teacherId: null
            };
            if (loggedUser.role === 'teacher') {
                try {
                    const teachersRes = await APIClient.request('/teachers');
                    const teacher = teachersRes.data.find(t => t.email === loggedUser.email);
                    loggedUser.teacherId = teacher ? teacher.id : null;
                } catch (e) {
                    console.error("Error fetching teacher detail", e);
                }
            }
            DataManager.currentUser = loggedUser;
            localStorage.setItem('saii_currentUser', JSON.stringify(loggedUser));
            
            // Preload the entire database cache after successful login
            await this.preload();
            return true;
        }
        return false;
    },

    // Student operations
    getStudents: function() {
        if (USE_MOCK) {
            return mockData.students;
        }
        return this.cache.students;
    },

    addStudent: async function(studentData) {
        if (USE_MOCK) {
            const newStudent = {
                id: 'ALU' + String(mockData.students.length + 1).padStart(3, '0'),
                ...studentData
            };
            mockData.students.push(newStudent);
            return newStudent;
        }
        const body = {
            code: studentData.code,
            dni: studentData.dni,
            first_name: studentData.firstName,
            last_name: studentData.lastName,
            email: studentData.email,
            phone: studentData.phone,
            status: studentData.status,
            cycle: studentData.cycle,
            promotion: studentData.promotion,
            observations: studentData.observations || ''
        };
        const res = await APIClient.request('/students', {
            method: 'POST',
            body: body
        });
        const mapped = mappers.student(res.data);
        await this.preload();
        return mapped;
    },

    updateStudent: async function(id, updates) {
        if (USE_MOCK) {
            const student = mockData.students.find(s => s.id === id);
            if (student) {
                Object.assign(student, updates);
                return student;
            }
            return null;
        }
        const existing = this.cache.students.find(s => s.id == id);
        if (!existing) return null;
        const body = {
            code: updates.code !== undefined ? updates.code : existing.code,
            dni: updates.dni !== undefined ? updates.dni : existing.dni,
            first_name: updates.firstName !== undefined ? updates.firstName : existing.firstName,
            last_name: updates.lastName !== undefined ? updates.lastName : existing.lastName,
            email: updates.email !== undefined ? updates.email : existing.email,
            phone: updates.phone !== undefined ? updates.phone : existing.phone,
            status: updates.status !== undefined ? updates.status : existing.status,
            cycle: updates.cycle !== undefined ? updates.cycle : existing.cycle,
            promotion: updates.promotion !== undefined ? updates.promotion : existing.promotion,
            observations: updates.observations !== undefined ? updates.observations : existing.observations
        };
        const res = await APIClient.request(`/students/${id}`, {
            method: 'PUT',
            body: body
        });
        const mapped = mappers.student(res.data);
        await this.preload();
        return mapped;
    },

    getStudentById: function(id) {
        if (USE_MOCK) {
            return mockData.students.find(s => s.id === id);
        }
        return this.cache.students.find(s => s.id == id);
    },

    // Course operations
    getCourses: function() {
        if (USE_MOCK) {
            return mockData.courses;
        }
        return this.cache.courses;
    },

    getCourseById: function(id) {
        if (USE_MOCK) {
            return mockData.courses.find(c => c.id === id);
        }
        return this.cache.courses.find(c => c.id == id);
    },

    addCourse: async function(courseData) {
        if (USE_MOCK) {
            const newCourse = {
                id: 'CRS' + String(mockData.courses.length + 1).padStart(3, '0'),
                ...courseData
            };
            mockData.courses.push(newCourse);
            return newCourse;
        }
        const body = {
            code: courseData.code,
            name: courseData.name,
            description: courseData.description || '',
            total_hours: courseData.totalHours,
            status: courseData.status,
            modules: courseData.modules
        };
        const res = await APIClient.request('/courses', {
            method: 'POST',
            body: body
        });
        const mapped = mappers.course(res.data);
        await this.preload();
        return mapped;
    },

    updateCourse: async function(id, courseData) {
        if (USE_MOCK) {
            const course = mockData.courses.find(c => c.id === id);
            if (course) {
                Object.assign(course, courseData);
                return course;
            }
            return null;
        }
        const existing = this.cache.courses.find(c => c.id == id);
        if (!existing) return null;

        // Map camelCase to snake_case format for the backend REST API
        const body = {
            code: courseData.code !== undefined ? courseData.code : existing.code,
            name: courseData.name !== undefined ? courseData.name : existing.name,
            description: courseData.description !== undefined ? courseData.description : existing.description,
            total_hours: courseData.totalHours !== undefined ? courseData.totalHours : existing.totalHours,
            status: courseData.status !== undefined ? courseData.status : existing.status,
            modules: courseData.modules !== undefined ? courseData.modules.map(m => ({
                name: m.name,
                percentage: m.percentage
            })) : existing.modules.map(m => ({
                name: m.name,
                percentage: m.percentage
            }))
        };

        const res = await APIClient.request(`/courses/${id}`, {
            method: 'PUT',
            body: body
        });
        await this.preload();
        return res.data;
    },

    // Teacher operations
    getTeachers: function() {
        if (USE_MOCK) {
            return mockData.teachers;
        }
        return this.cache.teachers;
    },

    getTeacherById: function(id) {
        if (USE_MOCK) {
            return mockData.teachers.find(t => t.id === id);
        }
        return this.cache.teachers.find(t => t.id == id);
    },

    addTeacher: async function(teacherData) {
        if (USE_MOCK) {
            const newTeacher = {
                id: 'TCH' + String(mockData.teachers.length + 1).padStart(3, '0'),
                ...teacherData
            };
            mockData.teachers.push(newTeacher);
            return newTeacher;
        }
        const body = {
            code: teacherData.code,
            dni: teacherData.dni,
            first_name: teacherData.firstName,
            last_name: teacherData.lastName,
            email: teacherData.email,
            phone: teacherData.phone,
            specialty: teacherData.specialty,
            status: teacherData.status
        };
        const res = await APIClient.request('/teachers', {
            method: 'POST',
            body: body
        });
        const mapped = mappers.teacher(res.data);
        await this.preload();
        return mapped;
    },

    updateTeacher: async function(id, updates) {
        if (USE_MOCK) {
            const teacher = mockData.teachers.find(t => t.id === id);
            if (teacher) {
                Object.assign(teacher, updates);
                return teacher;
            }
            return null;
        }
        const existing = this.cache.teachers.find(t => t.id == id);
        if (!existing) return null;
        const body = {
            code: updates.code !== undefined ? updates.code : existing.code,
            dni: updates.dni !== undefined ? updates.dni : existing.dni,
            first_name: updates.firstName !== undefined ? updates.firstName : existing.firstName,
            last_name: updates.lastName !== undefined ? updates.lastName : existing.lastName,
            email: updates.email !== undefined ? updates.email : existing.email,
            phone: updates.phone !== undefined ? updates.phone : existing.phone,
            specialty: updates.specialty !== undefined ? updates.specialty : existing.specialty,
            status: updates.status !== undefined ? updates.status : existing.status
        };
        const res = await APIClient.request(`/teachers/${id}`, {
            method: 'PUT',
            body: body
        });
        const mapped = mappers.teacher(res.data);
        await this.preload();
        return mapped;
    },

    // Group operations
    getGroups: function() {
        if (USE_MOCK) {
            return mockData.groups;
        }
        return this.cache.groups;
    },

    getGroupById: function(id) {
        if (USE_MOCK) {
            return mockData.groups.find(g => g.id === id);
        }
        return this.cache.groups.find(g => g.id == id);
    },

    addGroup: async function(groupData) {
        if (USE_MOCK) {
            const newGroup = {
                id: 'GRP' + String(mockData.groups.length + 1).padStart(3, '0'),
                ...groupData
            };
            mockData.groups.push(newGroup);
            return newGroup;
        }
        const body = {
            code: groupData.code,
            course_id: groupData.courseId,
            teacher_id: groupData.teacherId,
            modality: groupData.modality,
            schedule: groupData.schedule || groupData.classroom || 'No especificado',
            start_date: groupData.startDate,
            end_date: groupData.endDate,
            hours: groupData.hours,
            max_quota: groupData.maxQuota,
            status: groupData.status,
            observations: groupData.observations || ''
        };
        const res = await APIClient.request('/groups', {
            method: 'POST',
            body: body
        });
        const mapped = mappers.group(res.data);
        await this.preload();
        return mapped;
    },

    updateGroup: async function(id, updates) {
        if (USE_MOCK) {
            const group = mockData.groups.find(g => g.id === id);
            if (group) {
                Object.assign(group, updates);
                return group;
            }
            return null;
        }
        const existing = this.cache.groups.find(g => g.id == id);
        if (!existing) return null;
        const body = {
            code: updates.code !== undefined ? updates.code : existing.code,
            course_id: updates.courseId !== undefined ? updates.courseId : existing.courseId,
            teacher_id: updates.teacherId !== undefined ? updates.teacherId : existing.teacherId,
            modality: updates.modality !== undefined ? updates.modality : existing.modality,
            schedule: updates.schedule !== undefined ? updates.schedule : existing.schedule,
            start_date: updates.startDate !== undefined ? updates.startDate : existing.startDate,
            end_date: updates.endDate !== undefined ? updates.endDate : existing.endDate,
            hours: updates.hours !== undefined ? updates.hours : existing.hours,
            max_quota: updates.maxQuota !== undefined ? updates.maxQuota : existing.maxQuota,
            status: updates.status !== undefined ? updates.status : existing.status,
            observations: updates.observations !== undefined ? updates.observations : existing.observations
        };
        const res = await APIClient.request(`/groups/${id}`, {
            method: 'PUT',
            body: body
        });
        const mapped = mappers.group(res.data);
        await this.preload();
        return mapped;
    },

    // Enrollment operations
    getEnrollments: function(groupId = null) {
        if (USE_MOCK) {
            return mockData.enrollments.filter(e => e.groupId === groupId);
        }
        if (groupId) {
            return this.cache.enrollments.filter(e => e.groupId == groupId);
        }
        return this.cache.enrollments;
    },

    addEnrollment: async function(groupId, studentId) {
        if (USE_MOCK) {
            const existingEnrollment = mockData.enrollments.find(e => e.groupId === groupId && e.studentId === studentId);
            if (existingEnrollment) {
                return null;
            }
            const newEnrollment = {
                id: 'ENR' + String(mockData.enrollments.length + 1).padStart(3, '0'),
                groupId: groupId,
                studentId: studentId,
                enrollmentDate: new Date().toISOString().split('T')[0],
                status: 'active'
            };
            mockData.enrollments.push(newEnrollment);
            return newEnrollment;
        }
        const res = await APIClient.request('/enrollments', {
            method: 'POST',
            body: {
                group_id: groupId,
                student_id: studentId
            }
        });
        const mapped = mappers.enrollment(res.data);
        await this.preload();
        return mapped;
    },

    removeEnrollment: async function(enrollmentId) {
        if (USE_MOCK) {
            const index = mockData.enrollments.findIndex(e => e.id === enrollmentId);
            if (index > -1) {
                mockData.enrollments.splice(index, 1);
                return true;
            }
            return false;
        }
        await APIClient.request(`/enrollments/${enrollmentId}`, {
            method: 'DELETE'
        });
        await this.preload();
        return true;
    },

    updateEnrollment: async function(enrollmentId, updates) {
        if (USE_MOCK) {
            const enrollment = mockData.enrollments.find(e => e.id === enrollmentId);
            if (enrollment) {
                Object.assign(enrollment, updates);
                return enrollment;
            }
            return null;
        }
        const existing = this.cache.enrollments.find(e => e.id == enrollmentId);
        if (!existing) return null;

        const body = {
            group_id: updates.groupId !== undefined ? updates.groupId : existing.groupId,
            student_id: updates.studentId !== undefined ? updates.studentId : existing.studentId,
            status: updates.status !== undefined ? updates.status : existing.status
        };

        const res = await APIClient.request(`/enrollments/${enrollmentId}`, {
            method: 'PUT',
            body: body
        });
        await this.preload();
        return res.data;
    },

    // Student Attendance operations
    getStudentAttendanceByGroup: function(groupId) {
        if (USE_MOCK) {
            return mockData.studentAttendanceByGroup.find(att => att.groupId === groupId) || null;
        }
        const id = `AST-GRP-${groupId}`;
        return this.getStudentAttendanceById(id);
    },

    getStudentAttendanceByTeacher: function(teacherId) {
        if (USE_MOCK) {
            return mockData.studentAttendanceByGroup.filter(att => att.teacherId === teacherId);
        }
        const teachersGroups = this.cache.groups.filter(g => g.teacherId == teacherId);
        return teachersGroups.map(g => ({
            id: `AST-GRP-${g.id}`,
            groupId: g.id,
            teacherId: g.teacherId,
            status: g.status === 'closed' || g.status === 'finished' ? 'cerrado' : 'borrador'
        }));
    },

    getAllStudentAttendance: function() {
        if (USE_MOCK) {
            return mockData.studentAttendanceByGroup;
        }
        return this.cache.groups.map(g => {
            const dbLists = this.cache.attendanceLists.filter(l => l.groupId == g.id);
            const isAnyClosed = dbLists.some(l => l.status === 'cerrada' || l.status === 'cerrado');
            const globalStatus = (g.status === 'closed' || g.status === 'finished' || isAnyClosed) ? 'cerrado' : 'borrador';
            return {
                id: `AST-GRP-${g.id}`,
                groupId: g.id,
                teacherId: g.teacherId,
                status: globalStatus
            };
        });
    },

    getStudentAttendanceById: function(id) {
        if (USE_MOCK) {
            return mockData.studentAttendanceByGroup.find(att => att.id === id) || null;
        }

        const groupId = parseInt(id.replace('AST-GRP-', ''));
        const group = this.getGroupById(groupId);
        if (!group) return null;

        const dbLists = this.cache.attendanceLists.filter(l => l.groupId == groupId);

        const days = [];
        dbLists.forEach(l => {
            if (!days.includes(l.date)) {
                days.push(l.date);
            }
        });
        days.sort();

        const enrolled = this.getEnrolledStudentsByGroup(groupId);
        const students = enrolled.map(s => {
            const attMap = {};
            this.cache.attendanceRecords
                .filter(r => r.groupId == groupId && r.studentId == s.id)
                .forEach(r => {
                    attMap[r.date] = r.status;
                });
            return {
                studentId: s.id,
                attendance: attMap
            };
        });

        const isAnyClosed = dbLists.some(l => l.status === 'cerrada' || l.status === 'cerrado');
        const globalStatus = isAnyClosed ? 'cerrado' : 'borrador';

        return {
            id: id,
            groupId: groupId,
            teacherId: group.teacherId,
            status: globalStatus,
            days: days,
            students: students
        };
    },

    getEnrolledStudentsByGroup: function(groupId) {
        if (USE_MOCK) {
            const enrollments = mockData.enrollments.filter(e => e.groupId === groupId && e.status === 'active');
            return enrollments.map(e => mockData.students.find(s => s.id === e.studentId)).filter(s => s);
        }
        const enrolledIds = this.getEnrollments(groupId).map(e => e.studentId);
        return this.cache.students.filter(s => enrolledIds.includes(s.id));
    },

    updateStudentAttendanceRecord: async function(attendanceId, studentId, date, value) {
        if (USE_MOCK) {
            const attendance = mockData.studentAttendanceByGroup.find(att => att.id === attendanceId);
            if (!attendance || attendance.status === 'cerrado') return null;
            let studentRecord = attendance.students.find(s => s.studentId === studentId);
            if (!studentRecord) {
                studentRecord = { studentId: studentId, attendance: {} };
                attendance.students.push(studentRecord);
            }
            studentRecord.attendance[date] = value;
            return studentRecord;
        }

        const groupId = parseInt(attendanceId.replace('AST-GRP-', ''));
        const matchingList = this.cache.attendanceLists.find(l => l.groupId == groupId && l.date === date);

        const enrolled = this.getEnrolledStudentsByGroup(groupId);

        if (!matchingList) {
            const records = enrolled.map(s => ({
                student_id: s.id,
                status: s.id == studentId ? value : 'presente'
            }));
            await APIClient.request('/attendance', {
                method: 'POST',
                body: {
                    group_id: groupId,
                    date: date,
                    status: 'borrador',
                    records: records
                }
            });
        } else {
            const listDetail = await APIClient.request(`/attendance/${matchingList.id}`);
            const records = enrolled.map(s => {
                const existingRec = listDetail.data.records.find(r => r.student_id == s.id);
                const currentStatus = existingRec ? existingRec.status : 'presente';
                return {
                    student_id: s.id,
                    status: s.id == studentId ? value : currentStatus
                };
            });
            await APIClient.request(`/attendance/${matchingList.id}`, {
                method: 'PUT',
                body: {
                    status: 'borrador',
                    records: records
                }
            });
        }
        await this.preload();
        return true;
    },

    updateStudentAttendanceStatus: async function(attendanceId, newStatus) {
        if (USE_MOCK) {
            const attendance = mockData.studentAttendanceByGroup.find(att => att.id === attendanceId);
            if (!attendance) return null;
            attendance.status = newStatus;
            return attendance;
        }

        const groupId = parseInt(attendanceId.replace('AST-GRP-', ''));
        const dbLists = this.cache.attendanceLists.filter(l => l.groupId == groupId);

        for (const list of dbLists) {
            await APIClient.request(`/attendance/${list.id}/status`, {
                method: 'POST',
                body: {
                    status: newStatus === 'cerrado' ? 'cerrada' : newStatus
                }
            });
        }
        await this.preload();
        return true;
    },

    markAllStudentsPresentForDay: async function(attendanceId, date) {
        if (USE_MOCK) {
            const attendance = mockData.studentAttendanceByGroup.find(att => att.id === attendanceId);
            if (!attendance || attendance.status === 'cerrado') return null;
            const enrolled = this.getEnrolledStudentsByGroup(attendance.groupId);
            enrolled.forEach(student => {
                let studentRecord = attendance.students.find(s => s.studentId === student.id);
                if (!studentRecord) {
                    studentRecord = { studentId: student.id, attendance: {} };
                    attendance.students.push(studentRecord);
                }
                studentRecord.attendance[date] = 'presente';
            });
            return attendance;
        }
        const groupId = parseInt(attendanceId.replace('AST-GRP-', ''));
        const enrolled = this.getEnrolledStudentsByGroup(groupId);
        for (const s of enrolled) {
            await this.updateStudentAttendanceRecord(attendanceId, s.id, date, 'presente');
        }
        return true;
    },

    // Grade operations
    getGradeSheetByGroup: function(groupId) {
        if (USE_MOCK) {
            return mockData.gradeSheets.find(gs => gs.groupId === groupId) || null;
        }
        const sheet = (this.cache.gradeSheets || []).find(s => s.group_id == groupId);
        return {
            groupId: groupId,
            status: sheet ? sheet.status : 'borrador',
            updatedAt: sheet ? sheet.updated_at.split(' ')[0] : new Date().toISOString().split('T')[0]
        };
    },

    updateGradeSheetStatus: async function(groupId, newStatus) {
        if (USE_MOCK) return;
        await APIClient.request(`/grades/group/${groupId}/status`, {
            method: 'POST',
            body: {
                status: newStatus
            }
        });
        await this.preload();
    },

    saveGrades: async function(groupId, records, status) {
        if (USE_MOCK) return;
        await APIClient.request(`/grades/group/${groupId}`, {
            method: 'POST',
            body: {
                status: status,
                records: records
            }
        });
        await this.preload();
    },

    getGrades: function() {
        if (USE_MOCK) return mockData.grades;
        return this.cache.grades;
    },

    calculateAverage: function(moduleGrades, course) {
        if (!course || !course.modules) return 0;
        let weightedSum = 0;
        course.modules.forEach(module => {
            const grade = parseFloat(moduleGrades[module.id]) || 0;
            const weight = module.percentage / 100;
            weightedSum += grade * weight;
        });
        return Math.round(weightedSum * 10) / 10;
    },

    calculateAttendancePercentage: function(studentId, groupId) {
        if (USE_MOCK) {
            const att = mockData.studentAttendanceByGroup.find(a => a.groupId === groupId);
            if (!att || !att.days || att.days.length === 0) return 100;
            const studentRec = att.students.find(s => s.studentId === studentId);
            if (!studentRec || !studentRec.attendance) return 0;
            const totalDays = att.days.length;
            let activeDays = 0;
            att.days.forEach(d => {
                const status = studentRec.attendance[d];
                if (status === 'presente' || status === 'tarde') activeDays++;
            });
            return Math.round((activeDays / totalDays) * 100);
        }

        const dbLists = this.cache.attendanceLists.filter(l => l.groupId == groupId && l.status !== 'borrador');
        const totalClasses = dbLists.length;
        if (totalClasses === 0) return 100;

        const studentRecords = this.cache.attendanceRecords.filter(r => r.studentId == studentId && r.groupId == groupId);
        let activeDays = 0;
        studentRecords.forEach(r => {
            if (r.status === 'presente' || r.status === 'tarde' || r.status === 'justificado') {
                activeDays++;
            }
        });
        return Math.round((activeDays / totalClasses) * 100);
    },

    getStudentsByGroup: function(groupId) {
        return this.getEnrolledStudentsByGroup(groupId);
    },

    // Certificate operations
    getCertificates: function() {
        if (USE_MOCK) return mockData.certificates;
        return this.cache.certificates;
    },

    getCertificatesByGroup: function(groupId) {
        if (USE_MOCK) {
            return mockData.certificates.filter(c => c.groupId === groupId);
        }
        return this.cache.certificates.filter(c => c.groupId == groupId);
    },

    getCertificateById: function(id) {
        if (USE_MOCK) {
            return mockData.certificates.find(c => c.id === id);
        }
        return this.cache.certificates.find(c => c.id == id);
    },

    createCertificate: async function(certData) {
        if (USE_MOCK) {
            const certId = 'CRT' + String(mockData.certificates.length + 1).padStart(3, '0');
            const codePrefix = certData.type === 'constancia' ? 'CONS' : 'CERT';
            const newCert = {
                id: certId,
                code: `${codePrefix}-${new Date().getFullYear()}-${String(mockData.certificates.length + 1).padStart(5, '0')}`,
                studentId: certData.studentId,
                groupId: certData.groupId,
                type: certData.type,
                status: 'toBeSigned',
                deanSigned: false,
                directorSigned: false,
                issueDate: new Date().toISOString().split('T')[0],
                observations: certData.observations || ''
            };
            mockData.certificates.push(newCert);
            return newCert;
        }

        const res = await APIClient.request('/certificates', {
            method: 'POST',
            body: {
                student_id: certData.studentId,
                group_id: certData.groupId,
                type: certData.type,
                observations: certData.observations || ''
            }
        });
        const mapped = mappers.certificate(res.data);
        await this.preload();
        return mapped;
    },

    signCertificate: async function(id, signerName, role) {
        if (USE_MOCK) {
            const cert = mockData.certificates.find(c => c.id === id);
            if (cert) {
                if (role === 'director') {
                    cert.directorSigned = true;
                    cert.directorSignedAt = new Date().toISOString().split('T')[0];
                    cert.directorSignerName = signerName;
                } else {
                    cert.deanSigned = true;
                    cert.deanSignedAt = new Date().toISOString().split('T')[0];
                    cert.deanSignerName = signerName;
                }
                if (cert.directorSigned && cert.deanSigned) {
                    cert.status = 'generated';
                }
            }
            return true;
        }

        const apiRole = role === 'dean' ? 'decano' : role;
        await APIClient.request(`/certificates/${id}/sign`, {
            method: 'POST',
            body: {
                signer_name: signerName,
                role: apiRole
            }
        });
        await this.preload();
        return true;
    },

    annulCertificate: async function(id) {
        if (USE_MOCK) {
            const idx = mockData.certificates.findIndex(c => c.id === id);
            if (idx !== -1) {
                mockData.certificates.splice(idx, 1);
                return true;
            }
            return false;
        }
        await APIClient.request(`/certificates/${id}`, {
            method: 'DELETE'
        });
        await this.preload();
        return true;
    },

    saveCertificateObservation: async function(id, text) {
        if (USE_MOCK) {
            const cert = mockData.certificates.find(c => c.id === id);
            if (cert) cert.observations = text;
            return true;
        }
        await APIClient.request(`/certificates/${id}/observation`, {
            method: 'POST',
            body: {
                observations: text
            }
        });
        await this.preload();
        return true;
    },

    generateBulkCertificates: async function() {
        if (USE_MOCK) {
            let count = 0;
            const settings = mockData.settings;
            const minPassingGrade = settings.minPassingGrade;

            mockData.enrollments.forEach(enr => {
                const student = mockData.students.find(s => s.id === enr.studentId);
                const group = mockData.groups.find(g => g.id === enr.groupId);
                if (!student || !group || group.status !== 'finished') return;

                const hasCert = mockData.certificates.some(c => c.studentId === enr.studentId && c.groupId === enr.groupId && c.status !== 'annulled');
                if (hasCert) return;

                const gradeRecord = mockData.grades.find(g => g.groupId === enr.groupId && g.studentId === enr.studentId);
                const course = mockData.courses.find(c => c.id === group.courseId);
                const average = gradeRecord ? this.calculateAverage(gradeRecord.moduleGrades, course) : 0;
                
                if (average >= minPassingGrade) {
                    const certId = 'CRT' + String(mockData.certificates.length + 1).padStart(3, '0');
                    mockData.certificates.push({
                        id: certId,
                        code: `CERT-${new Date().getFullYear()}-${String(mockData.certificates.length + 1).padStart(5, '0')}`,
                        studentId: enr.studentId,
                        groupId: enr.groupId,
                        type: 'certificado',
                        status: 'toBeSigned',
                        deanSigned: false,
                        directorSigned: false,
                        issueDate: new Date().toISOString().split('T')[0],
                        observations: 'Emisión automática en lote'
                    });
                    count++;
                }
            });
            return count;
        }

        const settings = await this.getSettings();
        const minPassingGrade = settings.minPassingGrade;
        const minAttendanceRequired = settings.minAttendanceRequired;

        const enrollments = await this.getEnrollments();
        const certificates = await this.getCertificates();
        const groups = await this.getGroups();
        const courses = await this.getCourses();
        const students = await this.getStudents();
        const grades = await this.getGrades();

        let count = 0;
        for (const enr of enrollments) {
            const student = students.find(s => s.id == enr.studentId);
            const group = groups.find(g => g.id == enr.groupId);
            if (!student || !group || (group.status !== 'finished' && group.status !== 'closed')) continue;

            const course = courses.find(c => c.id == group.courseId);
            if (!course) continue;

            const hasCert = certificates.some(c => c.studentId == enr.studentId && c.groupId == enr.groupId && c.type === 'certificado' && c.status !== 'annulled');
            if (hasCert) continue;

            const gradeRecord = grades.find(g => g.groupId == enr.groupId && g.studentId == enr.studentId);
            const average = gradeRecord ? this.calculateAverage(gradeRecord.moduleGrades, course) : 0;
            const attPct = await this.calculateAttendancePercentage(enr.studentId, enr.groupId);

            let isApt = average >= minPassingGrade;
            if (group.modality === 'regular' && attPct < minAttendanceRequired) {
                isApt = false;
            }

            if (isApt) {
                try {
                    await APIClient.request('/certificates', {
                        method: 'POST',
                        body: {
                            student_id: enr.studentId,
                            group_id: enr.groupId,
                            type: 'certificado',
                            observations: 'Emisión automática en lote'
                        }
                    });
                    count++;
                } catch (e) {
                    console.error("Error al emitir certificado en bulk:", e);
                }
            }
        }

        if (count > 0) {
            await this.preload();
        }
        return count;
    },

    // Report operations
    getSavedReports: function() {
        if (USE_MOCK) {
            return mockData.savedReports || [];
        }
        return this.cache.reports;
    },

    createReport: async function(reportData) {
        if (USE_MOCK) {
            reportData.id = 'REP' + String(mockData.savedReports.length + 1).padStart(3, '0');
            reportData.createdAt = new Date().toISOString().split('T')[0];
            mockData.savedReports.push(reportData);
            return reportData;
        }
        const body = {
            name: reportData.name,
            type: reportData.type,
            query_config: reportData.queryConfig
        };
        const res = await APIClient.request('/reports/saved', {
            method: 'POST',
            body: body
        });
        const mapped = mappers.savedReport(res.data);
        await this.preload();
        return mapped;
    },

    updateReport: async function(id, reportData) {
        if (USE_MOCK) {
            const report = mockData.savedReports.find(r => r.id === id);
            if (report) {
                Object.assign(report, reportData);
                return report;
            }
            return null;
        }
        const body = {
            name: reportData.name,
            type: reportData.type,
            query_config: reportData.queryConfig
        };
        const res = await APIClient.request(`/reports/saved/${id}`, {
            method: 'PUT',
            body: body
        });
        const mapped = mappers.savedReport(res.data);
        await this.preload();
        return mapped;
    },

    deleteReport: async function(id) {
        if (USE_MOCK) {
            const idx = mockData.savedReports.findIndex(r => r.id === id);
            if (idx !== -1) {
                mockData.savedReports.splice(idx, 1);
                return true;
            }
            return false;
        }
        await APIClient.request(`/reports/saved/${id}`, {
            method: 'DELETE'
        });
        await this.preload();
        return true;
    },

    // User operations
    getUsers: function() {
        if (USE_MOCK) {
            return mockData.users || [];
        }
        return this.cache.users;
    },

    createUser: async function(userData) {
        if (USE_MOCK) {
            userData.id = 'USR' + String(mockData.users.length + 1).padStart(3, '0');
            userData.lastLogin = '-';
            mockData.users.push(userData);
            return userData;
        }
        const res = await APIClient.request('/users', {
            method: 'POST',
            body: userToAPI(userData)
        });
        await this.preload();
        return res.data;
    },

    updateUser: async function(id, data) {
        if (USE_MOCK) {
            const user = mockData.users.find(u => u.id === id);
            if (user) {
                Object.assign(user, data);
                return user;
            }
            return null;
        }
        await APIClient.request(`/users/${id}`, {
            method: 'PUT',
            body: userToAPI(data)
        });
        await this.preload();
        return true;
    },

    changeUserPassword: async function(id, currentPassword, newPassword) {
        if (USE_MOCK) {
            const user = mockData.users.find(u => u.id === id);
            if (user) {
                user.password = newPassword;
                return true;
            }
            return false;
        }
        await APIClient.request(`/users/${id}/password`, {
            method: 'PUT',
            body: {
                current_password: currentPassword,
                new_password: newPassword
            }
        });
        return true;
    },

    getRoles: function() {
        if (USE_MOCK) {
            return Object.keys(mockData.rolePermissions).map(roleKey => {
                const roleLabels = {
                    admin: 'Administrador',
                    secretary: 'Secretaria Académica',
                    teacher: 'Docente',
                    coordinator: 'Coordinador Académico',
                    dean: 'Decano'
                };
                return {
                    id: roleKey,
                    name: roleLabels[roleKey] || roleKey,
                    permissions: mockData.rolePermissions[roleKey]
                };
            });
        }
        return this.cache.roles;
    },

    updateRolePermissions: async function(roleKey, permissions) {
        if (USE_MOCK) {
            if (mockData.rolePermissions[roleKey]) {
                mockData.rolePermissions[roleKey] = permissions;
                return true;
            }
            return false;
        }
        await APIClient.request(`/roles/${roleKey}/permissions`, {
            method: 'PUT',
            body: { permissions }
        });
        await this.preload();
        return true;
    },

    // Settings operations
    getSettings: function() {
        if (USE_MOCK) {
            return mockData.settings;
        }
        return this.cache.settings;
    },

    saveSettings: async function(settingsData) {
        if (USE_MOCK) {
            mockData.settings = Object.assign(mockData.settings, settingsData);
            return mockData.settings;
        }
        await APIClient.request('/settings', {
            method: 'PUT',
            body: settingsToAPI(settingsData)
        });
        await this.preload();
        return settingsData;
    },

    restoreDefaultSettings: async function() {
        const defaults = {
            systemName: 'SAII',
            instituteName: 'Instituto de Informática',
            universityName: 'Universidad Nacional de Piura',
            instituteEmail: 'info@institutoinformatica.edu.pe',
            institutePhone: '+51 (73) 123-4567',
            academicPeriod: '2024-I',
            minPassingGrade: 11,
            minAttendanceRequired: 70,
            defaultTheme: 'light',
            enableNotifications: true,
            enableAutoSave: true,
            systemLanguage: 'es',
            responsibleAcademic: 'DR. JONATHAN DAVID NIMA RAMOS - Director'
        };
        if (USE_MOCK) {
            mockData.settings = defaults;
            return defaults;
        }
        await this.saveSettings(defaults);
        return defaults;
    },

    requestForgotPasswordCode: async function(email) {
        if (USE_MOCK) {
            const user = mockData.users.find(u => u.email === email);
            if (!user) throw new Error("No se encontró ningún usuario con ese correo electrónico.");
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            this._mockRecoveryToken = token;
            this._mockRecoveryEmail = email;
            return token;
        }
        const res = await APIClient.request('/auth/forgot-password', {
            method: 'POST',
            body: { email }
        });
        return res.code;
    },

    resetUserPasswordWithCode: async function(code, newPassword) {
        if (USE_MOCK) {
            if (code !== this._mockRecoveryToken) {
                throw new Error("El código de recuperación es incorrecto.");
            }
            const user = mockData.users.find(u => u.email === this._mockRecoveryEmail);
            if (user) {
                user.password = newPassword;
                return true;
            }
            throw new Error("Usuario no encontrado.");
        }
        await APIClient.request('/auth/reset-password', {
            method: 'POST',
            body: {
                code,
                new_password: newPassword
            }
        });
        return true;
    },

    getTeacherIdForUser: function(user) {
        if (!user) return null;
        return user.teacherId;
    },

    // Helper functions
    ensureAllGroupsHaveAttendance: function() {},
    ensureAllGroupsHaveGradeSheet: function() {}
};
