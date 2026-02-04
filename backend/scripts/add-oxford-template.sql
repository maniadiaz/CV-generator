-- Migration to add 'oxford' template to profiles table
-- Run this SQL on your database

USE cv_generator;

-- Add 'oxford' to the template ENUM
ALTER TABLE profiles
MODIFY COLUMN template ENUM('harvard_classic', 'harvard_modern', 'oxford')
NOT NULL
DEFAULT 'harvard_classic'
COMMENT 'Template design chosen';

-- Verify the change
SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'cv_generator'
  AND TABLE_NAME = 'profiles'
  AND COLUMN_NAME = 'template';
