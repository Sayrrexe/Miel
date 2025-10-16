/* API Response Types */

// Общие типы
export type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

// Основные интерфейсы
export interface User {
  first_name: string;
  username: string;
  patronymic: string;
  phone: string;
  email: string;
  office: string;
}

export interface Candidate {
  index: number;
  photo: string;
  user: User;
}

// Типы для авторизации
export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

// Типы для задач
export interface Task {
  id: number;
  task: string;
  created_at?: string;
  due_date?: string;
  is_complete: boolean;
  is_deleted: boolean;
  user: string;
}

export interface TaskResponse {
  data: Task[];
}

export interface TaskStats {
  total_created?: number;
  total_completed?: number;
  total_deleted?: number;
  max_created_day?: string;
  max_completed_day?: string;
}

export interface TaskStatsResponse {
  data: TaskStats;
}

// Типы для фильтрации
export interface DateRange {
  start_date?: Value;
  end_date?: Value;
  due_date?: Value;
}

export interface FilterParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: keyof Task;
  sortOrder?: 'asc' | 'desc';
}

// Типы для ошибок
export interface ErrorResponse {
  error: string;
  details?: {
    [key: string]: string[];
  };
}

// Типы для ответов API
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  details?: Record<string, string[]>;
};

// Типы для запросов
export interface ApiRequestConfig {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, unknown> | FormData | string | null;
  token?: string;
  params?: Record<string, string | number | boolean>;
}

// Типы для кандидатов
export interface CandidateFilter {
  age_max?: number;
  age_min?: number;
  by_new?: boolean;
  courses?: string[];
}

export interface CandidateResponse {
  phone: string;
  email: string;
  full_name: string;
  role: string;
  data: Candidate[];
}

// Типы для пользователей
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  phone: string;
  office: string;
  role: string;
}

export interface UserResponse {
  data: UserProfile;
}

// Типы для курсов
export interface Course {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface CourseResponse {
  data: Course[];
}

// Типы для офисов
export interface Office {
  id: number;
  name: string;
  address: string;
  capacity: number;
}

export interface OfficeResponse {
  data: Office[];
}
