"use client";
import {Button, Input} from "@/components/ui";
import {fetchPostEndpoint} from "@/lib/candidates";
import {cn} from "@/lib/utils";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {useForm} from "react-hook-form"; // Правильный импорт
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import toast, {Toaster} from "react-hot-toast";
import css from "./main.module.css";


const officeSchema = z.object({
  location: z.string().min(1, "Адрес обязателен"),
  name: z.string().min(1, "Название обязательно"),
  phone: z.string().min(1, "Телефон обязателен").regex(/^\+?\d{10,15}$/, "Неверный формат телефона"),
  quota: z.string().optional(), // Строковое поле для отображения плейсхолдера
});

type OfficeForm = z.infer<typeof officeSchema>;

export const AddingOffice = () => {
  const {register, handleSubmit, formState: {errors}} = useForm<OfficeForm>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      location: "",
      name: "",
      phone: "",
      quota: "",
    },
  });

  const token = localStorage.getItem("token") || "";

  const onSubmit = async (data: OfficeForm) => {
    const dataToSend = {
      ...data,
      quota: data.quota ? Number(data.quota) : 0, // Преобразуем в число
      used_quota: 0, // Добавляем, если сервер ожидает
      mail: "", // Добавляем, если сервер ожидает
    };
    console.log("Sending data:", dataToSend);
    try {
      const response = await fetchPostEndpoint("/api/admin/offices/", dataToSend, token);
      if (response.error) {
        throw new Error(response.error);
      }
      toast.success("Офис добавлен!");
    } catch (error: any) {
      console.error("Request failed:", error);
      toast.error(`Ошибка: ${error.message || "Офис не добавлен"}`);
    }
  };

  return (
    <div className={cn("mt-[52px] ml-10")}>
      <Link
        href={"./main1"}
        className="flex gap-[10px] hover:text-gray-300"
      >
        <ArrowLeft />
        Вернуться
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-[29px] flex flex-col gap-5"
      >
        <div className={`flex gap-5 items-center ${css.inputDiv}`}>
          <label
            htmlFor="name"
            className="min-w-[134px]"
          >
            Название офиса
          </label>
          <div>
            <Input
              id="name"
              {...register("name")}
              placeholder="Название"
              className="w-full md:w-[450px] rounded-xl"
            />
            {errors.name &&
              <p className="text-error-text text-sm mt-1">{errors.name.message}</p>}
          </div>
        </div>
        <div className={`flex gap-5 items-center ${css.inputDiv}`}>
          <label
            htmlFor="location"
            className="min-w-[134px]"
          >
            Адрес офиса
          </label>
          <div>
            <Input
              id="location"
              {...register("location")}
              placeholder="Адрес"
              className="w-full md:w-[450px] rounded-xl"
            />
            {errors.location && (
              <p className="text-error-text text-sm mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>
        <div className={`flex gap-5 items-center ${css.inputDiv}`}>
          <label
            htmlFor="phone"
            className="min-w-[134px]"
          >
            Телефон
          </label>
          <div>
            <Input
              id="phone"
              {...register("phone")}
              type="tel"
              placeholder="+7 (___) ___ - __ - __"
              className="w-full md:w-[450px] rounded-xl"
            />
            {errors.phone &&
              <p className="text-error-text text-sm mt-1">{errors.phone.message}</p>}
          </div>
        </div>
        <div className={`flex gap-5 items-center ${css.inputDiv}`}>
          <label
            htmlFor="quota"
            className="min-w-[134px]"
          >
            Количество квот
          </label>
          <div>
            <Input
              id="quota"
              {...register("quota")}
              type="number"
              placeholder="Введите число"
              className="w-full md:w-[450px] rounded-xl"
            />
            {errors.quota &&
              <p className="text-error-text text-sm mt-1">{errors.quota.message}</p>}
          </div>
        </div>
        <Button
          type="submit"
          variant="default"
          className="mt-8 w-[160px] rounded-xl"
        >
          Добавить
        </Button>
      </form>
      <Toaster />
    </div>
  );
};