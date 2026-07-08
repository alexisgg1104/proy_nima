-- SAII - Base de Datos - Datos Iniciales Semilla (DML)
-- Universidad Nacional de Piura - Facultad de Ingeniería Industrial

USE saii_db;

-- 1. Settings
INSERT INTO settings (id, system_name, institute_name, university_name, institute_email, institute_phone, academic_period, min_passing_grade, min_attendance_required, default_theme, enable_notifications, enable_auto_save, system_language, responsible_academic) VALUES 
(1, 'SAII', 'Instituto de Informática', 'Universidad Nacional de Piura', 'info@institutoinformatica.edu.pe', '+51 (73) 123-4567', '2024-I', 11, 70, 'light', 1, 1, 'es', 'DR. JONATHAN DAVID NIMA RAMOS - Director');

-- 2. Roles
INSERT INTO roles (id, name, key_name, permissions) VALUES 
(1, 'Administrador', 'admin', '["dashboard","students","courses","teachers","groups","enrollments","attendance","grades","certificates","reports","users","settings"]'),
(2, 'Secretaria Académica', 'secretary', '["dashboard","students","enrollments","certificates","reports"]'),
(3, 'Docente', 'teacher', '["dashboard","grades","attendance","reports"]'),
(4, 'Coordinador Académico', 'coordinator', '["dashboard","courses","groups","reports","students"]'),
(5, 'Decano', 'dean', '["dashboard","certificates"]');

-- 3. Users
-- Contraseña encriptada por defecto: admin123 / secretaria123 / docente123 / coordinador123 / decano123
-- Utiliza hashes reales PHP compatible: password_hash('...', PASSWORD_DEFAULT)
INSERT INTO users (id, username, password, full_name, email, role_id, status) VALUES 
(1, 'admin', '$2y$10$ZfnjIbCSmg6OwSocj2LsLuvGBoySkaw/.5UQjis0cVfF.rpkP9ova', 'DR. JONATHAN DAVID NIMA RAMOS', 'manuelalexissandovalcarrasco@gmail.com', 1, 'active'),
(2, 'secretaria', '$2y$10$GuGGcL2vEugjZOHYzOsImuwkdYCRwQ2VDtt22RLwjC/NUdAWchj1G', 'Juan María Secretaria', 'secretaria@institutoinformatica.edu.pe', 2, 'active'),
(3, 'roberto.silva', '$2y$10$Lu5pHmYtNQ5YuOxWr8hDJ.S56i2XbB3h.s0wHDgbn4rW9BkJpMw.C', 'Roberto Silva', 'roberto.silva@institutoinformatica.edu.pe', 3, 'active'),
(4, 'coordinador', '$2y$10$CLZvo9hP8IV5C8ZhMTsyuOp8HauLvzkpr3JU5NMMOmzkiK2i9/H..', 'Carlos Coordinador Académico', 'coordinador@institutoinformatica.edu.pe', 4, 'active'),
(5, 'lucia.espinoza', '$2y$10$Lu5pHmYtNQ5YuOxWr8hDJ.S56i2XbB3h.s0wHDgbn4rW9BkJpMw.C', 'Lucía Espinoza', 'lucia.espinoza@institutoinformatica.edu.pe', 3, 'active'),
(6, 'decano', '$2y$10$w1I437LVXlKsf1mBppu4Zu0.zpRF7GEGdOxQTV9Z1Ve73BD6vbxNa', 'Dr. Francisco Javier Cruz Vilchez', 'decano@institutoinformatica.edu.pe', 5, 'active');

