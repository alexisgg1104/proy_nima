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
            startDate: '2024-01-20',
            endDate: '2024-04-20',
            hours: 150,
            maxQuota: 30,
            status: 'inprogress',
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
            startDate: '2024-03-20',
            endDate: '2024-03-20',
            hours: 0,
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
    ],

    // Attendance Records
    attendance: [
        { id: 'ATD001', groupId: 'GRP001', studentId: 'ALU001', date: '2024-02-05', status: 'present', observation: '' },
        { id: 'ATD002', groupId: 'GRP001', studentId: 'ALU002', date: '2024-02-05', status: 'present', observation: '' },
        { id: 'ATD003', groupId: 'GRP001', studentId: 'ALU003', date: '2024-02-05', status: 'late', observation: 'Tráfico' },
        { id: 'ATD004', groupId: 'GRP001', studentId: 'ALU004', date: '2024-02-05', status: 'absent', observation: '' },
        { id: 'ATD005', groupId: 'GRP001', studentId: 'ALU007', date: '2024-02-05', status: 'justified', observation: 'Médico' },
    ],

    // Grades
    grades: [
        { id: 'GRD001', groupId: 'GRP001', studentId: 'ALU001', moduleGrades: { MOD001: 16, MOD002: 15, MOD003: 17 } },
        { id: 'GRD002', groupId: 'GRP001', studentId: 'ALU002', moduleGrades: { MOD001: 14, MOD002: 13, MOD003: 15 } },
        { id: 'GRD003', groupId: 'GRP001', studentId: 'ALU003', moduleGrades: { MOD001: 18, MOD002: 17, MOD003: 16 } },
        { id: 'GRD004', groupId: 'GRP001', studentId: 'ALU004', moduleGrades: { MOD001: 12, MOD002: 10, MOD003: 9 } },
        { id: 'GRD005', groupId: 'GRP001', studentId: 'ALU007', moduleGrades: { MOD001: 15, MOD002: 16, MOD003: 14 } },
    ],

    // Certificates
    certificates: [
        { id: 'CRT001', studentId: 'ALU001', groupId: 'GRP001', code: 'CERT-2024-00001', issueDate: '2024-03-20', status: 'issued' },
        { id: 'CRT002', studentId: 'ALU002', groupId: 'GRP001', code: 'CERT-2024-00002', issueDate: '2024-03-20', status: 'issued' },
        { id: 'CRT003', studentId: 'ALU003', groupId: 'GRP001', code: 'CERT-2024-00003', issueDate: '2024-03-20', status: 'issued' },
    ],

    // System Users
    users: [
        { id: 'USR001', username: 'admin', fullName: 'Administrador Principal', role: 'admin', email: 'admin@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-15 10:30' },
        { id: 'USR002', username: 'secretaria', fullName: 'Juan María Secretaria', role: 'secretary', email: 'secretaria@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-14 09:15' },
        { id: 'USR003', username: 'roberto.silva', fullName: 'Roberto Silva Acosta', role: 'teacher', email: 'roberto.silva@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-15 08:00' },
        { id: 'USR004', username: 'coordinador', fullName: 'Carlos Coordinador Académico', role: 'coordinator', email: 'coordinador@institutoinformatica.edu.pe', status: 'active', lastLogin: '2024-02-13 14:45' },
    ]
};

// Utility functions for data management
const DataManager = {
    // Login validation
    validateLogin: function(username, password, role) {
        // Mock login - always succeeds for demo purposes
        if (username && password && role) {
            const user = mockData.users.find(u => u.username === username && u.role === role);
            if (user) {
                mockData.currentUser = { ...user };
                return true;
            }
            // Demo: allow any login
            mockData.currentUser = {
                id: 'USR999',
                username: username,
                fullName: 'Usuario Demo',
                email: username + '@institutoinformatica.edu.pe',
                role: role,
                lastLogin: new Date()
            };
            return true;
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

    // Attendance operations
    getAttendanceByGroupAndDate: function(groupId, date) {
        return mockData.attendance.filter(a => a.groupId === groupId && a.date === date);
    },

    addAttendance: function(groupId, studentId, date, status, observation) {
        const existingRecord = mockData.attendance.find(a => a.groupId === groupId && a.studentId === studentId && a.date === date);
        if (existingRecord) {
            existingRecord.status = status;
            existingRecord.observation = observation;
            return existingRecord;
        }
        const newRecord = {
            id: 'ATD' + String(mockData.attendance.length + 1).padStart(3, '0'),
            groupId: groupId,
            studentId: studentId,
            date: date,
            status: status,
            observation: observation
        };
        mockData.attendance.push(newRecord);
        return newRecord;
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
    }
};
