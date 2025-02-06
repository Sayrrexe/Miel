"use client";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { data } from "../../../consts/data";
import { useCandidates, useEmployee } from "@/store/context";
import { useEffect, useState } from "react";
import { fetchPatchEndpoint } from "@/lib/candidates";
import toast, { Toaster } from "react-hot-toast";

interface PersonalInfoProps {
  data: data;
}
export const AddInfo = ({ data }: PersonalInfoProps) => {
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
      onClick={() => console.log(data)}
      className={cn(
        "flex pt-[25px] border-[1px]  border-solid border-[#CACBCD] border-t-0 pl-[9px] gap-6 pb-6"
      )}
    >
      <div className="text-lg flex flex-col gap-3 ml-[29px] items-start">
        <p className="flex gap-2 items-center w-[148px] h-[44px] text-center">
          Объекты
        </p>
        <p className="flex gap-2 items-center h-[44px] text-center">Клиенты</p>
      </div>
      <div className="flex gap-3 flex-col w-full">
        <Input
          value={employee.completed_objects}
          onChange={(e) =>
            setEmployee({
              ...employee,
              completed_objects: Number(e.currentTarget.value),
            })
          }
          className="min-h-11 w-[38vw] rounded-xl"
          placeholder="Объекты"
        />
        <Input
          value={employee.clients}
          className="min-h-11 w-[38vw] rounded-xl"
          placeholder="Клиенты"
          onChange={(e) =>
            setEmployee({
              ...employee,
              clients: Number(e.currentTarget.value),
            })
          }
        />
      </div>
      <Button
        className="bg-[#960047] text-lg rounded-xl w-[212px] h-[44px] mt-[15%] mr-[44px]"
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
