"use client";
import { Button, Input } from "@/components/ui";
import { fetchPostEndpoint } from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MailInput } from "../../formInputs/mailInput";
import toast, { Toaster } from "react-hot-toast";

export const AddingNewAdmin = () => {
  const checkoutFormSchema = z.object({
    email: z.string().email({ message: "Введите корректную почту" }),
  });

  type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

  const token = localStorage.getItem("token") || "";
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
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (data: CheckoutFormValues) => {
    console.log(data);
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
              <div className="flex gap-5 items-center">
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
                  className="w-[450px] rounded-xl"
                />
              </div>
              <div className="flex gap-5 items-center">
                <p className="min-w-[134px]">Отчество</p>
                <Input
                  type="phone"
                  value={officeData.user.patronymic}
                  className="w-[450px] rounded-xl"
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
                  className="w-[450px] rounded-xl"
                  placeholder="+7 (___) ___ - __ - __"
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
              <div className="flex gap-5 items-center">
                <p className="min-w-[134px]">Email</p>
                <div>
                  <MailInput
                    name="email"
                    value={officeData.user.email}
                    className="w-[450px] rounded-xl"
                    placeholder="Email"
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
              </div>
              <div className="flex gap-5 items-center">
                <p className="min-w-[134px]">Офис</p>
                <Input
                  value={officeData.user.office}
                  className="w-[450px] rounded-xl"
                  placeholder="Офис"
                  onInput={(e) =>
                    setOfficeData({
                      ...officeData,
                      user: {
                        ...officeData.user,
                        office: e.currentTarget.value,
                      },
                    })
                  }
                />
              </div>
              <div className="flex gap-5 items-center">
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
              <div className="flex gap-5 items-center">
                <p className="min-w-[134px]">Логин</p>
                <Input
                  value={officeData.user.username}
                  className="w-[450px] rounded-xl"
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
              </div>
              <div className="flex gap-5 items-center">
                <p className="min-w-[134px]">Пароль</p>
                <Input className="w-[450px] rounded-xl" placeholder="Пароль" />
              </div>
            </div>
            <Button
              className="mt-8 bg-[#960047] w-[160px] h-[44px] rounded-xl"
              type="submit"
              onClick={async () => {
                console.log("Sending data:", officeData);
                try {
                  const response = await fetchPostEndpoint(
                    "/api/admin/supervisors/",
                    officeData,
                    token
                  );
                  console.log("Response:", response);

                  // Проверка типа ответа, чтобы убедиться, что есть ошибка
                  if ("error" in response) {
                    // Если в ответе есть ошибка, выбрасываем исключение
                    throw new Error(response.error);
                  } else {
                    // Если ошибки нет, значит запрос успешен
                    toast.success("Руководитель добавлен!");
                  }
                } catch (error) {
                  console.error("Request failed:", error);
                  toast.error("Офис не добавлен");
                }
              }}
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
