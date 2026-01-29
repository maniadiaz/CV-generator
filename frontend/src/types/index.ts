// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_premium: boolean;
  last_login: string;
  login_attempts: number;
  locked_until: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Profile Types
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Language {
  id: string;
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'native';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  current: boolean;
  url?: string;
  github?: string;
}

export interface CVProfile {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  template: string;
  is_default: boolean;
  completion_percentage: number;
  download_count: number;
  last_exported_at: string | null;
  created_at: string;
  updated_at: string;
  personalInfo?: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Language[];
  certificates?: Certificate[];
  projects?: Project[];
}

export interface ProfileState {
  profiles: CVProfile[];
  currentProfile: CVProfile | null;
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    default_profile_id: number | null;
    most_downloaded: CVProfile | null;
  } | null;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// App Types
export interface AppState {
  loading: boolean;
  error: string | null;
  language: 'es' | 'en';
}