-- 4. Students
INSERT INTO students (id, user_id, code, dni, first_name, last_name, email, phone, cycle, promotion, status, observations) VALUES 
(1, NULL, '2024001000', '12345678', 'Juan', 'Pérez García', 'juan.perez@student.edu.pe', '987654321', 'I', '2024', 'active', ''),
(2, NULL, '2024002000', '23456789', 'María', 'López Rodríguez', 'maria.lopez@student.edu.pe', '987654322', 'II', '2024', 'active', ''),
(3, NULL, '2024003000', '34567890', 'Carlos', 'Martínez Sánchez', 'carlos.martinez@student.edu.pe', '987654323', 'I', '2023', 'active', ''),
(4, NULL, '2024004000', '45678901', 'Ana', 'García Flores', 'ana.garcia@student.edu.pe', '987654324', 'III', '2024', 'active', ''),
(5, NULL, '2024005000', '56789012', 'Pedro', 'Gutiérrez López', 'pedro.gutierrez@student.edu.pe', '987654325', 'II', '2023', 'inactive', 'Solicitud de retiro'),
(6, NULL, '2024006000', '67890123', 'Rosa', 'Hernández Torres', 'rosa.hernandez@student.edu.pe', '987654326', 'IV', '2022', 'active', ''),
(7, NULL, '2024007000', '78901234', 'Diego', 'Ramírez Cruz', 'diego.ramirez@student.edu.pe', '987654327', 'I', '2024', 'active', ''),
(8, NULL, '2024008000', '89012345', 'Sofia', 'Castillo Mendoza', 'sofia.castillo@student.edu.pe', '987654328', 'II', '2024', 'active', ''),
(9, NULL, '2024009000', '90123456', 'Luis', 'Vargas Ruiz', 'luis.vargas@student.edu.pe', '987654329', 'III', '2023', 'active', ''),
(10, NULL, '2024010000', '01234567', 'Carmen', 'Jiménez Morales', 'carmen.jimenez@student.edu.pe', '987654330', 'I', '2024', 'active', '');

-- 5. Teachers
INSERT INTO teachers (id, user_id, code, dni, first_name, last_name, email, phone, specialty, status) VALUES 
(1, 3, 'DOC001', '11111111', 'Roberto', 'Silva Acosta', 'roberto.silva@institutoinformatica.edu.pe', '987111111', 'Ofimática', 'active'),
(2, NULL, 'DOC002', '22222222', 'Patricia', 'Moreno Ruiz', 'patricia.moreno@institutoinformatica.edu.pe', '987222222', 'Programación', 'active'),
(3, NULL, 'DOC003', '33333333', 'Fernando', 'Gutierrez Palma', 'fernando.gutierrez@institutoinformatica.edu.pe', '987333333', 'Diseño', 'active'),
(4, 5, 'DOC004', '44444444', 'Lucia', 'Espinoza Torres', 'lucia.espinoza@institutoinformatica.edu.pe', '987444444', 'Computación básica', 'active'),
(5, NULL, 'DOC005', '55555555', 'Víctor', 'Campos López', 'victor.campos@institutoinformatica.edu.pe', '987555555', 'Matemática aplicada / Matlab', 'active');

-- 6. Courses
INSERT INTO courses (id, code, name, description, total_hours, status) VALUES 
(1, 'CB001', 'Computación Básica', 'Curso fundamental de informática', 120, 'active'),
(2, 'MO001', 'Microsoft Office', 'Aplicaciones de productividad', 150, 'active'),
(3, 'CI001', 'Computación para Ingenieros', 'Herramientas computacionales para ingeniería', 160, 'active');

-- 7. Course Modules
INSERT INTO course_modules (id, course_id, name, percentage) VALUES 
(1, 1, 'Windows', 20),
(2, 1, 'Word', 40),
(3, 1, 'Excel', 40),
(4, 2, 'Windows', 10),
(5, 2, 'Word', 20),
(6, 2, 'Excel', 25),
(7, 2, 'Access', 20),
(8, 2, 'PowerPoint', 15),
(9, 2, 'Internet', 10),
(10, 3, 'Windows', 10),
(11, 3, 'Word', 20),
(12, 3, 'Excel', 20),
(13, 3, 'Access', 20),
(14, 3, 'PowerPoint', 10),
(15, 3, 'Matlab', 10),
(16, 3, 'Internet', 10);

