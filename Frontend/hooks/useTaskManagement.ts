// hooks/useTaskManagement.ts
import { useState, useCallback } from 'react';
import axios from 'axios';
import { Task, TaskStats, Value } from '@/types/api';

interface UseTaskManagementReturn {
  // Состояние
  tasks: Task[];
  stats: TaskStats | null;
  loading: boolean;
  error: string | null;

  // Действия
  fetchTasks: (date?: Value) => Promise<void>;
  fetchStats: () => Promise<void>;
  createTask: (taskText: string, dueDate: Date) => Promise<void>;
  editTask: (taskId: number, taskText: string, dueDate: Date | null) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  toggleTaskComplete: (taskId: number) => Promise<void>;
}

export const useTaskManagement = (token: string): UseTaskManagementReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (date?: Value) => {
    setLoading(true);
    setError(null);
    try {
      const endpointToCall = `https://miel.sayrrx.cfd/api/todos/`;
      const response = await axios.get(endpointToCall, {
        headers: { Authorization: `Token ${token}` },
        params: date
          ? Array.isArray(date)
            ? { date: date[0]?.toISOString() }
            : { date: date.toISOString() }
          : undefined,
      });

      if (response.status === 200) {
        setTasks(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки задач");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`https://miel.sayrrx.cfd/api/todo-stats/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.status === 200) {
        setStats({
          total_created: response.data.total_created || 0,
          max_created_day: response.data.max_created_day || "",
          max_completed_day: response.data.max_completed_day || "",
          total_completed: response.data.total_completed || 0,
          total_deleted: response.data.total_deleted || 0,
        });
      }
    } catch (err) {
      console.error("Ошибка загрузки статистики:", err);
    }
  }, [token]);

  const createTask = useCallback(async (taskText: string, dueDate: Date) => {
    try {
      await axios.post(
        `https://miel.sayrrx.cfd/api/todos/`,
        {
          task: taskText.trim(),
          due_date: dueDate.toISOString(),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchTasks();
      await fetchStats();
    } catch {
      throw new Error("Ошибка создания задачи");
    }
  }, [token, fetchTasks, fetchStats]);

  const editTask = useCallback(async (taskId: number, taskText: string, dueDate: Date | null) => {
    try {
      await axios.patch(
        `https://miel.sayrrx.cfd/api/todos/${taskId}/`,
        {
          task: taskText.trim(),
          due_date: dueDate?.toISOString(),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(prev => prev.map(t =>
        t.id === taskId
          ? { ...t, task: taskText.trim(), due_date: dueDate?.toISOString() }
          : t
      ));

      await fetchStats();
    } catch {
      throw new Error("Ошибка редактирования задачи");
    }
  }, [token, fetchStats]);

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await axios.patch(
        `https://miel.sayrrx.cfd/api/todos/${taskId}/`,
        { is_deleted: true },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, is_deleted: true } : t
      ));

      await fetchStats();
    } catch {
      throw new Error("Ошибка удаления задачи");
    }
  }, [token, fetchStats]);

  const toggleTaskComplete = useCallback(async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      await axios.patch(
        `https://miel.sayrrx.cfd/api/todos/${taskId}/`,
        { is_complete: !task.is_complete },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, is_complete: !t.is_complete } : t
      ));

      await fetchStats();
    } catch {
      throw new Error("Ошибка изменения статуса задачи");
    }
  }, [token, tasks, fetchStats]);

  return {
    tasks,
    stats,
    loading,
    error,
    fetchTasks,
    fetchStats,
    createTask,
    editTask,
    deleteTask,
    toggleTaskComplete,
  };
};