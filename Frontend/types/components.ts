// types/components.ts
import { Task, TaskStats } from './api';

// Базовые типы для компонентов
export interface BaseTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Типы для модальных окон задач
export interface CreateTaskModalProps extends BaseTaskModalProps {
  onCreate: (taskText: string, dueDate: Date) => Promise<void>;
}

export interface EditTaskModalProps extends BaseTaskModalProps {
  task: Task | null;
  onEdit: (taskId: number, taskText: string, dueDate: Date | null) => Promise<void>;
}

// Типы для компонентов задач
export interface TaskListProps {
  tasks: Task[];
  title: string;
  filter: (task: Task) => boolean;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// Типы для компонентов статистики
export interface TaskStatisticsProps {
  stats: TaskStats | null;
}

// Типы для компонентов фильтров (TODO TaskFiltersProps если нужно, то пересмотреть)
export interface TaskFiltersProps {
  value: string;
  onChange: (value: string) => void;
  onFilter: (date?: string) => void;
  error?: string | null;
}

// Типы состояний для хуков
export interface TaskManagementState {
  tasks: Task[];
  stats: TaskStats | null;
  loading: boolean;
  error: string | null;
}

// Улучшенные типы для API ответов
export interface TaskApiResponse {
  id: number;
  task: string;
  due_date: string;
  is_complete: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskStatsApiResponse {
  total_created: number;
  max_created_day: string;
  max_completed_day: string;
  total_completed: number;
  total_deleted: number;
}