"use client";

import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useEmployee } from "@/store/context";
import { Trash2 } from "lucide-react";

export const PersonalInfo = () => {
  const setEmployee = useEmployee((state) => state.setEmployee);
  const data = useEmployee((state) => state.data);
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
            className="min-h-11 w-[38vw] rounded-none"
            placeholder="Имя"
            value={data.name}
            onInput={(e) =>
              setEmployee({
                ...data,
                name: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-none"
            placeholder="Фамилия"
            value={data.surname}
            onInput={(e) =>
              setEmployee({
                ...data,
                surname: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-none"
            placeholder="Отчество"
            value={data.patronymic}
            onInput={(e) =>
              setEmployee({
                ...data,
                patronymic: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-none"
            placeholder="Дата рождения"
            value={data.birth}
            onInput={(e) =>
              setEmployee({
                ...data,
                birth: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-none"
            placeholder="Страна"
            value={data.country}
            onInput={(e) =>
              setEmployee({
                ...data,
                country: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-none"
            placeholder="Город"
            value={data.city}
            onInput={(e) =>
              setEmployee({
                ...data,
                city: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-none"
            placeholder="Телефон"
            value={data.phone}
            onInput={(e) =>
              setEmployee({
                ...data,
                phone: e.currentTarget.value,
              })
            }
          />
          <Input
            className="min-h-11 w-[38vw] rounded-none"
            placeholder="Email"
            value={data.email}
            onInput={(e) =>
              setEmployee({
                ...data,
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
            <div className="flex items-center gap-2">
              <Trash2 />
              Удалить
            </div>
          </div>
        </div>
        <div className="py-4 flex flex-col gap-2 border-[1px] border-solid border-[#D9D9D9] w-full">
          <p className="px-4">Резюме</p>
          <span className="w-full bg-[#D9D9D9] h-[2px]"></span>
          <div className="flex justify-between text-sm opacity-50 px-4 mt-2 items-center">
            <p>Добавить ссылку на резюме</p>
            <p className="text-3xl">+</p>
          </div>
        </div>
        <Button className="bg-[#960047] text-lg rounded-none w-[212px] h-[44px] ml-[67%] mt-[15%]">
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
};
