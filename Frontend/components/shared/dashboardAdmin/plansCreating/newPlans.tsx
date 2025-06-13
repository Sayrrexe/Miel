"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import "../../dataPicker/DatePicker.css";
import "../../dataPicker/Calendar.css";
import { Button, Checkbox } from "@/components/ui";
import { Ellipsis, Pen, Trash2 } from "lucide-react";
import fetchGetEndpoint from "@/lib/candidates"; // Импортируем функцию для запроса
import css from "./main.module.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Tasks {
  created_at: string;
  due_date: string;
  id: number;
  is_complete: boolean;
  is_deleted: boolean;
  task: string;
  user: string;
}

interface NewTasks {
  total_created: number;
  total_completed: number;
  total_deleted: number;
  max_created_day: string;
  max_completed_day: string;
}

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

  // Запрос для получения задач
  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/todos/";
      const response = await fetchGetEndpoint(
        endpointToCall,
        token,
        undefined,
        undefined,
        value
      );

      if ("data" in response && Array.isArray(response.data)) {
        console.log(response.data);
        setTasks(response.data); // Устанавливаем задачи в state
      } else {
        console.error("Error fetching tasks:", response);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Запрос для получения статистики по задачам

  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/todo-stats/";
      const response = await fetchGetEndpoint(endpointToCall, token);

      console.log(response);

      // Проверяем, что ответ содержит необходимые данные
      if ("data" in response && response.data) {
        setNewTasks({
          total_created: response.data.total_created || 0,
          total_completed: response.data.total_completed || 0,
          total_deleted: response.data.total_deleted || 0,
          max_created_day: response.data.max_created_day || "",
          max_completed_day: response.data.max_completed_day || "",
        });
      } else {
        console.error("Error fetching stats:", response);
      }
    })();
  }, [token]);

  return (
    <div className={cn("m-[52px] overflow-x-visible")}>
      <p>Выберите дату или период</p>
      <div>
        <DatePicker
          onClick={() => console.log(newTasks)}
          className={"mt-4 h-10 w-52 text-sm"}
          onChange={onChange}
          value={value}
        />
        <Button
          variant='default'
          onClick={() => {
            console.log(token);
            (async () => {
              const endpointToCall = "/api/todos/";
              const response = await fetchGetEndpoint(
                endpointToCall,
                token,
                undefined,
                undefined,
                value
              );

              if ("data" in response && Array.isArray(response.data)) {
                console.log(response.data);
                setTasks(response.data); // Устанавливаем задачи в state
              } else {
                console.error("Error fetching tasks:", response);
              }
            })();
          }}
          className="ml-4 w-40 h-10 rounded-xl"
        >
          Выбрать
        </Button>
      </div>
      <p className="text-[#960047] mt-[19px] mb-[33px] ml-[19px]">
        + Создать задачу
      </p>
      <div className="flex gap-20">
        <div className="border-[#CACBCD] border-solid border-[1px] p-5 w-[566px]">
          <div className="w-full flex justify-between text-center">
            {tasks.filter(
              (task) => task.is_complete == false && task.is_deleted == false
            ).length != 0 && <p className="text-[#960047]">Активные задачи</p>}
          </div>
          <div className="flex flex-col gap-[10px]">
            {tasks
              .filter(
                (task) => task.is_complete == false && task.is_deleted == false
              )
              .map((task, index) => {
                return (
                  <div
                    key={index}
                    className="mt-3 mb-3  w-full bg-[#d9f0f0] flex p-[15px] justify-between border-solid border-[1px] border-[#CACBCD]"
                  >
                    <div className="flex items-center gap-[10px]">
                      <Checkbox className="w-6 h-6" />
                      <p>{task.task}</p>
                    </div>
                    <div className="flex gap-[10px] ">
                      <Pen className="opacity-50" />
                      <Trash2 className="opacity-50" />
                    </div>
                  </div>
                );
              })}
          </div>
          <div>
            {tasks.filter(
              (task) => task.is_complete == true && task.is_deleted == false
            ).length != 0 && (
              <p className="text-[#960047]">Завершенные задачи</p>
            )}
            {tasks
              .filter(
                (task) => task.is_complete == true && task.is_deleted == false
              )
              .map((task, index) => {
                return (
                  <div
                    key={index}
                    className="mt-3 mb-3 w-full bg-[#d9f0f0] flex p-[15px] justify-between border-solid border-[1px] border-[#CACBCD]"
                  >
                    <div className="flex items-center gap-[10px]">
                      <Checkbox className="w-6 h-6" />
                      <p>{task.task}</p>
                    </div>
                    <div className="flex gap-[10px] ">
                      <Pen className="opacity-50" />
                      <Trash2 className="opacity-50" />
                    </div>
                  </div>
                );
              })}
          </div>
          <div>
            {tasks.filter(
              (task) => task.is_complete == false && task.is_deleted == true
            ).length != 0 && (
              <p className="text-[#960047]">Отмененные задачи</p>
            )}

            {tasks
              .filter(
                (task) => task.is_complete == false && task.is_deleted == true
              )
              .map((task, index) => {
                return (
                  <div
                    key={index}
                    className="mt-3 mb-3 w-full bg-[#d9f0f0] flex p-[15px] justify-between border-solid border-[1px] border-[#CACBCD]"
                  >
                    <div className="flex items-center gap-[10px]">
                      <Checkbox className="w-6 h-6" />
                      <p>{task.task}</p>
                    </div>
                    <div className="flex gap-[10px] ">
                      <Pen className="opacity-50" />
                      <Trash2 className="opacity-50" />
                    </div>
                  </div>
                );
              })}
          </div>
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
