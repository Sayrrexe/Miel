"use client";
import {useState, useEffect} from "react";
import {Button, Input} from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {fetchPatchEndpoint, fetchPostEndpoint} from "@/lib/candidates";
import fetchGetEndpoint from "@/lib/candidates";
import {cn} from "@/lib/utils";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import toast, {Toaster} from "react-hot-toast";
import {useRouter} from "next/navigation";
import css from "./main.module.css";

const officeSchema = z.object({
  location: z.string().min(1, "Адрес обязателен"),
  name: z.string().min(1, "Название обязательно"),
  phone: z.string().min(1, "Телефон обязателен").regex(/^\+?\d{10,15}$/, "Неверный формат телефона"),
  quota: z.number().nonnegative().optional().transform((val) => val ?? 0),
  supervisor: z.string().optional(),
});

type OfficeForm = z.infer<typeof officeSchema>;

interface User {
  first_name: string;
  last_name: string;
  patronymic: string;
  email: string;
  phone: string;
  username: string;
}

interface Supervisor {
  id: number;
  user: User;
  office: number | null;
  office_name: string | null;
  department: string | null;
}

export const AddingOffice = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue
  } = useForm<OfficeForm>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      location: "",
      name: "",
      phone: "",
      quota: undefined,
      supervisor: "",
    },
  });

  const token = localStorage.getItem("token") || "";
  const router = useRouter();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSupervisors = async () => {
      setIsLoading(true);
      try {
        const response = await fetchGetEndpoint("/api/admin/supervisors/", token);
        if ("error" in response) {
          toast.error(`Ошибка загрузки руководителей: ${response.error}`);
          return;
        }
        setSupervisors(response.data as any);
      } catch (error: any) {
        console.error("Ошибка при загрузке руководителей:", error);
        toast.error("Не удалось загрузить список руководителей");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupervisors();
  }, [token]);

  const onSubmit = async (data: OfficeForm) => {
    const dataToSend = {
      ...data,
      used_quota: 0,
    };
    console.log("Sending data:", dataToSend);
    try {
      const response = await fetchPostEndpoint("/api/admin/offices/", dataToSend, token);
      if (response.error) {
        throw new Error(response.error);
      }
      if (data.supervisor && response.id) {
        const supervisorResponse = await fetchPatchEndpoint(
          `/api/admin/supervisors/${data.supervisor}/`,
          {office: response.id},
          token
        );
        if ("error" in supervisorResponse) {
          toast.error(`Ошибка назначения руководителя: ${supervisorResponse.error}`);
        }
      }
      toast.success("Офис добавлен!");
      setTimeout(() => {
        router.push("./main1");
      }, 2000);
    } catch (error: any) {
      console.error("Ошибка:", error);
      toast.error(`Ошибка: ${error.message || "Офис не добавлен"}`);
    }
  };

  return (
    <div className={cn("mt-20 ml-10")}>
      <Link
        href={"./main1"}
        className="flex gap-10 hover:text-gray-300"
      >
        <ArrowLeft />
        Вернуться
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-28 flex flex-col gap-5"
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
            {errors.name && (
              <p className="text-error-text text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div className={`flex gap-5 items-center ${css.inputDiv}`}>
          <label
            htmlFor="location"
            className="min-w-[134px]"
          >
            Адрес
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
            {errors.phone && (
              <p className="text-error-text text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
        <div className={`flex gap-5 items-center ${css.inputDiv}`}>
          <label
            htmlFor="supervisor"
            className="min-w-[134px]"
          >
            Руководитель
          </label>
          <div>
            <Select
              onValueChange={(value) => setValue("supervisor", value)}
              defaultValue=""
              disabled={isLoading}
            >
              <SelectTrigger className="w-full md:w-[450px] rounded-xl">
                <SelectValue placeholder="Выберите руководителя" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="px-4 py-2 text-gray-500">Загрузка...</div>
                ) : supervisors.length > 0 ? (
                  supervisors.map((supervisor) => {
                    const fullName = [
                      supervisor.user.last_name,
                      supervisor.user.first_name,
                      supervisor.user.patronymic,
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <SelectItem
                        key={supervisor.id}
                        value={String(supervisor.id)}
                      >
                        {fullName}
                      </SelectItem>
                    );
                  })
                ) : (
                  <div className="px-4 py-2 text-gray-500">Нет доступных руководителей</div>
                )}
              </SelectContent>
            </Select>
            {errors.supervisor && (
              <p className="text-error-text text-sm mt-1">{errors.supervisor.message}</p>
            )}
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
              {...register("quota", {setValueAs: (v) => (v === "" ? undefined : Number(v))})}
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