"use client";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import DatePicker from "react-date-picker";
import "../../dataPicker/DatePicker.css";
import "../../dataPicker/Calendar.css";
import {Button} from "@/components/ui";
import { useTaskManagement } from '@/hooks/useTaskManagement';
import {Task, Value} from "@/types/api";
import {TaskList} from "./TaskList";
import {
  CreateTaskModal
} from "@/components/shared/dashboardAdmin/plansCreating/CreateTaskModal";
import {
  EditTaskModal
} from "@/components/shared/dashboardAdmin/plansCreating/EditTaskModal";
import {
  TaskStatistics
} from "@/components/shared/dashboardAdmin/plansCreating/TaskStatistics";
import {
  TaskInsights
} from "@/components/shared/dashboardAdmin/plansCreating/TaskInsights";

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

  // New state for edit task modal
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={createTask}
        />
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <EditTaskModal
          isOpen={showEditModal}
          task={editingTask}
          onClose={() => {setShowEditModal(false); setEditingTask(null);}}
          onEdit={editTask}
        />
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
              setShowEditModal(true);
            }}
            onDelete={(task) => deleteTask(task.id)}
          />
        </div>
        <div className="flex flex-col gap-[148px]">
          <TaskStatistics stats={newTasks}/>
          <TaskInsights stats={newTasks}/>
        </div>
      </div>
    </div>
  );
};