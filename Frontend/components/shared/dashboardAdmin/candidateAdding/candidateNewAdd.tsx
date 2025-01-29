"use client";
import { Button, Input } from "@/components/ui";
import { fetchPostEndpoint } from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { useCandidates, useEmployee } from "@/store/context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { MailInput } from "../adminAdding";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

export const CandidateNewAdd = () => {
  const router = useRouter();
  const employee = useEmployee((state) => state.data);
  const setEmployee = useEmployee((state) => state.setEmployee);
  const token = localStorage.getItem("token") || "";
  const checkoutFormSchema = z.object({
    data: z.string().date("Введите корректную дату"),
  });
  const candidates = useCandidates((state) => state.data);
  const setCandidates = useCandidates((state) => state.setCandidates);
  type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
  useEffect(
    () =>
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
      }),
    [setEmployee]
  );

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      data: "",
    },
  });
  const onSubmit = (data: CheckoutFormValues) => {
    console.log(data);
  };
  return (
    <div className={cn("mt-[52px] ml-10")}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  value={employee.surname}
                  placeholder="Фамилия"
                  className="w-[450px] rounded-xl"
                  onInput={(e) =>
                    setEmployee({ ...employee, surname: e.currentTarget.value })
                  }
                />
              </div>
              <div className="flex gap-5 items-center">
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
              <div className="flex gap-5 items-center">
                <p className="min-w-[134px]">Отчество</p>
                <Input
                  type="phone"
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
              <div className="flex gap-5 items-center">
                <p className="min-w-[134px]">Телефон</p>
                <Input
                  value={employee.phone}
                  className="w-[450px] rounded-xl"
                  placeholder="+7 (___) ___ - __ - __  "
                  onInput={(e) =>
                    setEmployee({
                      ...employee,
                      phone: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-5 items-center">
                <p className="min-w-[134px]">Дата рождения</p>
                <MailInput
                  name="data"
                  value={employee.birth}
                  className="w-[450px] rounded-xl"
                  placeholder="Дата рождения"
                  onInput={(e) =>
                    setEmployee({
                      ...employee,
                      birth: e.currentTarget.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-5 items-center">
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
              <div className="flex gap-5 items-center">
                <p className="min-w-[134px]">Город</p>
                <Input
                  value={employee.city}
                  className="w-[450px] rounded-xl "
                  placeholder="Город"
                  onInput={(e) =>
                    setEmployee({
                      ...employee,
                      city: e.currentTarget.value,
                    })
                  }
                />
              </div>
            </div>
            <Button
              className="mt-8 bg-[#960047] w-[160px] h-[44px] rounded-xl"
              onClick={async () => {
                console.log("Sending data:", employee);
                try {
                  const response = await fetchPostEndpoint(
                    "/api/admin/candidates/",
                    employee,
                    token
                  );
                  console.log("Response:", response);
                  if (response.error) {
                    // Если в ответе есть ошибка, выбрасываем исключение
                    throw new Error(response.error);
                  } else {
                    // Если ошибки нет, значит запрос успешен
                    toast.success("Кандидат добавлен!");
                    setCandidates([...candidates, employee]);
                    router.push(`/addingEmployee/${candidates.length}`);
                  }
                } catch (error) {
                  console.error("Request failed:", error);
                  toast.error("Кандидат не добавлен");
                }
              }}
            >
              Создать
            </Button>
          </div>
          <Toaster />
        </form>
      </FormProvider>
    </div>
  );
};
