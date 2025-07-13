// newPlans.tsx
"use client";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import DatePicker from "react-date-picker";
import "../../dataPicker/DatePicker.css";
import "../../dataPicker/Calendar.css";
import {Button} from "@/components/ui";
import {Ellipsis} from "lucide-react";
import fetchGetEndpoint from "@/lib/candidates";
import css from "./main.module.css";
import {Task, TaskStats, Value} from "@/types/api";
import {TaskList} from "./TaskList";

// Используем типы из types/api.ts
type Tasks = Task
type NewTasks = TaskStats

export const NewPlans = () => {
  const [newTasks, setNewTasks] = useState<NewTasks>({
    total_created: 0,
    total_completed: 0,
    total_deleted: 0,
    max_created_day: "",
    max_completed_day: "",
  });
  const token = localStorage.getItem("token") || "";
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [value, onChange] = useState<Value>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (date?: Value) => {
    setLoading(true);
    setError(null);
    try {
      const endpointToCall = "/api/todos/";
      const response = await fetchGetEndpoint<Task[]>(
        endpointToCall,
        token,
        undefined,
        undefined,
        date
      );

      if ('success' in response && response.success) {
        setTasks(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch tasks");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpointToCall = "/api/todo-stats/";
      const response = await fetchGetEndpoint<TaskStats>(endpointToCall, token);

      if ('success' in response && response.success) {
        setNewTasks({
          total_created: response.data.total_created || 0,
          max_created_day: response.data.max_created_day || "",
          max_completed_day: response.data.max_completed_day || "",
        });
      } else {
        throw new Error(response.error || "Failed to fetch stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Запрос для получения задач
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Запрос для получения статистики по задачам
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
        >
          + Создать задачу
        </Button>
      </div>
      <div className="flex gap-20">
        <div className="border-[#CACBCD] border-solid border-[1px] p-5 w-[566px]">
          <div className="w-full flex justify-between text-center">
            {/* Пустой div для сохранения структуры */}
          </div>
          <TaskList
            tasks={tasks}
            title="Активные задачи"
            filter={(task) => !task.is_complete && !task.is_deleted}
          />
          <TaskList
            tasks={tasks}
            title="Завершенные задачи"
            filter={(task) => task.is_complete && !task.is_deleted}
          />
          <TaskList
            tasks={tasks}
            title="Отмененные задачи"
            filter={(task) => !task.is_complete && task.is_deleted}
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
                    {newTasks.total_completed}
                  </p>
                  <p className="text-xs font-bold">задач</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold mb-[10px]">Завершено</p>
                <div className="border-[#960047] border-solid border-[1px] h-[100px] w-[100px] rounded-full items-center flex flex-col">
                  <p className="text-[#960047] text-4xl mt-4">
                    {newTasks.total_created}
                  </p>
                  <p className="text-xs font-bold">задач</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold mb-[10px]">Удалено</p>
                <div className="border-[#960047] border-solid border-[1px] h-[100px] w-[100px] rounded-full items-center flex flex-col">
                  <p className="text-[#960047] text-4xl mt-4">
                    {newTasks.total_deleted}
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
              {newTasks.max_created_day}
            </p>
            <p>
              Больше всего задач вы завершаете во {newTasks.max_completed_day}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};