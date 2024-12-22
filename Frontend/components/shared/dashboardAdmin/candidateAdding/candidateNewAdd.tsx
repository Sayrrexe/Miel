"use client";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useEmployee } from "@/store/context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const CandidateNewAdd = () => {
  const router = useRouter();
  const setEmployee = useEmployee((state) => state.setEmployee);
  const data = useEmployee((state) => state.data);
  return (
    <div className={cn("mt-[52px] ml-10")}>
      <Link
        href={"./candidates"}
        className="flex gap-[10px] hover:text-gray-300"
      >
        <ArrowLeft />
        Вернуться
      </Link>
      <div className="mt-[29px]">
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Фамилия</p>
            <Input
              value={data.surname}
              placeholder="Фамилия"
              className="w-[450px]"
              onInput={(e) =>
                setEmployee({ ...data, surname: e.currentTarget.value })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Имя</p>
            <Input
              onInput={(e) =>
                setEmployee({
                  ...data,
                  name: e.currentTarget.value,
                })
              }
              value={data.name}
              placeholder="Имя"
              className="w-[450px]"
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Отчество</p>
            <Input
              type="phone"
              value={data.phone}
              className="w-[450px]"
              placeholder="Отчество"
              onInput={(e) =>
                setEmployee({
                  ...data,
                  phone: e.currentTarget.value,
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Телефон</p>
            <Input
              value={data.patronymic}
              className="w-[450px]"
              placeholder="+7 (___) ___ - __ - __  "
              onInput={(e) =>
                setEmployee({
                  ...data,
                  patronymic: e.currentTarget.value,
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Дата рождения</p>
            <Input
              value={data.birth}
              className="w-[450px]"
              placeholder="Дата рождения"
              onInput={(e) =>
                setEmployee({
                  ...data,
                  birth: e.currentTarget.value,
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Страна</p>
            <Input
              value={data.country}
              className="w-[450px]"
              placeholder="Страна"
              onInput={(e) =>
                setEmployee({
                  ...data,
                  country: e.currentTarget.value,
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Город</p>
            <Input
              value={data.city}
              className="w-[450px]"
              placeholder="Город"
              onInput={(e) =>
                setEmployee({
                  ...data,
                  city: e.currentTarget.value,
                })
              }
            />
          </div>
        </div>
        <Button
          className="mt-8 bg-[#960047] w-[160px] h-[44px]"
          onClick={async () => {
            router.push("/newAdminEmployee");
          }}
        >
          Создать
        </Button>
      </div>
    </div>
  );
};
