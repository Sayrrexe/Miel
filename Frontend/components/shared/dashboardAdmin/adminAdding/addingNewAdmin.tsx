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
import fetchGetEndpoint, {fetchPostEndpoint} from "@/lib/candidates";
import {cn} from "@/lib/utils";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {MailInput} from "../../formInputs/mailInput";
import css from "./main.module.css";
import toast, {Toaster} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Plus} from "@/components/ui/icons/plus";
import {Password} from "@/components/ui/icons/password";
import {transliterate} from "transliteration";

export const AddingNewAdmin = () => {
  const checkoutFormSchema = z.object({
    email: z.string().email({message: "Введите корректную почту"}),
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

      if ("data" in response && Array.isArray(response.data)) {
        setOffices(response.data);
      } else {
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
      office: 0,
      username: "",
      password: "",
    },
  });

  const [usernameError, setUsernameError] = useState(false);
  const router = useRouter();
  const handleAddOfficeClick = () => {
    router.push("/addingOffice");
  };

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Функция генерации логина
  const generateLogin = (firstName: string, lastName: string, suffix: string = ""): string => {
    const firstPart = transliterate(firstName).slice(0, 3).toLowerCase().replace(/\s/g, "") || "";
    const lastPart = transliterate(lastName).slice(0, 3).toLowerCase().replace(/\s/g, "") || "";
    let login = `${firstPart}${lastPart}${suffix}`.slice(0, 10);

    if (login.length < 6) {
      const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      login = `${login}${randomDigits}`.slice(0, 10);
    }

    if (!login) {
      login = `user${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
    }

    return login;
  };

  // Функция проверки и генерации логина
  const checkAndGenerateLogin = async (): Promise<string | null> => {
    let login = officeData.user.username;
    let attempts = 0;
    const maxAttempts = 3;

    setOfficeData({
      ...officeData,
      user: {...officeData.user, username: ""},
    });
    setUsernameError(false);

    if (!login) {
      login = generateLogin(officeData.user.first_name, officeData.user.last_name);
    }

    while (attempts < maxAttempts) {
      try {
        const response = await fetchPostEndpoint(
          "/api/info/",
          {username: login},
          token
        );

        if (response.error === "Username already exists") {
          login = generateLogin(
            officeData.user.first_name,
            officeData.user.last_name,
            Math.floor(Math.random() * 100).toString().padStart(2, "0")
          );
          attempts++;
          continue;
        }

        return login;
      } catch (error) {
        console.error("Error checking login:", error);
        toast.error("Ошибка при проверке логина");
        return null;
      }
    }

    login = generateLogin(
      officeData.user.first_name,
      officeData.user.last_name,
      Math.floor(Math.random() * 10000).toString().padStart(4, "0")
    );
    try {
      const response = await fetchPostEndpoint(
        "/api/info/",
        {username: login},
        token
      );

      if (response.error === "Username already exists") {
        toast.error("Не удалось найти свободный логин. Попробуйте другой.");
        return null;
      }

      return login;
    } catch (error) {
      console.error("Error checking login:", error);
      toast.error("Ошибка при проверки логина");
      return null;
    }
  };

  // Функция генерации пароля
  const generatePassword = (): string => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = letters + numbers + symbols;

    let password = '';
    // Гарантируем минимум 1 букву, 1 цифру и 1 символ
    password += letters[Math.floor(Math.random() * letters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Заполняем оставшиеся 7 символов
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }

    // Перемешиваем пароль
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  // Обработчик для кнопки генерации пароля
  const handleGeneratePassword = () => {
    try {
      const newPassword = generatePassword();
      setOfficeData({
        ...officeData,
        user: {...officeData.user, password: newPassword},
      });
      toast.success("Пароль успешно сгенерирован!");
    } catch (error) {
      console.error("Error generating password:", error);
      toast.error("Ошибка при генерации пароля");
    }
  };

  // Обработчик копирования пароля
  const handleCopyPassword = () => {
    if (officeData.user.password) {
      navigator.clipboard.writeText(officeData.user.password)
        .then(() => {
          toast.success("Пароль скопирован в буфер обмена!");
        })
        .catch((error) => {
          console.error("Error copying password:", error);
          toast.error("Ошибка при копировании пароля");
        });
    } else {
      toast.error("Пароль не сгенерирован");
    }
  };

  // Обработчик для кнопки генерации логина
  const handleGenerateLogin = async () => {
    const newLogin = await checkAndGenerateLogin();
    if (newLogin) {
      setOfficeData({
        ...officeData,
        user: {...officeData.user, username: newLogin},
      });
      setUsernameError(false);
      toast.success("Логин успешно сгенерирован!");
    }
  };

  // Отключение кнопки, если first_name или last_name пустые
  const isGenerateButtonDisabled = !officeData.user.first_name || !officeData.user.last_name;

  const onSubmit = async () => {
    try {
      const usernameCheckResponse = await fetchPostEndpoint(
        "/api/info/",
        {username: officeData.user.username},
        token
      );

      if (usernameCheckResponse.error === "Username already exists") {
        setUsernameError(true);
        toast.error("Логин занят. Выберите другой.");
        return;
      }

      const response = await fetchPostEndpoint(
        "/api/admin/supervisors/",
        officeData,
        token
      );

      if ("error" in response) {
        throw new Error(response.error);
      } else {
        toast.success("Руководитель добавлен!");
        router.back();
        setOfficeData({
          department: "",
          office: "",
          user: {
            email: "",
            last_name: "",
            phone: "",
            first_name: "",
            patronymic: "",
            office: 0,
            username: "",
            password: "",
          },
        });
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
          <div className="mt-[29px] h-[calc(100vh-200px)] overflow-y-auto p-5">
            <div className="flex flex-col gap-5">
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Фамилия</p>
                <Input
                  value={officeData.user.last_name}
                  placeholder="Фамилия"
                  className="md:w-[420px] rounded-xl"
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
                  className="md:w-[420px] rounded-xl"
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
                  className="md:w-[420px] rounded-xl"
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
                  className="md:w-[420px] rounded-xl"
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
                  className="md:w-[420px] rounded-xl"
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
                <div className="flex items-center gap-1">
                  <Select
                    onValueChange={(value: string) => {
                      const selectedOffice = offices.find(
                        (office) => office.name === value
                      );
                      if (selectedOffice) {
                        setOfficeData({
                          ...officeData,
                          office: String(selectedOffice.id),
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="text-tertiary-text z-10 border-solid border-opacity-40 border-[1px] md:w-[372px] rounded-xl">
                      <SelectValue
                        className="opacity-40"
                        placeholder="Офис"
                      />
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
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Подразделение</p>
                <Input
                  value={officeData.department}
                  className="md:w-[420px] rounded-xl"
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
                <div className="flex items-center gap-1">
                  <Input
                    value={officeData.user.username}
                    className={`md:w-[372px] rounded-xl ${
                      usernameError ? "border-red-500" : ""
                    }`}
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Сгенерировать логин"
                    onClick={handleGenerateLogin}
                    disabled={isGenerateButtonDisabled}
                  >
                    <Password />
                  </Button>
                </div>
                {usernameError && (
                  <span className="text-red-500 text-xs">
                    Этот логин уже занят
                  </span>
                )}
              </div>
              <div className={`flex gap-5 items-center ${css.inputDiv}`}>
                <p className="min-w-[134px]">Пароль</p>
                <div className="flex items-center gap-1">
                  <Input
                    value={officeData.user.password}
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
              </div>
            </div>
            <Button
              variant="default"
              className="mt-8 md:w-[160px]"
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