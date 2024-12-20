"use client";
import { Button, Input } from "@/components/ui";
import fetchGetEndpoint, { fetchPostEndpoint } from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { useCTokenStore } from "@/store/context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const AddingNewAdmin = () => {
  const [admin, setAdmin] = useState([]);
  const token = useCTokenStore((state) => state.token);
  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/admin/offices/";
      setAdmin((await fetchGetEndpoint(endpointToCall, token)).data);
    })();
  }, []);
  const [officeData, setOfficeData] = useState({
    department: "",
    id: admin.length + 1,
    office: "",
    user: {
      email: "",
      last_name: "",
      phone: "",
      first_name: "",
      patronymic: "",
      username: "test",
    },
  });
  return (
    <div className={cn("mt-[52px] ml-10")}>
      <Link
        href={"./dashboardAdministration"}
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
              value={officeData.user.last_name}
              placeholder="Фамилия"
              className="w-[450px]"
              onInput={(e) =>
                setOfficeData({
                  ...officeData,
                  user: {
                    ...officeData.user,
                    last_name: e.currentTarget.value,
                  },
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Имя</p>
            <Input
              onInput={(e) =>
                setOfficeData({
                  ...officeData,
                  user: {
                    ...officeData.user,
                    first_name: e.currentTarget.value,
                  },
                })
              }
              value={officeData.user.first_name}
              placeholder="Имя"
              className="w-[450px]"
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Отчество</p>
            <Input
              type="phone"
              value={officeData.user.patronymic}
              className="w-[450px]"
              placeholder="Отчество"
              onInput={(e) =>
                setOfficeData({
                  ...officeData,
                  user: {
                    ...officeData.user,
                    patronymic: e.currentTarget.value,
                  },
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Телефон</p>
            <Input
              value={officeData.user.phone}
              className="w-[450px]"
              placeholder="+7 (___) ___ - __ - __"
              onInput={(e) =>
                setOfficeData({
                  ...officeData,
                  user: { ...officeData.user, phone: e.currentTarget.value },
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Email</p>
            <Input
              value={officeData.user.email}
              className="w-[450px]"
              placeholder="Email"
              onInput={(e) =>
                setOfficeData({
                  ...officeData,
                  user: { ...officeData.user, email: e.currentTarget.value },
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Офис</p>
            <Input
              value={officeData.office}
              className="w-[450px]"
              placeholder="Офис"
              onInput={(e) =>
                setOfficeData({
                  ...officeData,
                  office: e.currentTarget.value,
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Подразделение</p>
            <Input
              value={officeData.department}
              className="w-[450px]"
              placeholder="Подразделение"
              onInput={(e) =>
                setOfficeData({
                  ...officeData,
                  department: e.currentTarget.value,
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Логин</p>
            <Input className="w-[450px]" placeholder="Логин" />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px]">Пароль</p>
            <Input className="w-[450px]" placeholder="Пароль" />
          </div>
        </div>
        <Button
          className="mt-8 bg-[#960047] w-[160px] h-[44px]"
          onClick={async () => {
            await fetchPostEndpoint("/api/admin/candidates/", officeData);
          }}
        >
          Добавить
        </Button>
      </div>
    </div>
  );
};
