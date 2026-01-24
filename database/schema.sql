-- =============================================
-- CV GENERATOR - DATABASE SCHEMA
-- =============================================
-- Base de datos para almacenar usuarios y CVs
-- Compatible con MySQL/MariaDB
-- =============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS cv_generator
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE cv_generator;

-- =============================================
-- TABLA: users (Usuarios del sistema)
-- =============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires DATETIME,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: sessions (Sesiones de usuario)
-- =============================================
CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: profiles (Perfiles de CV)
-- =============================================
CREATE TABLE profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT 'Mi CV',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: personal_info (Información personal)
-- =============================================
CREATE TABLE personal_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL UNIQUE,
    full_name VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(50),
    address VARCHAR(300),
    city VARCHAR(100),
    country VARCHAR(100),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    twitter VARCHAR(255),
    portfolio VARCHAR(255),
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: education (Educación)
-- =============================================
CREATE TABLE education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(150),
    field VARCHAR(150),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    gpa VARCHAR(20),
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: experience (Experiencia laboral)
-- =============================================
CREATE TABLE experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    company VARCHAR(200) NOT NULL,
    position VARCHAR(150) NOT NULL,
    location VARCHAR(150),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: skills (Habilidades)
-- =============================================
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- 'technical', 'soft', 'language', etc.
    level INT, -- 1-5 o 1-100
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: languages (Idiomas)
-- =============================================
CREATE TABLE languages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL, -- 'Básico', 'Intermedio', 'Avanzado', 'Nativo', 'C1', etc.
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- =============================================
-- TABLA: certifications (Certificaciones)
-- =============================================
CREATE TABLE certifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    issuer VARCHAR(200),
    date VARCHAR(50),
    credential_id VARCHAR(100),
    credential_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- =============================================
-- ÍNDICES para optimizar consultas
-- =============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification ON users(verification_token);
CREATE INDEX idx_users_reset ON users(reset_password_token);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_profiles_user ON profiles(user_id);
CREATE INDEX idx_education_profile ON education(profile_id);
CREATE INDEX idx_experience_profile ON experience(profile_id);
CREATE INDEX idx_skills_profile ON skills(profile_id);
CREATE INDEX idx_languages_profile ON languages(profile_id);
CREATE INDEX idx_certifications_profile ON certifications(profile_id);

-- =============================================
-- VISTAS útiles
-- =============================================

-- Vista para obtener perfil completo con info personal
CREATE VIEW v_profile_summary AS
SELECT
    p.id AS profile_id,
    p.user_id,
    p.name AS profile_name,
    pi.full_name,
    pi.email,
    pi.phone,
    pi.city,
    pi.country,
    (SELECT COUNT(*) FROM experience e WHERE e.profile_id = p.id) AS experience_count,
    (SELECT COUNT(*) FROM education ed WHERE ed.profile_id = p.id) AS education_count,
    (SELECT COUNT(*) FROM skills s WHERE s.profile_id = p.id) AS skills_count,
    p.created_at,
    p.updated_at
FROM profiles p
LEFT JOIN personal_info pi ON pi.profile_id = p.id;

-- =============================================
-- DATOS DE EJEMPLO (opcional)
-- =============================================

-- Usuario de prueba (password: 'password123' hasheado con bcrypt)
-- INSERT INTO users (email, password_hash, first_name, last_name, is_verified)
-- VALUES ('test@example.com', '$2b$10$exemplo_hash_aqui', 'Usuario', 'Prueba', TRUE);
