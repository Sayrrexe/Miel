"use client";

import { Button, Input } from "@/components/ui";
import { fetchDelete, fetchPatchEndpoint } from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { useCandidates } from "@/store/context";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { data } from "../../../consts/data";
import toast, { Toaster } from "react-hot-toast";
interface PersonalInfoProps {
  data: data;
}
export const PersonalInfo = ({ data }: PersonalInfoProps) => {
  const [employee, setEmployee] = useState<data>(data);
  const [resume, setResume] = useState(false);
  const [token, setToken] = useState("");
  useEffect(() => {
    // Проверяем, что это клиентский рендер
    if (typeof window !== "undefined") {
      const tokenFromStorage = localStorage.getItem("token") || "";
      setToken(tokenFromStorage);
    }
  }, []);
  const setCandidates = useCandidates((state) => state.setCandidates);
  const candidates = useCandidates((state) => state.data);
  const router = useRouter();
  useEffect(() => setEmployee(data), [data, setEmployee]);
  return (
    <div
      className={cn(
        "flex pt-[25px] border-[1px]  border-solid border-[#CACBCD] border-t-0 pl-[9px] gap-6 pb-6"
      )}
    >
      <div className="flex">
        <div className="text-lg flex flex-col gap-3 justify-center">
          <p className="h-11 flex items-center">Имя</p>
          <p className="h-11 flex items-center">Фамилия</p>
          <p className="h-11 flex items-center">Отчество</p>
          <p className="h-11 flex items-center w-[150px]">Дата рождения</p>
          <p className="h-11 flex items-center">Страна</p>
          <p className="h-11 flex items-center">Город</p>
          <p className="h-11 flex items-center">Телефон</p>
          <p className="h-11 flex items-center">Email</p>
        </div>
        <div className="flex gap-3 flex-col w-full">
          <Input
            className="min-h-11 w-[38vw] rounded-xl"
            placeholder="Имя"
            value={employee.name}
            onInput={(e) => {
              console.log(1);
              setEmployee({
                ...employee,
                name: e.currentTarget.value,
              });
            }}
          />
          <Input
            className="min-h-11 w-[38vw] rounded-xl"
            placeholder="Фамилия"
            value={employee.surname}
            onInput={(e) =>
              setEmployee({
                ...employee,
                surname: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-xl"
            placeholder="Отчество"
            value={employee.patronymic}
            onInput={(e) =>
              setEmployee({
                ...employee,
                patronymic: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-xl"
            placeholder="Дата рождения"
            value={employee.birth}
            onInput={(e) =>
              setEmployee({
                ...employee,
                birth: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-xl"
            placeholder="Страна"
            value={employee.country}
            onInput={(e) =>
              setEmployee({
                ...employee,
                country: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-xl"
            placeholder="Город"
            value={employee.city}
            onInput={(e) =>
              setEmployee({
                ...employee,
                city: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-xl"
            placeholder="Телефон"
            value={employee.phone}
            onInput={(e) =>
              setEmployee({
                ...employee,
                phone: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-xl"
            placeholder="Email"
            value={employee.email}
            onInput={(e) =>
              setEmployee({
                ...employee,
                email: e.currentTarget.value,
              })
            }
          />
        </div>
      </div>
      <div className="mt-[43px] w-full pr-[6px] flex flex-col gap-[13px]">
        <div className="p-4 flex flex-col gap-4 border-[1px] border-solid border-[#D9D9D9] w-full">
          <p className="">Удалить</p>
          <div className="flex justify-between text-sm opacity-50">
            <p>Пользователь будет навсегда удалён из базы</p>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={async () => {
                const endpoint = `/api/admin/candidates/${data.id}`; // Укажите свой endpoint

                const result = await fetchDelete(endpoint, token);

                if (result && "error" in result) {
                  console.log(result.error); // Если есть ошибка, выводим ее
                } else {
                  console.log(result); // Если успех, выводим данные
                  setCandidates(
                    candidates.filter((candidate) => candidate.id !== data.id)
                  );
                  router.push("/candidates");
                }
              }}
            >
              <Trash2 />
              Удалить
            </div>
          </div>
        </div>
        <div className="py-4 flex flex-col gap-2 border-[1px] border-solid border-[#D9D9D9] w-full">
          <p className="px-4">Резюме</p>
          <span className="w-full bg-[#D9D9D9] h-[2px]"></span>
          {resume ? (
            <Input
              className="min-h-11 w-[90%] ml-3 rounded-none"
              placeholder="Резюме"
              value={employee.resume}
              onInput={(e) =>
                setEmployee({
                  ...data,
                  resume: e.currentTarget.value,
                })
              }
            />
          ) : (
            <div className="flex justify-between text-sm opacity-50 px-4 mt-2 items-center">
              <p>Добавить ссылку на резюме</p>
              <p
                className="text-3xl cursor-pointer"
                onClick={() => setResume(true)}
              >
                +
              </p>
            </div>
          )}
        </div>
        <Button
          className="bg-[#960047] text-lg rounded-xl w-[212px] h-[44px] ml-[67%] mt-[15%]"
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
    </div>
  );
};
