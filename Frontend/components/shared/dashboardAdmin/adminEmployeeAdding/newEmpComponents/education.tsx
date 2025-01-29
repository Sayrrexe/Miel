"use client";
import { cn } from "@/lib/utils";
import {
  Button,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
  Select,
} from "@/components/ui";
import { data } from "../../../consts/data";
import { useCandidates, useEmployee } from "@/store/context";
import { useEffect, useState } from "react";
import { fetchPatchEndpoint } from "@/lib/candidates";
import toast, { Toaster } from "react-hot-toast";

interface PersonalInfoProps {
  data: data;
}
export const Education = ({ data }: PersonalInfoProps) => {
  const statusPosition: string[] = [
    "not_started",
    "Не начат",
    "in_progress",
    "В процессе",
    "completed",
    "Пройден",
  ];
  const coursesTypes = ["Не начат", "В процессе", "Пройден"];
  const setCandidates = useCandidates((state) => state.setCandidates);
  const candidates = useCandidates((state) => state.data);
  const setEmployee = useEmployee((state) => state.setEmployee);
  const employee = useEmployee((state) => state.data);
  useEffect(() => setEmployee(data), [data, setEmployee]);

  const [token, setToken] = useState("");
  useEffect(() => {
    // Проверяем, что это клиентский рендер
    if (typeof window !== "undefined") {
      const tokenFromStorage = localStorage.getItem("token") || "";
      setToken(tokenFromStorage);
    }
  }, []);

  return (
    <div
      className={cn(
        "flex pt-[25px] border-[1px]  border-solid border-[#CACBCD] border-t-0 pl-[9px] gap-6 pb-6"
      )}
      onClick={() => console.log(data)}
    >
      <div className="flex gap-6">
        <div className="text-lg flex flex-col gap-3 ml-[29px] items-start">
          <div className="flex gap-2 items-center w-[300px] h-[44px] text-center">
            <div className="w-3 h-3 bg-[#01BEC2]" />
            Введение в профессию риелтор
          </div>
          <div className="flex gap-2 items-center h-[44px] text-center">
            <div className="w-3 h-3 bg-[#FFCB05]" />
            Базовый юридический курс
          </div>
          <div className="flex gap-2 items-center h-[44px] text-center">
            <div className="w-3 h-3 bg-[#991FA9]" />
            Курс “Ипотека”
          </div>
          <div className="flex gap-2 items-center h-[44px] text-center">
            <div className="w-3 h-3 bg-[#9CC700]" />
            Курс “Налогообложение”
          </div>
        </div>
        <div className="flex gap-3 flex-col w-full">
          <Select
            onValueChange={(value: string) => {
              console.log(statusPosition[statusPosition.indexOf(value) - 1]);
              setEmployee({
                ...employee,
                course_rieltor_join:
                  statusPosition[statusPosition.indexOf(value) - 1],
              });
            }}
          >
            <SelectTrigger className="border-black border-solid border-opacity-40 border-[1px] h-[34px] min-h-11 w-[36vw] rounded-none ">
              <SelectValue
                placeholder={`${
                  statusPosition[
                    statusPosition.indexOf(data.course_rieltor_join) + 1
                  ]
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              {coursesTypes.map((courseType, index) => (
                <SelectItem
                  className="flex justify-between opacity-40"
                  key={index}
                  value={`${courseType}`}
                >
                  {courseType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value: string) => {
              setEmployee({
                ...employee,
                basic_legal_course:
                  statusPosition[statusPosition.indexOf(value) - 1],
              });
            }}
          >
            <SelectTrigger className="border-black border-solid border-opacity-40 border-[1px] h-[34px] min-h-11 w-[36vw] rounded-none ">
              <SelectValue
                placeholder={`${
                  statusPosition[
                    statusPosition.indexOf(data.basic_legal_course) + 1
                  ]
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              {coursesTypes.map((courseType, index) => (
                <SelectItem
                  className="flex justify-between opacity-40"
                  key={index}
                  value={`${courseType}`}
                >
                  {courseType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value: string) => {
              setEmployee({
                ...employee,
                course_mortgage:
                  statusPosition[statusPosition.indexOf(value) - 1],
              });
            }}
          >
            <SelectTrigger className="border-black border-solid border-opacity-40 border-[1px] h-[34px] min-h-11 w-[36vw] rounded-none ">
              <SelectValue
                placeholder={`${
                  statusPosition[
                    statusPosition.indexOf(data.course_mortgage) + 1
                  ]
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              {coursesTypes.map((courseType, index) => (
                <SelectItem
                  className="flex justify-between opacity-40"
                  key={index}
                  value={`${courseType}`}
                >
                  {courseType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value: string) => {
              setEmployee({
                ...employee,
                course_taxation:
                  statusPosition[statusPosition.indexOf(value) - 1],
              });
            }}
          >
            <SelectTrigger className="border-black border-solid border-opacity-40 border-[1px] h-[34px] min-h-11 w-[36vw] rounded-none ">
              <SelectValue
                placeholder={`${
                  statusPosition[
                    statusPosition.indexOf(data.course_taxation) + 1
                  ]
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              {coursesTypes.map((courseType, index) => (
                <SelectItem
                  className="flex justify-between opacity-40"
                  key={index}
                  value={`${courseType}`}
                >
                  {courseType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        className="bg-[#960047] text-lg rounded-xl w-[212px] h-[44px] mr-8 mt-[15%] ml-[15%]"
        onClick={async () => {
          try {
            const result = await fetchPatchEndpoint(
              `/api/admin/candidates/${data.id}`,
              employee,
              token
            );
            console.log(result); // Устанавливаем ответ в состояние
            if ("error" in result) {
              // Если в ответе есть ошибка, выбрасываем исключение
              throw new Error(result.error);
            } else {
              // Если ошибки нет, значит запрос успешен
              toast.success("Изменения сохранены!");
            }
          } catch (error) {
            console.log(error); // Устанавливаем ошибку в состояние
            toast.error("Изменения не сохранены");
          }
          setCandidates(
            candidates.map((candidate) =>
              candidate.id === data.id
                ? { ...candidate, ...employee }
                : candidate
            )
          );
        }}
      >
        Сохранить изменения
      </Button>
      <Toaster />
    </div>
  );
};
