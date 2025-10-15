"use client";
import { useState } from "react";
import { Button } from "@/components/ui";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (taskText: string, dueDate: Date) => Promise<void>;
}

export const CreateTaskModal = ({ isOpen, onClose, onCreate }: CreateTaskModalProps) => {
  const [taskText, setTaskText] = useState("");
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!taskText.trim() || !taskDueDate) {
      setError("Заполните все поля");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      await onCreate(taskText, taskDueDate);
      setTaskText("");
      setTaskDueDate(null);
      onClose();
    } catch {
      setError("Произошла ошибка при создании задачи");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setTaskText("");
    setTaskDueDate(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
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
            disabled={creating}
          >
            {creating ? "Создание..." : "Создать"}
          </Button>
        </div>
      </div>
    </div>
  );
};