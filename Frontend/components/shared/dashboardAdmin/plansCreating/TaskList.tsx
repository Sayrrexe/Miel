// TaskList.tsx
import { useCallback, memo } from 'react';
import { Checkbox } from "@/components/ui";
import { Edit } from "@/components/ui/icons/edit"
import { Trash } from "@/components/ui/icons/trash"
import { Task } from "@/types/api";

/**
 * @typedef {Object} TaskListProps
 * @property {Task[]} tasks - Массив задач для отображения
 * @property {string} title - Заголовок списка задач
 * @property {(task: Task) => boolean} filter - Функция для фильтрации задач
 * @property {(task: Task) => void} [onEdit] - Обработчик редактирования задачи
 * @property {(task: Task) => void} [onDelete] - Обработчик удаления задачи
 * @property {(task: Task) => void} [onToggleComplete] - Обработчик изменения статуса задачи
 * @property {boolean} [isLoading=false] - Флаг загрузки данных
 * @property {string | null} [error=null] - Сообщение об ошибке
 */
interface TaskListProps {
  tasks: Task[];
  title: string;
  filter: (task: Task) => boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onToggleComplete?: (task: Task) => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Компонент для отображения списка задач с возможностью фильтрации и управления
 * 
 * @example
 * // Базовое использование
 * <TaskList
 *   tasks={tasks}
 *   title="Активные задачи"
 *   filter={(task) => !task.is_complete && !task.is_deleted}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onToggleComplete={handleToggleComplete}
 * />
 * 
 * @example
 * // С состоянием загрузки
 * <TaskList
 *   tasks={tasks}
 *   title="Загрузка..."
 *   filter={() => true}
 *   isLoading={true}
 * />
 * 
 * @example
 * // С ошибкой
 * <TaskList
 *   tasks={[]}
 *   title="Ошибка"
 *   filter={() => true}
 *   error="Не удалось загрузить задачи"
 * />
 */
export const TaskList = memo(function TaskList({
  tasks,
  title,
  filter,
  onEdit,
  onDelete,
  onToggleComplete,
  isLoading = false,
  error = null,
}: TaskListProps) {
  /**
   * Обработчик клика по чекбоксу задачи
   */
  const handleCheckboxChange = useCallback((task: Task) => {
    if (onToggleComplete) {
      onToggleComplete(task);
    }
  }, [onToggleComplete]);

  /**
   * Обработчик клика по кнопке редактирования
   */
  const handleEditClick = useCallback((task: Task) => {
    if (onEdit) {
      onEdit(task);
    }
  }, [onEdit]);

  /**
   * Обработчик клика по кнопке удаления
   */
  const handleDeleteClick = useCallback((task: Task) => {
    if (onDelete) {
      onDelete(task);
    }
  }, [onDelete]);

  // Фильтрация задач
  const filteredTasks = useCallback(() => tasks.filter(filter), [tasks, filter]);

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Загрузка задач...
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  // Нет задач
  if (filteredTasks().length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет задач для отображения
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-primary">{title}</h3>
      <div className="space-y-3">
        {filteredTasks().map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              task.is_deleted
                ? 'bg-red-50 border-red-200'  // Светло-красный фон и граница для отмененных
                : task.is_complete
                  ? 'bg-gray-50'              // Серый фон для выполненных
                  : 'bg-white'                // Белый фон для активных
            } hover:shadow transition-shadow`}
          >
            <div className="flex items-center space-x-3 flex-1">
              <Checkbox
                checked={task.is_complete || task.is_deleted}
                onCheckedChange={() => handleCheckboxChange(task)}
                className="w-5 h-5"
                aria-label={task.is_complete ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
              />
              <span
                className={`flex-1 cursor-pointer ${
                  task.is_deleted
                    ? 'line-through text-red-600 opacity-75'  // Зачеркнутый красный текст для отмененных
                    : task.is_complete
                      ? 'line-through text-gray-500'           // Зачеркнутый серый текст для выполненных
                      : 'text-gray-800'                        // Обычный текст для активных
                }`}
                onClick={() => handleEditClick(task)}
              >
                {task.task}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(task)}
                className={`p-1 transition-colors ${
                  task.is_deleted
                    ? 'text-red-400 hover:text-red-600'       // Красные кнопки для отмененных
                    : 'text-gray-500 hover:text-primary'      // Обычные кнопки
                }`}
                aria-label="Редактировать задачу"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteClick(task)}
                className="p-1 text-gray-500 hover:text-destructive transition-colors"
                aria-label="Удалить задачу"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TaskList.displayName = 'TaskList';