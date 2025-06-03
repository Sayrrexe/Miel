"use client";
import {Button, Input} from "@/components/ui";
import {fetchPostEndpoint} from "@/lib/candidates";
import {cn} from "@/lib/utils";
import {useCandidates, useEmployee} from "@/store/context";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import toast, {Toaster} from "react-hot-toast";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect, useState} from "react";
import css from "./main.module.css";

export const CandidateNewAdd = () => {
  const router = useRouter();
  const employee = useEmployee((state) => state.data);
  const setEmployee = useEmployee((state) => state.setEmployee);
  const token = localStorage.getItem("token") || "";
  const candidates = useCandidates((state) => state.data);
  const setCandidates = useCandidates((state) => state.setCandidates);
  const [isLoading, setIsLoading] = useState(false);

  // Схема валидации с использованием Zod
  const checkoutFormSchema = z.object({
    data: z.string().refine(
      (val) => {
        if (!val) return false;
        const regex = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!regex.test(val)) return false;
        const [day, month, year] = val.split(".").map(Number);
        const date = new Date(year, month - 1, day);
        return (
          date.getDate() === day &&
          date.getMonth() === month - 1 &&
          date.getFullYear() === year &&
          year >= 1900 &&
          year <= new Date().getFullYear()
        );
      },
      {message: "Введите корректную дату в формате ДД.ММ.ГГГГ (например, 01.01.2000)"}
    ),
    email: z.string().email("Введите корректный email"),
  });

  type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

  // Инициализация формы с react-hook-form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      data: "",
      email: "",
    },
  });

  // Сброс состояния employee при монтировании компонента
  useEffect(() => {
    setEmployee({
      age: 0,
      basic_legal_course: "",
      birth: "",
      city: "",
      clients: 0,
      completed_objects: 0,
      country: "",
      course_mortgage: "",
      course_rieltor_join: "",
      course_taxation: "",
      created_at: "",
      education: "",
      is_archive: false,
      is_free: true,
      name: "",
      patronymic: "",
      phone: "",
      resume: "",
      surname: "",
      office_name: "",
      email: "",
    });
  }, [setEmployee]);

  // Обработчик отправки формы
  const onSubmit = async (data: CheckoutFormValues) => {
    if (!token) {
      toast.error("Токен авторизации отсутствует");
      return;
    }

    setIsLoading(true);
    try {
      // Преобразование даты из ДД.ММ.ГГГГ в ГГГГ-ММ-ДД для сервера
      const formattedData = {
        ...data,
        data: data.data ? data.data.split(".").reverse().join("-") : "",
      };
      const updatedEmployee = {...employee, ...formattedData, birth: formattedData.data};
      const response = await fetchPostEndpoint("/api/admin/candidates/", updatedEmployee, token);
      if (response.error) {
        throw new Error(response.error);
      }
      toast.success("Кандидат добавлен!");
      setCandidates([...candidates, updatedEmployee]);
      setEmployee(updatedEmployee);
      router.push(`/main1/`);
    } catch (error) {
      console.error("Ошибка запроса:", error);
      toast.error("Кандидат не добавлен");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("mt-[52px] ml-10")}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Link href={"./candidates"}
            className="flex gap-[10px] hover:text-gray-300">
            <ArrowLeft/>
            Вернуться
          </Link>
          <div className="mt-[29px]">
            <div className="flex flex-col gap-5">
              {/* Фамилия */}
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Фамилия</p>
                <Input
                  value={employee.surname}
                  placeholder="Фамилия"
                  className="w-[450px] rounded-xl"
                  onInput={(e) =>
                    setEmployee({...employee, surname: e.currentTarget.value})
                  }
                />
              </div>

              {/* Имя */}
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Имя</p>
                <Input
                  onInput={(e) =>
                    setEmployee({
                      ...employee,
                      name: e.currentTarget.value,
                    })
                  }
                  value={employee.name}
                  placeholder="Имя"
                  className="w-[450px] rounded-xl"
                />
              </div>

              {/* Отчество */}
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Отчество</p>
                <Input
                  type="text"
                  value={employee.patronymic}
                  className="w-[450px] rounded-xl"
                  placeholder="Отчество"
                  onInput={(e) =>
                    setEmployee({
                      ...employee,
                      patronymic: e.currentTarget.value,
                    })
                  }
                />
              </div>

              {/* Телефон */}
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Телефон</p>
                <Input
                  value={employee.phone}
                  className="w-[450px] rounded-xl"
                  placeholder="+7 (___) ___ - __ - __"
                  onInput={(e) =>
                    setEmployee({
                      ...employee,
                      phone: e.currentTarget.value,
                    })
                  }
                />
              </div>

              {/* Дата рождения */}
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Дата рождения</p>
                <div className="w-[450px]">
                  <Input
                    {...form.register("data")}
                    value={form.watch("data")}
                    className={`w-[450px] rounded-xl ${
                      form.formState.errors.data ? "border-red-500" : ""
                    }`}
                    placeholder="ДД.ММ.ГГГГ"
                    onInput={(e) =>
                      setEmployee({
                        ...employee,
                        birth: e.currentTarget.value.split(".").reverse().join("-"),
                      })
                    }
                  />
                  {form.formState.errors.data && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.data.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Страна */}
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Страна</p>
                <Input
                  value={employee.country}
                  className="w-[450px] rounded-xl"
                  placeholder="Страна"
                  onInput={(e) =>
                    setEmployee({
                      ...employee,
                      country: e.currentTarget.value,
                    })
                  }
                />
              </div>

              {/* Город */}
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Город</p>
                <Input
                  value={employee.city}
                  className="w-[450px] rounded-xl"
                  placeholder="Город"
                  onInput={(e) =>
                    setEmployee({
                      ...employee,
                      city: e.currentTarget.value,
                    })
                  }
                />
              </div>

              {/* Email */}
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Email</p>
                <div className="w-[450px]">
                  <Input
                    {...form.register("email")}
                    value={employee.email}
                    className={`w-[450px] rounded-xl ${
                      form.formState.errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Email"
                    onInput={(e) =>
                      setEmployee({
                        ...employee,
                        email: e.currentTarget.value,
                      })
                    }
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-8 bg-[#960047] w-[160px] h-[44px] rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? "Добавляю..." : "Создать"}
            </Button>
          </div>
          <Toaster/>
        </form>
      </FormProvider>
    </div>
  );
};