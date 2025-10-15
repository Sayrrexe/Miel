"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { Task } from "@/types/api";

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: (taskId: number, taskText: string, dueDate: Date | null) => Promise<void>;
}

export const EditTaskModal = ({ isOpen, task, onClose, onEdit }: EditTaskModalProps) => {
  const [taskText, setTaskText] = useState("");
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTaskText(task.task);
      setTaskDueDate(task.due_date ? new Date(task.due_date) : null);
      setError(null);
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!taskText.trim()) {
      setError("Описание задачи обязательно");
      return;
    }

    if (!task) return;

    setEditing(true);
    setError(null);

    try {
      await onEdit(task.id, taskText, taskDueDate);
      onClose();
    } catch {
      setError("Произошла ошибка при редактировании задачи");
    } finally {
      setEditing(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
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

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={editing}
          >
            {editing ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>
    </div>
  );
};