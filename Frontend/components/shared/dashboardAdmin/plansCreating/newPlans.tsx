"use client";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import DatePicker from "react-date-picker";
import "../../dataPicker/DatePicker.css";
import "../../dataPicker/Calendar.css";
import {Button} from "@/components/ui";
import {Ellipsis} from "lucide-react";
import { useTaskManagement } from '@/hooks/useTaskManagement';
import css from "./main.module.css";
import {Task, Value} from "@/types/api";
import {TaskList} from "./TaskList";

export const NewPlans = () => {
  // Используем хук useTaskManagement
  const {
    tasks,
    stats: newTasks,
    // loading,
    error,
    fetchTasks,
    fetchStats,
    createTask,
    editTask,
    deleteTask,
    toggleTaskComplete
  } = useTaskManagement(localStorage.getItem("token") || "");

  const [value, onChange] = useState<Value>(null);

  // New state for create task modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [creatingTask, setCreatingTask] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // New state for edit task modal
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [editTaskDueDate, setEditTaskDueDate] = useState<Date | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTaskError, setEditingTaskError] = useState<string | null>(null);

  // Запрос для получения задач
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Запрос для получения статистики по задачам
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("m-[52px] overflow-x-visible")}>
      <p>Выберите дату или период</p>
      <div>
        <DatePicker
          className={"mt-4 h-10 w-52 text-sm"}
          onChange={onChange}
          value={value}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <Button
          variant="default"
          onClick={() => {
            fetchTasks(value);
          }}
          className="ml-4 w-40 h-10 rounded-xl"
        >
          Выбрать
        </Button>
      </div>
      {/* Кнопка создать задачу */}
      <div>
        <Button
          variant="outline"
          className="text-btn-primary mt-[19px] mb-[33px]"
          onClick={() => setShowCreateModal(true)}
        >
          + Создать задачу
        </Button>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Создать задачу</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Описание задачи
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Введите описание задачи..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Срок выполнения
              </label>
              <input
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={taskDueDate ? taskDueDate.toISOString().slice(0, 16) : ""}
                onChange={(e) => setTaskDueDate(new Date(e.target.value))}
              />
            </div>

            {createError && (
              <p className="text-red-500 text-sm mb-4">{createError}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setTaskText("");
                  setTaskDueDate(null);
                  setCreateError(null);
                }}
              >
                Отмена
              </Button>
              <Button
                variant="default"
                onClick={async () => {
                  if (!taskText.trim() || !taskDueDate) {
                    setCreateError("Заполните все поля");
                    return;
                  }

                  setCreatingTask(true);
                  setCreateError(null);

                  try {
                    await createTask(taskText, taskDueDate);
                    setShowCreateModal(false);
                    setTaskText("");
                    setTaskDueDate(null);
                  } catch {
                    setCreateError("Произошла ошибка при создании задачи");
                  } finally {
                    setCreatingTask(false);
                  }
                }}
                disabled={creatingTask}
              >
                {creatingTask ? "Создание..." : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">Редактировать задачу</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Описание задачи
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                value={editTaskText}
                onChange={(e) => setEditTaskText(e.target.value)}
                placeholder="Введите описание задачи..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Срок выполнения
              </label>
              <input
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editTaskDueDate ? editTaskDueDate.toISOString().slice(0, 16) : ""}
                onChange={(e) => setEditTaskDueDate(new Date(e.target.value))}
              />
            </div>

            {editingTaskError && (
              <p className="text-red-500 text-sm mb-4">{editingTaskError}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
                  setEditTaskText("");
                  setEditTaskDueDate(null);
                  setEditingTaskError(null);
                }}
              >
                Отмена
              </Button>
              <Button
                variant="default"
                onClick={async () => {
                  if (!editTaskText.trim()) {
                    setEditingTaskError("Описание задачи обязательно");
                    return;
                  }

                  try {
                    await editTask(editingTask.id, editTaskText, editTaskDueDate);
                    setShowEditModal(false);
                    setEditingTask(null);
                    setEditTaskText("");
                    setEditTaskDueDate(null);
                  } catch {
                    setEditingTaskError("Произошла ошибка при редактировании задачи");
                  }
                }}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-20">
        <div className="border-[#CACBCD] border-solid border-[1px] p-5 w-[566px]">
          <div className="w-full flex justify-between text-center">
            {/* Пустой div для сохранения структуры */}
          </div>
          <TaskList
            tasks={tasks}
            title="Активные задачи"
            filter={(task) => !task.is_complete && !task.is_deleted}
            onToggleComplete={(task) => toggleTaskComplete(task.id)}
            onEdit={(task) => {
              setEditingTask(task);
              setEditTaskText(task.task);
              setEditTaskDueDate(task.due_date ? new Date(task.due_date) : null);
              setShowEditModal(true);
            }}
            onDelete={(task) => deleteTask(task.id)}
          />
          <TaskList
            tasks={tasks}
            title="Завершенные задачи"
            filter={(task) => task.is_complete && !task.is_deleted}
            onToggleComplete={(task) => toggleTaskComplete(task.id)}
            onEdit={(task) => {
              setEditingTask(task);
              setEditTaskText(task.task);
              setEditTaskDueDate(task.due_date ? new Date(task.due_date) : null);
              setShowEditModal(true);
            }}
            onDelete={(task) => deleteTask(task.id)}
          />
          <TaskList
            tasks={tasks}
            title="Отмененные задачи"
            filter={(task) => !task.is_complete && task.is_deleted}
            onToggleComplete={(task) => toggleTaskComplete(task.id)}
            onEdit={(task) => {
              setEditingTask(task);
              setEditTaskText(task.task);
              setEditTaskDueDate(task.due_date ? new Date(task.due_date) : null);
              setShowEditModal(true);
            }}
            onDelete={(task) => deleteTask(task.id)}
          />
        </div>
        <div className="flex flex-col gap-[148px]">
          <div
            className={`border-solid border-[1px] border-[#CACBCD] h-[208px] p-5 ${css.mainCircleDiv}`}
          >
            <div className="w-full flex justify-between text-center">
              <p className="text-[#960047]">Успехи за неделю</p>
              <Ellipsis className="text-[#798087]" />
            </div>
            <div className={`flex mt-5 gap-[6px] ${css.circleDiv}`}>
              <div className="text-center">
                <p className="text-sm font-bold mb-[10px]">Создано</p>
                <div className="border-[#960047] border-solid border-[1px] h-[100px] w-[100px] rounded-full items-center flex flex-col">
                  <p className="text-[#960047] text-4xl mt-4">
                    {newTasks?.total_created || 0}
                  </p>
                  <p className="text-xs font-bold">задач</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold mb-[10px]">Завершено</p>
                <div className="border-[#960047] border-solid border-[1px] h-[100px] w-[100px] rounded-full items-center flex flex-col">
                  <p className="text-[#960047] text-4xl mt-4">
                    {newTasks?.total_completed || 0}
                  </p>
                  <p className="text-xs font-bold">задач</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold mb-[10px]">Удалено</p>
                <div className="border-[#960047] border-solid border-[1px] h-[100px] w-[100px] rounded-full items-center flex flex-col">
                  <p className="text-[#960047] text-4xl mt-4">
                    {newTasks?.total_deleted || 0}
                  </p>
                  <p className="text-xs font-bold">задач</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-solid border-[1px] border-[#CACBCD] p-5">
            <p className="text-xl text-[#01BEC2]">Наблюдение</p>
            <p className="mt-5">
              Больше всего задач вы{" "}
              <span className="text-[#01BEC2]">создаете</span> в{" "}
              {newTasks?.max_created_day || ""}
            </p>
            <p>
              Больше всего задач вы завершаете во {newTasks?.max_completed_day || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};