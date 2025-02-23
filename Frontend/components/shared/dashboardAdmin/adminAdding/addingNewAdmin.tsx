"use client";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import fetchGetEndpoint, { fetchPostEndpoint } from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailInput } from "../../formInputs/mailInput";
import css from "./main.module.css";
import toast, { Toaster } from "react-hot-toast";

export const AddingNewAdmin = () => {
  const checkoutFormSchema = z.object({
    email: z.string().email({ message: "Введите корректную почту" }),
  });
  interface Office {
    location: string;
    quota: number;
    used_quota: number;
    phone: string;
    name: string;
    mail: string;
    id: number;
  }
  const [offices, setOffices] = useState<Office[]>([]);
  const token = localStorage.getItem("token") || "";
  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/admin/offices/";
      const response = await fetchGetEndpoint(endpointToCall, token);

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setOffices(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [token]);

  type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
  const [officeData, setOfficeData] = useState({
    department: "",
    office: "",
    user: {
      email: "",
      last_name: "",
      phone: "",
      first_name: "",
      patronymic: "",
      office: "",
      username: "",
    },
  });

  const [usernameError, setUsernameError] = useState(false); // Ошибка на поле логин

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async () => {
    try {
      // Проверка уникальности логина перед отправкой
      const usernameCheckResponse = await fetchPostEndpoint(
        "/api/admin/check-username", // API для проверки занятости логина
        { username: officeData.user.username },
        token
      );

      if (usernameCheckResponse.error === "Username already exists") {
        setUsernameError(true); // Устанавливаем ошибку на логин
        toast.error("Логин занят. Выберите другой.");
        return; // Прекращаем выполнение, если логин занят
      }

      // Отправка данных, если логин свободен
      const response = await fetchPostEndpoint(
        "/api/admin/supervisors/",
        officeData,
        token
      );

      // Проверка ответа на ошибки
      if ("error" in response) {
        throw new Error(response.error);
      } else {
        toast.success("Руководитель добавлен!");
        setOfficeData({
          department: "",
          office: "",
          user: {
            email: "",
            last_name: "",
            phone: "",
            first_name: "",
            patronymic: "",
            office: "",
            username: "",
          },
        }); // Сбрасываем форму после успешного добавления
      }
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Ошибка при добавлении руководителя");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cn("mt-[52px] ml-10")}>
          <Link
            href={"./main1"}
            className="flex gap-[10px] hover:text-gray-300"
          >
            <ArrowLeft />
            Вернуться
          </Link>
          <div className="mt-[29px]">
            <div className="flex flex-col gap-5">
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Фамилия</p>
                <Input
                  value={officeData.user.last_name}
                  placeholder="Фамилия"
                  className="w-[450px] rounded-xl"
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
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Имя</p>
                <Input
                  value={officeData.user.first_name}
                  placeholder="Имя"
                  className="w-[450px] rounded-xl"
                  onInput={(e) =>
                    setOfficeData({
                      ...officeData,
                      user: {
                        ...officeData.user,
                        first_name: e.currentTarget.value,
                      },
                    })
                  }
                />
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Отчество</p>
                <Input
                  value={officeData.user.patronymic}
                  placeholder="Отчество"
                  className="w-[450px] rounded-xl"
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
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Телефон</p>
                <Input
                  value={officeData.user.phone}
                  placeholder="+7 (___) ___ - __ - __"
                  className="w-[450px] rounded-xl"
                  onInput={(e) =>
                    setOfficeData({
                      ...officeData,
                      user: {
                        ...officeData.user,
                        phone: e.currentTarget.value,
                      },
                    })
                  }
                />
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Email</p>
                <MailInput
                  name="email"
                  value={officeData.user.email}
                  placeholder="Email"
                  className="w-[450px] rounded-xl"
                  onInput={(e) =>
                    setOfficeData({
                      ...officeData,
                      user: {
                        ...officeData.user,
                        email: e.currentTarget.value,
                      },
                    })
                  }
                />
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p
                  onClick={() => console.log(officeData)}
                  className="min-w-[134px]"
                >
                  Офис
                </p>
                <Select
                  onValueChange={(value: string) => {
                    setOfficeData({ ...officeData, office: value });
                  }}
                >
                  <SelectTrigger className="z-10 border-solid border-opacity-40 border-[1px] w-[450px] rounded-xl">
                    <SelectValue className="opacity-40" placeholder="Офис" />
                  </SelectTrigger>
                  <SelectContent className="flex justify-between z-10">
                    {offices.map((office, index) => (
                      <SelectItem
                        value={`${office.name}`}
                        className="ml-3 z-10 bg-white"
                        key={index}
                      >
                        {office.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Подразделение</p>
                <Input
                  value={officeData.department}
                  className="w-[450px] rounded-xl"
                  placeholder="Подразделение"
                  onInput={(e) =>
                    setOfficeData({
                      ...officeData,
                      department: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Логин</p>
                <Input
                  value={officeData.user.username}
                  className={`w-[450px] rounded-xl ${
                    usernameError ? "border-red-500" : ""
                  }`} // Отображаем ошибку, если есть
                  placeholder="Логин"
                  onInput={(e) =>
                    setOfficeData({
                      ...officeData,
                      user: {
                        ...officeData.user,
                        username: e.currentTarget.value,
                      },
                    })
                  }
                />
                {usernameError && (
                  <span className="text-red-500 text-xs">
                    Этот логин уже занят
                  </span>
                )}{" "}
                {/* Сообщение об ошибке */}
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Пароль</p>
                <Input className="w-[450px] rounded-xl" placeholder="Пароль" />
              </div>
            </div>
            <Button
              className="mt-8 bg-[#960047] w-[160px] h-[44px] rounded-xl"
              type="submit"
            >
              Добавить
            </Button>
          </div>
        </div>
        <Toaster />
      </form>
    </FormProvider>
  );
};
