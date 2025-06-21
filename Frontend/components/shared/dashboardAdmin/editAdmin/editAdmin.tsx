"use client";
import {useCallback, useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useRouter, useParams} from "next/navigation";
import {transliterate} from "transliteration";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import fetchGetEndpoint, {
  fetchPatchEndpoint,
  fetchPostEndpoint
} from "@/lib/candidates";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {MailInput} from "../../formInputs/mailInput";
import css from "./main.module.css";
import toast, {Toaster} from "react-hot-toast";
import {Plus} from "@/components/ui/icons/plus";
import {Password} from "@/components/ui/icons/password";
import {ArrowLeft} from "lucide-react";

export const EditAdmin = () => {
  // Схема валидации
  const editAdminSchema = z.object({
    email: z.string().email({message: "Введите корректную почту"}),
    last_name: z.string().min(1, "Фамилия обязательна"),
    first_name: z.string().min(1, "Имя обязательно"),
    patronymic: z.string().optional(),
    phone: z
      .string()
      .min(1, "Телефон обязателен")
      .regex(/^\+?\d{10,15}$/, "Неверный формат телефона"),
    office: z.number().min(1, "Выберите офис"),
    department: z.string().optional(),
    username: z.string().min(1, "Логин обязателен"),
    password: z.string().optional(),
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

  interface Supervisor {
    department: string | null;
    id: number;
    office: number | null;
    office_name: string | null;
    user: {
      email: string;
      last_name: string;
      phone: string | null;
      first_name: string;
      patronymic: string | null;
      username: string;
    };
  }

  type EditAdminForm = z.infer<typeof editAdminSchema>;

  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null);
  const token = localStorage.getItem("token") || "";
  const router = useRouter();
  const {id} = useParams();

  const form = useForm<EditAdminForm>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      email: "",
      last_name: "",
      first_name: "",
      patronymic: "",
      phone: "",
      office: 0,
      department: "",
      username: "",
      password: "",
    },
  });

  // Загрузка данных руководителя и офисов
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Загрузка данных руководителя
        const supervisorResponse = await fetchGetEndpoint(
          `/api/admin/supervisors/${id}/`,
          token
        );
        if ("data" in supervisorResponse && supervisorResponse.data) {
          const data = supervisorResponse.data as Supervisor;
          setSupervisor(data);
          form.reset({
            email: data.user.email,
            last_name: data.user.last_name,
            first_name: data.user.first_name,
            patronymic: data.user.patronymic || "",
            phone: data.user.phone || "",
            office: data.office || 0,
            department: data.department || "",
            username: data.user.username,
            password: "",
          });
        } else {
          toast.error("Ошибка загрузки данных руководителя");
        }

        // Загрузка офисов
        const officesResponse = await fetchGetEndpoint("/api/admin/offices/", token);
        if ("data" in officesResponse && Array.isArray(officesResponse.data)) {
          setOffices(officesResponse.data);
        } else {
          toast.error("Ошибка загрузки офисов");
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        toast.error("Не удалось загрузить данные");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, token, form]);

  // Генерация логина
  const generateLogin = useCallback((firstName: string, lastName: string): string => {
    const firstPart = transliterate(firstName).slice(0, 3).toLowerCase().replace(/\s/g, "") || "usr";
    const lastPart = transliterate(lastName).slice(0, 3).toLowerCase().replace(/\s/g, "") || "";
    const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, "0");
    let login = `${firstPart}${lastPart}${randomSuffix}`.slice(0, 10);
    if (login.length < 6) {
      const extraDigits = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      login = `${login}${extraDigits}`.slice(0, 10);
    }
    return login;
  }, []);

  // Проверка и генерация логина
  const checkAndGenerateLogin = async (): Promise<string | null> => {
    const {first_name, last_name} = form.getValues();
    if (!first_name || !last_name) {
      toast.error("Введите имя и фамилию для генерации логина");
      return null;
    }

    let login = generateLogin(first_name, last_name);
    try {
      const response = await fetchPostEndpoint("/api/info/", {username: login}, token);
      if (response.error === "Username already exists") {
        login = generateLogin(first_name, last_name);
        const secondResponse = await fetchPostEndpoint("/api/info/", {username: login}, token);
        if (secondResponse.error === "Username already exists") {
          toast.error("Не удалось найти свободный логин. Попробуйте другой.");
          setUsernameError(true);
          return null;
        }
      }
      setUsernameError(false);
      return login;
    } catch (error) {
      console.error("Ошибка проверки логина:", error);
      toast.error("Ошибка при проверке логина");
      return null;
    }
  };

  // Генерация пароля
  const generatePassword = (): string => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";
    const allChars = letters + numbers + symbols;
    let password = "";
    password += letters[Math.floor(Math.random() * letters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }
    return password.split("").sort(() => Math.random() - 0.5).join("");
  };

  // Обработчик генерации пароля
  const handleGeneratePassword = () => {
    try {
      const newPassword = generatePassword();
      form.setValue("password", newPassword);
      toast.success("Пароль успешно сгенерирован!");
    } catch (error) {
      console.error("Ошибка генерации пароля:", error);
      toast.error("Ошибка при генерации пароля");
    }
  };

  // Обработчик копирования пароля
  const handleCopyPassword = () => {
    const password = form.getValues("password");
    if (password) {
      navigator.clipboard
        .writeText(password)
        .then(() => toast.success("Пароль скопирован в буфер обмена!"))
        .catch((error) => {
          console.error("Ошибка копирования пароля:", error);
          toast.error("Ошибка при копировании пароля");
        });
    } else {
      toast.error("Пароль не сгенерирован");
    }
  };

  // Оброшчик генерации логина
  const handleGenerateLogin = async () => {
    setIsLoading(true);
    const newLogin = await checkAndGenerateLogin();
    if (newLogin) {
      form.setValue("username", newLogin);
      setUsernameError(false);
      toast.success("Логин успешно сгенерирован!");
    }
    setIsLoading(false);
  };

  // Обработчик отправки формы
  const onSubmit = async (data: EditAdminForm) => {
    try {
      const dataToSend = {
        department: data.department,
        office: data.office,
        user: {
          email: data.email,
          last_name: data.last_name,
          phone: data.phone,
          first_name: data.first_name,
          patronymic: data.patronymic,
          username: data.username,
          password: data.password || undefined,
        },
      };

      const response = await fetchPatchEndpoint(
        `/api/admin/supervisors/${id}/`,
        dataToSend,
        token
      );

      if ("error" in response) {
        throw new Error(response.error);
      }

      toast.success("Данные руководителя обновлены!");
      setTimeout(() => {
        router.push("/main1");
      }, 2000);
    } catch (error: any) {
      console.error("Ошибка обновления:", error);
      toast.error(`Ошибка: ${error.message || "Не удалось обновить данные"}`);
    }
  };

  // Обработчик добавления нового офиса
  const handleAddOfficeClick = () => {
    router.push("/addingOffice");
  };

  const isGenerateButtonDisabled = !form.watch("first_name") || !form.watch("last_name");

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
          <div className="mt-[29px] h-[calc(100vh-200px)] overflow-y-auto p-5">
            <div className="flex flex-col gap-5">
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <label
                  htmlFor="last_name"
                  className="min-w-[134px]"
                >
                  Фамилия
                </label>
                <div>
                  <Input
                    id="last_name"
                    {...form.register("last_name")}
                    placeholder="Фамилия"
                    className="md:w-[420px] rounded-xl"
                  />
                  {form.formState.errors.last_name && (
                    <p className="text-error-text text-sm mt-1">
                      {form.formState.errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <label
                  htmlFor="first_name"
                  className="min-w-[134px]"
                >
                  Имя
                </label>
                <div>
                  <Input
                    id="first_name"
                    {...form.register("first_name")}
                    placeholder="Имя"
                    className="md:w-[420px] rounded-xl"
                  />
                  {form.formState.errors.first_name && (
                    <p className="text-error-text text-sm mt-1">
                      {form.formState.errors.first_name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <label
                  htmlFor="patronymic"
                  className="min-w-[134px]"
                >
                  Отчество
                </label>
                <div>
                  <Input
                    id="patronymic"
                    {...form.register("patronymic")}
                    placeholder="Отчество"
                    className="md:w-[420px] rounded-xl"
                  />
                  {form.formState.errors.patronymic && (
                    <p className="text-error-text text-sm mt-1">
                      {form.formState.errors.patronymic.message}
                    </p>
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
                    {...form.register("phone")}
                    placeholder="+7 (___) ___ - __ - __"
                    className="md:w-[420px] rounded-xl"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-error-text text-sm mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <label
                  htmlFor="email"
                  className="min-w-[134px]"
                >
                  Email
                </label>
                <div>
                  <MailInput
                    id="email"
                    {...form.register("email")}
                    placeholder="Email"
                    className="md:w-[420px] rounded-xl"
                  />
                  {form.formState.errors.email && (
                    <p className="text-error-text text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <label
                  htmlFor="office"
                  className="min-w-[134px]"
                >
                  Офис
                </label>
                <div className="flex items-center gap-1">
                  <Select
                    onValueChange={(value: string) => {
                      const selectedOffice = offices.find((office) => office.name === value);
                      if (selectedOffice) {
                        form.setValue("office", selectedOffice.id);
                      }
                    }}
                    defaultValue={offices.find((o) => o.id === supervisor?.office)?.name || ""}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="text-tertiary-text z-10 border-solid border-opacity-40 border-[1px] md:w-[372px] rounded-xl">
                      <SelectValue placeholder="Офис" />
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleAddOfficeClick}
                    aria-label="Добавить новый офис"
                  >
                    <Plus />
                  </Button>
                </div>
                {form.formState.errors.office && (
                  <p className="text-error-text text-sm mt-1">
                    {form.formState.errors.office.message}
                  </p>
                )}
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <label
                  htmlFor="department"
                  className="min-w-[134px]"
                >
                  Подразделение
                </label>
                <div>
                  <Input
                    id="department"
                    {...form.register("department")}
                    placeholder="Подразделение"
                    className="md:w-[420px] rounded-xl"
                  />
                  {form.formState.errors.department && (
                    <p className="text-error-text text-sm mt-1">
                      {form.formState.errors.department.message}
                    </p>
                  )}
                </div>
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <label
                  htmlFor="username"
                  className="min-w-[134px]"
                >
                  Логин
                </label>
                <div className="flex items-center gap-1">
                  <Input
                    id="username"
                    {...form.register("username")}
                    className={`md:w-[372px] rounded-xl ${usernameError ? "border-error-text" : ""}`}
                    placeholder="Логин"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Сгенерировать логин"
                    onClick={handleGenerateLogin}
                    disabled={isGenerateButtonDisabled || isLoading}
                  >
                    <Password />
                  </Button>
                </div>
                {usernameError && (
                  <span className="text-error-text text-xs">Этот логин уже занят</span>
                )}
                {form.formState.errors.username && (
                  <p className="text-error-text text-sm mt-1">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <label
                  htmlFor="password"
                  className="min-w-[134px]"
                >
                  Пароль
                </label>
                <div className="flex items-center gap-1">
                  <Input
                    id="password"
                    {...form.register("password")}
                    className="md:w-[372px] rounded-xl cursor-pointer"
                    placeholder="Пароль"
                    readOnly
                    onClick={handleCopyPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Сгенерировать пароль"
                    onClick={handleGeneratePassword}
                    disabled={isGenerateButtonDisabled}
                  >
                    <Password />
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-error-text text-sm mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="default"
              className="mt-8 md:w-[160px] rounded-xl bg-btn-primary hover:bg-btn-primary-hover"
              type="submit"
              disabled={isLoading}
            >
              Сохранить
            </Button>
          </div>
        </div>
        <Toaster />
      </form>
    </FormProvider>
  );
};