-- 8. Academic Groups
INSERT INTO academic_groups (id, code, course_id, teacher_id, modality, schedule, start_date, end_date, hours, max_quota, status, observations) VALUES 
(1, 'CB-2024-01', 1, 1, 'regular', 'Lun-Mié 08:00–10:00', '2024-01-15', '2024-03-15', 120, 30, 'inprogress', ''),
(2, 'CB-2024-02', 1, 4, 'regular', 'Mar-Jue 10:00–12:00', '2024-02-01', '2024-04-01', 120, 25, 'open', ''),
(3, 'MO-2024-01', 2, 1, 'regular', 'Sáb 08:00–12:00', '2024-01-20', '2024-04-20', 150, 30, 'finished', ''),
(4, 'CI-2024-01', 3, 5, 'regular', 'Lun-Vié 16:00–18:00', '2024-02-10', '2024-05-10', 160, 20, 'open', ''),
(5, 'CB-2024-SUF', 1, 4, 'exam', '10:00', '2024-03-20', '2024-03-20', 2, 50, 'open', 'Examen de suficiencia');

-- 9. Enrollments
INSERT INTO enrollments (id, group_id, student_id, enrollment_date, status) VALUES 
(1, 1, 1, '2024-01-10', 'active'),
(2, 1, 2, '2024-01-10', 'active'),
(3, 1, 3, '2024-01-11', 'active'),
(4, 1, 4, '2024-01-11', 'active'),
(5, 1, 7, '2024-01-12', 'active'),
(6, 2, 5, '2024-02-01', 'active'),
(7, 2, 6, '2024-02-02', 'active'),
(8, 3, 1, '2024-01-15', 'active'),
(9, 3, 8, '2024-01-15', 'active'),
(10, 3, 9, '2024-01-16', 'active'),
(11, 5, 1, '2024-03-15', 'active'),
(12, 5, 2, '2024-03-15', 'active');

-- 10. Grade Sheets
INSERT INTO grade_sheets (id, group_id, status) VALUES 
(1, 1, 'borrador'),
(2, 3, 'cerrada');

-- 11. Grade Records
INSERT INTO grade_records (grade_sheet_id, student_id, course_module_id, grade) VALUES 
-- Grupo GRP001, ALU001
(1, 1, 1, 16.00), (1, 1, 2, 15.00), (1, 1, 3, 17.00),
-- Grupo GRP001, ALU002
(1, 2, 1, 14.00), (1, 2, 2, 13.00), (1, 2, 3, 15.00),
-- Grupo GRP001, ALU003
(1, 3, 1, 18.00), (1, 3, 2, 17.00), (1, 3, 3, 16.00),
-- Grupo GRP001, ALU004
(1, 4, 1, 12.00), (1, 4, 2, 10.00), (1, 4, 3, 9.00),
-- Grupo GRP001, ALU007
(1, 7, 1, 15.00), (1, 7, 2, 16.00), (1, 7, 3, 14.00),
-- Grupo GRP003, ALU001
(2, 1, 4, 15.00), (2, 1, 5, 16.00), (2, 1, 6, 14.00), (2, 1, 7, 15.00), (2, 1, 8, 16.00), (2, 1, 9, 15.00),
-- Grupo GRP003, ALU008
(2, 8, 4, 14.00), (2, 8, 5, 15.00), (2, 8, 6, 13.00), (2, 8, 7, 14.00), (2, 8, 8, 15.00), (2, 8, 9, 14.00),
-- Grupo GRP003, ALU009
(2, 9, 4, 16.00), (2, 9, 5, 17.00), (2, 9, 6, 15.00), (2, 9, 7, 16.00), (2, 9, 8, 17.00), (2, 9, 9, 16.00);

-- 12. Student Attendance Lists
INSERT INTO student_attendance_lists (id, group_id, teacher_id, date, status, admin_observation) VALUES 
(1, 1, 1, '2024-01-22', 'registrada', ''),
(2, 1, 1, '2024-01-24', 'borrador', ''),
(3, 1, 1, '2024-01-26', 'borrador', ''),
(4, 1, 1, '2024-01-29', 'borrador', ''),
(5, 2, 4, '2024-02-05', 'borrador', ''),
(6, 2, 4, '2024-02-07', 'borrador', ''),
(7, 3, 1, '2024-01-20', 'cerrada', ''),
(8, 3, 1, '2024-01-27', 'cerrada', '');

