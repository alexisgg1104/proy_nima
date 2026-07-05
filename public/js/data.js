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
const DataManager = {
    currentUser: null,

    // Login validation
    validateLogin: function(username, password, role) {
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
    },

    // Student operations
    getStudents: function() {
        return mockData.students;
    },

    addStudent: function(studentData) {
        const newStudent = {
            id: 'ALU' + String(mockData.students.length + 1).padStart(3, '0'),
            ...studentData
        };
        mockData.students.push(newStudent);
        return newStudent;
    },

    updateStudent: function(id, updates) {
        const student = mockData.students.find(s => s.id === id);
        if (student) {
            Object.assign(student, updates);
            return student;
        }
        return null;
    },

    getStudentById: function(id) {
        return mockData.students.find(s => s.id === id);
    },

    // Course operations
    getCourses: function() {
        return mockData.courses;
    },

    getCourseById: function(id) {
        return mockData.courses.find(c => c.id === id);
    },

    addCourse: function(courseData) {
        const newCourse = {
            id: 'CRS' + String(mockData.courses.length + 1).padStart(3, '0'),
            ...courseData
        };
        mockData.courses.push(newCourse);
        return newCourse;
    },

    updateTeacher: function(id, updates) {
        const teacher = mockData.teachers.find(t => t.id === id);
        if (teacher) {
            Object.assign(teacher, updates);
            return teacher;
        }
        return null;
    },

    // Teacher operations
    getTeachers: function() {
        return mockData.teachers;
    },

    addTeacher: function(teacherData) {
        const newTeacher = {
            id: 'TCH' + String(mockData.teachers.length + 1).padStart(3, '0'),
            ...teacherData
        };
        mockData.teachers.push(newTeacher);
        return newTeacher;
    },

    getTeacherById: function(id) {
        return mockData.teachers.find(t => t.id === id);
    },

    // Group operations
    getGroups: function() {
        return mockData.groups;
    },

    getGroupById: function(id) {
        return mockData.groups.find(g => g.id === id);
    },

    addGroup: function(groupData) {
        const newGroup = {
            id: 'GRP' + String(mockData.groups.length + 1).padStart(3, '0'),
            ...groupData
        };
        mockData.groups.push(newGroup);
        return newGroup;
    },

    updateGroup: function(id, updates) {
        const group = mockData.groups.find(g => g.id === id);
        if (group) {
            Object.assign(group, updates);
            return group;
        }
        return null;
    },

    // Enrollment operations
    getEnrollments: function(groupId) {
        return mockData.enrollments.filter(e => e.groupId === groupId);
    },

    addEnrollment: function(groupId, studentId) {
        const existingEnrollment = mockData.enrollments.find(e => e.groupId === groupId && e.studentId === studentId);
        if (existingEnrollment) {
            return null; // Already enrolled
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
    },

    removeEnrollment: function(enrollmentId) {
        const index = mockData.enrollments.findIndex(e => e.id === enrollmentId);
        if (index > -1) {
            mockData.enrollments.splice(index, 1);
            return true;
        }
        return false;
    },

    // ===== STUDENT ATTENDANCE — Fase 5: Control de Asistencia de Alumnos (Enfoque Matriz) =====

    ensureAllGroupsHaveAttendance: function() {
        mockData.groups.forEach(g => {
            const exists = mockData.studentAttendanceByGroup.find(att => att.groupId === g.id);
            if (!exists) {
                const attId = `AST-${g.code}`;
                const enrolled = this.getEnrolledStudentsByGroup(g.id);
                
                // Generar fechas por defecto
                const days = [];
                if (g.startDate) {
                    const start = new Date(g.startDate);
                    for (let i = 0; i < 4; i++) {
                        const d = new Date(start);
                        d.setDate(start.getDate() + (i * 2));
                        days.push(d.toISOString().split('T')[0]);
                    }
                } else {
                    days.push(new Date().toISOString().split('T')[0]);
                }

                const newAtt = {
                    id: attId,
                    groupId: g.id,
                    teacherId: g.teacherId,
                    status: 'borrador',
                    days: days,
                    students: enrolled.map(student => ({
                        studentId: student.id,
                        attendance: {}
                    }))
                };
                mockData.studentAttendanceByGroup.push(newAtt);
            }
        });
    },

    getStudentAttendanceByGroup: function(groupId) {
        this.ensureAllGroupsHaveAttendance();
        return mockData.studentAttendanceByGroup.find(att => att.groupId === groupId) || null;
    },

    getStudentAttendanceByTeacher: function(teacherId) {
        this.ensureAllGroupsHaveAttendance();
        return mockData.studentAttendanceByGroup.filter(att => att.teacherId === teacherId);
    },

    getAllStudentAttendance: function() {
        this.ensureAllGroupsHaveAttendance();
        return mockData.studentAttendanceByGroup;
    },

    getStudentAttendanceById: function(id) {
        this.ensureAllGroupsHaveAttendance();
        const att = mockData.studentAttendanceByGroup.find(att => att.id === id);
        if (att) {
            // Sync enrolled students in case they changed
            const enrolled = this.getEnrolledStudentsByGroup(att.groupId);
            enrolled.forEach(student => {
                const hasRecord = att.students.some(s => s.studentId === student.id);
                if (!hasRecord) {
                    att.students.push({
                        studentId: student.id,
                        attendance: {}
                    });
                }
            });
        }
        return att || null;
    },

    getEnrolledStudentsByGroup: function(groupId) {
        const enrollments = mockData.enrollments.filter(e => e.groupId === groupId && e.status === 'active');
        return enrollments.map(e => mockData.students.find(s => s.id === e.studentId)).filter(s => s);
    },

    updateStudentAttendanceRecord: function(attendanceId, studentId, date, value) {
        const attendance = mockData.studentAttendanceByGroup.find(att => att.id === attendanceId);
        if (!attendance || attendance.status === 'cerrado') return null;
        
        let studentRecord = attendance.students.find(s => s.studentId === studentId);
        if (!studentRecord) {
            studentRecord = { studentId: studentId, attendance: {} };
            attendance.students.push(studentRecord);
        }
        studentRecord.attendance[date] = value;
        return studentRecord;
    },

    updateStudentAttendanceStatus: function(attendanceId, newStatus) {
        const attendance = mockData.studentAttendanceByGroup.find(att => att.id === attendanceId);
        if (!attendance) return null;
        attendance.status = newStatus;
        return attendance;
    },

    markAllStudentsPresentForDay: function(attendanceId, date) {
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
    },

    // Grade operations
    getGradesByGroup: function(groupId) {
        return mockData.grades.filter(g => g.groupId === groupId);
    },

    saveGrade: function(groupId, studentId, moduleGrades) {
        let grade = mockData.grades.find(g => g.groupId === groupId && g.studentId === studentId);
        if (!grade) {
            grade = {
                id: 'GRD' + String(mockData.grades.length + 1).padStart(3, '0'),
                groupId: groupId,
                studentId: studentId,
                moduleGrades: {}
            };
            mockData.grades.push(grade);
        }
        grade.moduleGrades = moduleGrades;
        return grade;
    },

    // Utility calculations
    calculateAverage: function(moduleGrades, course) {
        if (!course || !course.modules) return 0;
        let total = 0;
        let weightedSum = 0;
        
        course.modules.forEach(module => {
            const grade = moduleGrades[module.id] || 0;
            const weight = module.percentage / 100;
            weightedSum += grade * weight;
        });
        
        return Math.round(weightedSum * 10) / 10;
    },

    getStudentsByGroup: function(groupId) {
        const enrollments = mockData.enrollments.filter(e => e.groupId === groupId);
        return enrollments.map(e => mockData.students.find(s => s.id === e.studentId)).filter(s => s);
    },

    // Certificate operations
    generateCertificate: function(studentId, groupId) {
        const certificate = {
            id: 'CRT' + String(mockData.certificates.length + 1).padStart(3, '0'),
            studentId: studentId,
            groupId: groupId,
            code: 'CERT-' + new Date().getFullYear() + '-' + String(mockData.certificates.length + 1).padStart(5, '0'),
            issueDate: new Date().toISOString().split('T')[0],
            status: 'issued'
        };
        mockData.certificates.push(certificate);
        return certificate;
    },

    getCertificatesByGroup: function(groupId) {
        return mockData.certificates.filter(c => c.groupId === groupId);
    },

    // ===== GRADE SHEETS (FASE 6) =====
    ensureAllGroupsHaveGradeSheet: function() {
        if (!mockData.gradeSheets) {
            mockData.gradeSheets = [];
        }
        mockData.groups.forEach(g => {
            const exists = mockData.gradeSheets.find(gs => gs.groupId === g.id);
            if (!exists) {
                mockData.gradeSheets.push({
                    groupId: g.id,
                    status: (g.status === 'closed' || g.status === 'finished') ? 'cerrada' : 'borrador',
                    updatedAt: new Date().toISOString().split('T')[0]
                });
            }
        });
    },

    getGradeSheetByGroup: function(groupId) {
        this.ensureAllGroupsHaveGradeSheet();
        return mockData.gradeSheets.find(gs => gs.groupId === groupId) || null;
    },

    updateGradeSheetStatus: function(groupId, newStatus) {
        this.ensureAllGroupsHaveGradeSheet();
        const gs = mockData.gradeSheets.find(gs => gs.groupId === groupId);
        if (gs) {
            gs.status = newStatus;
            gs.updatedAt = new Date().toISOString().split('T')[0];
            return gs;
        }
        return null;
    },

    getTeacherIdForUser: function(user) {
        if (!user) return null;
        if (user.teacherId) return user.teacherId;
        if (user.role !== 'teacher') return null;
        const teacher = mockData.teachers.find(t => t.email === user.email);
        return teacher ? teacher.id : null;
    },

    isGradeSheetComplete: function(groupId) {
        const group = this.getGroupById(groupId);
        if (!group) return false;
        const course = this.getCourseById(group.courseId);
        if (!course) return false;
        
        const enrolled = this.getEnrolledStudentsByGroup(groupId);
        if (enrolled.length === 0) return false;
        
        for (let i = 0; i < enrolled.length; i++) {
            const student = enrolled[i];
            const grade = mockData.grades.find(g => g.groupId === groupId && g.studentId === student.id);
            if (!grade) return false;
            
            for (let j = 0; j < course.modules.length; j++) {
                const mod = course.modules[j];
                const val = grade.moduleGrades[mod.id];
                if (val === undefined || val === null || val === '') {
                    return false;
                }
            }
        }
        return true;
    },

    // Calculate attendance percentage for a student in a group
    calculateAttendancePercentage: function(studentId, groupId) {
        const att = mockData.studentAttendanceByGroup.find(a => a.groupId === groupId);
        if (!att || !att.days || att.days.length === 0) {
            return 100; // if no attendance records exist, count as 100% or default.
        }
        const studentRec = att.students.find(s => s.studentId === studentId);
        if (!studentRec || !studentRec.attendance) {
            return 0;
        }
        const totalDays = att.days.length;
        let activeDays = 0;
        att.days.forEach(d => {
            const status = studentRec.attendance[d];
            if (status === 'presente' || status === 'tarde') {
                activeDays++;
            }
        });
        return Math.round((activeDays / totalDays) * 100);
    },

    // Report operations
    getSavedReports: function() {
        return mockData.savedReports || [];
    },

    createReport: function(report) {
        if (!mockData.savedReports) mockData.savedReports = [];
        report.id = 'REP' + String(mockData.savedReports.length + 1).padStart(3, '0');
        report.createdAt = new Date().toISOString().split('T')[0];
        mockData.savedReports.push(report);
        return report;
    },

    updateReport: function(id, data) {
        const report = mockData.savedReports.find(r => r.id === id);
        if (report) {
            Object.assign(report, data);
            return report;
        }
        return null;
    },

    deleteReport: function(id) {
        const idx = mockData.savedReports.findIndex(r => r.id === id);
        if (idx !== -1) {
            mockData.savedReports.splice(idx, 1);
            return true;
        }
        return false;
    },

    // User operations
    getUsers: function() {
        return mockData.users || [];
    },

    createUser: function(user) {
        user.id = 'USR' + String(mockData.users.length + 1).padStart(3, '0');
        user.lastLogin = '-';
        if (!user.status) user.status = 'active';
        mockData.users.push(user);
        return user;
    },

    updateUser: function(id, data) {
        const user = mockData.users.find(u => u.id === id);
        if (user) {
            Object.assign(user, data);
            return user;
        }
        return null;
    },

    // Roles and Permissions operations
    getRoles: function() {
        return Object.keys(mockData.rolePermissions).map(roleKey => {
            const roleLabels = {
                admin: 'Administrador',
                secretary: 'Secretaria Académica',
                teacher: 'Docente',
                coordinator: 'Coordinador Académico'
            };
            return {
                id: roleKey,
                name: roleLabels[roleKey] || roleKey,
                permissions: mockData.rolePermissions[roleKey]
            };
        });
    },

    updateRolePermissions: function(roleKey, permissions) {
        if (mockData.rolePermissions[roleKey]) {
            mockData.rolePermissions[roleKey] = permissions;
            return true;
        }
        return false;
    },

    // Settings operations
    getSettings: function() {
        return mockData.settings;
    },

    saveSettings: function(settingsData) {
        mockData.settings = Object.assign(mockData.settings, settingsData);
        return mockData.settings;
    },

    restoreDefaultSettings: function() {
        mockData.settings = {
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
        return mockData.settings;
    },

    // Certificates operations (Fase 7 Extensions)
    annulCertificate: function(id) {
        const idx = mockData.certificates.findIndex(c => c.id === id);
        if (idx !== -1) {
            mockData.certificates.splice(idx, 1);
            return true;
        }
        return false;
    },

    createCertificate: function(certData) {
        const certId = 'CRT' + String(mockData.certificates.length + 1).padStart(3, '0');
        const codePrefix = certData.type === 'constancia' ? 'CONS' : 'CERT';
        const newCert = {
            id: certId,
            code: `${codePrefix}-${new Date().getFullYear()}-${String(mockData.certificates.length + 1).padStart(5, '0')}`,
            studentId: certData.studentId,
            groupId: certData.groupId,
            type: certData.type,
            status: certData.status || 'toBeSigned',
            deanSigned: certData.deanSigned || false,
            directorSigned: certData.directorSigned || false,
            deanSignedAt: certData.deanSignedAt || null,
            directorSignedAt: certData.directorSignedAt || null,
            deanSignerName: certData.deanSignerName || null,
            directorSignerName: certData.directorSignerName || null,
            issueDate: certData.issueDate || new Date().toISOString().split('T')[0],
            observations: certData.observations || ''
        };
        mockData.certificates.push(newCert);
        return newCert;
    },

    generateBulkCertificates: function() {
        let count = 0;
        mockData.certificates.forEach(c => {
            if (c.status === 'pending') {
                c.status = 'generated';
                c.issueDate = new Date().toISOString().split('T')[0];
                count++;
            }
        });
        return count;
    }

};
