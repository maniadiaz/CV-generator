-- Backup de tabla skills
-- Fecha: 2026-02-03T18:22:40.150Z
-- Base de datos: cv_generator

DROP TABLE IF EXISTS `skills_backup`;

CREATE TABLE `skills_backup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'Nombre de la habilidad (ej: "JavaScript", "React")',
  `category` enum('programming_languages','frameworks_libraries','databases','cloud_devops','mobile_development','design_tools','multimedia','graphic_design','project_management','business_analysis','marketing_digital','sales','accounting','finance','human_resources','healthcare','laboratory','teaching','legal','operations','logistics','architecture','engineering','communication','social_media','customer_service','office_tools','soft_skills','languages','other') NOT NULL DEFAULT 'other' COMMENT 'Categoría de la habilidad (33 categorías disponibles)',
  `proficiency_level` enum('beginner','intermediate','advanced','expert') NOT NULL DEFAULT 'intermediate' COMMENT 'Nivel de dominio',
  `years_of_experience` decimal(3,1) DEFAULT NULL COMMENT 'Años de experiencia (ej: 2.5)',
  `display_order` int(11) NOT NULL DEFAULT 0 COMMENT 'Orden de visualización',
  `is_visible` tinyint(1) DEFAULT 1 COMMENT 'Si debe mostrarse en el CV',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_skills_profile_id` (`profile_id`),
  KEY `idx_skills_category` (`profile_id`,`category`),
  KEY `idx_skills_display_order` (`profile_id`,`display_order`),
  CONSTRAINT `skills_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos (10 registros)
INSERT INTO `skills_backup` VALUES
(1, 2, 'React', 'frameworks_libraries', 'expert', '1.0', 1, 1, '2026-01-29 15:54:00', '2026-01-29 15:54:00'),
(2, 2, 'JavaScript', 'programming_languages', 'expert', '1.0', 1, 1, '2026-01-29 15:54:41', '2026-01-29 15:54:41'),
(3, 2, 'NodeJs', 'frameworks_libraries', 'expert', '1.0', 2, 1, '2026-01-31 04:35:13', '2026-01-31 04:35:13'),
(4, 2, 'MySQL', 'databases', 'expert', '1.0', 1, 1, '2026-01-31 04:35:31', '2026-01-31 04:35:31'),
(5, 2, 'TypeScrip', 'programming_languages', 'expert', '1.0', 2, 1, '2026-01-31 04:35:51', '2026-01-31 04:35:51'),
(6, 3, 'JavaScript', 'programming_languages', 'advanced', '2.0', 1, 1, '2026-01-31 04:43:01', '2026-01-31 04:43:01'),
(7, 3, 'TypeScript', 'programming_languages', 'intermediate', '1.0', 2, 1, '2026-01-31 04:43:22', '2026-01-31 04:43:22'),
(8, 3, 'MariaDB', 'databases', 'advanced', '3.0', 1, 1, '2026-01-31 04:43:39', '2026-01-31 04:43:39'),
(9, 3, 'MySQL', 'databases', 'advanced', '3.0', 2, 1, '2026-01-31 04:43:56', '2026-01-31 04:43:56'),
(13, 2, 'Traducción', 'languages', 'expert', '1.0', 1, 1, '2026-01-31 06:05:43', '2026-01-31 06:05:43');