-- 13. Student Attendance Records
INSERT INTO student_attendance_records (attendance_list_id, student_id, status, arrival_time, observation) VALUES 
-- Lista 1 (2024-01-22)
(1, 1, 'presente', NULL, ''), (1, 2, 'presente', NULL, ''), (1, 3, 'presente', NULL, ''), (1, 4, 'falta', NULL, ''), (1, 7, 'presente', NULL, ''),
-- Lista 2 (2024-01-24)
(2, 1, 'presente', NULL, ''), (2, 2, 'falta', NULL, ''), (2, 3, 'presente', NULL, ''), (2, 4, 'presente', NULL, ''), (2, 7, 'presente', NULL, ''),
-- Lista 3 (2024-01-26)
(3, 1, 'presente', NULL, ''), (3, 2, 'presente', NULL, ''), (3, 3, 'justificado', NULL, 'Justificación presentada'), (3, 4, 'presente', NULL, ''), (3, 7, 'presente', NULL, ''),
-- Lista 4 (2024-01-29)
(4, 1, 'presente', NULL, ''), (4, 2, 'presente', NULL, ''), (4, 3, 'presente', NULL, ''), (4, 4, 'presente', NULL, ''), (4, 7, 'presente', NULL, ''),
-- Lista 5 (2024-02-05)
(5, 5, 'presente', NULL, ''), (5, 6, 'falta', NULL, ''),
-- Lista 6 (2024-02-07)
(6, 5, 'presente', NULL, ''), (6, 6, 'presente', NULL, ''),
-- Lista 7 (2024-01-20)
(7, 1, 'presente', NULL, ''), (7, 8, 'presente', NULL, ''), (7, 9, 'presente', NULL, ''),
-- Lista 8 (2024-01-27)
(8, 1, 'presente', NULL, ''), (8, 8, 'falta', NULL, ''), (8, 9, 'justificado', NULL, 'Justificado');

-- 14. Certificates
INSERT INTO certificates (id, student_id, group_id, code, type, status, issue_date, observations) VALUES 
(1, 1, 1, 'CERT-2024-00001', 'certificado', 'generated', '2024-03-20', ''),
(2, 2, 1, 'CONS-2024-00002', 'constancia', 'pending', '2024-03-20', ''),
(3, 3, 1, 'CERT-2024-00003', 'certificado', 'toBeSigned', NULL, ''),
(4, 7, 1, 'CERT-2024-00004', 'certificado', 'toBeSigned', NULL, ''),
(5, 1, 3, 'CERT-2024-00005', 'certificado', 'toBeSigned', NULL, '');

-- 15. Certificate Signatures
INSERT INTO certificate_signatures (certificate_id, signer_name, signer_role, signed_at, is_signed) VALUES 
(1, 'DR. FRANCISCO JAVIER CRUZ VILCHEZ', 'Decano', '2024-03-20 12:00:00', 1),
(1, 'DR. JONATHAN DAVID NIMA RAMOS', 'Director', '2024-03-20 12:05:00', 1),
(2, 'DR. FRANCISCO JAVIER CRUZ VILCHEZ', 'Decano', '2024-03-20 12:00:00', 1),
(2, 'DR. JONATHAN DAVID NIMA RAMOS', 'Director', '2024-03-20 12:05:00', 1),
(4, 'DR. JONATHAN DAVID NIMA RAMOS', 'Director', '2024-03-20 12:05:00', 1),
(5, 'DR. FRANCISCO JAVIER CRUZ VILCHEZ', 'Decano', '2024-03-20 12:00:00', 1);

-- 16. Saved Reports
INSERT INTO saved_reports (id, name, type, created_by, created_at, query_config) VALUES 
(1, 'Alumnos en Riesgo Académico (Asistencia < 70%)', 'attendance', 'Admin', '2024-03-01', '{"minAtt":70}'),
(2, 'Resumen de Calificaciones por Curso', 'grades', 'Admin', '2024-03-05', '{}'),
(3, 'Historial de Certificados Emitidos 2024-I', 'certificates', 'Secretaria', '2024-03-10', '{}');
