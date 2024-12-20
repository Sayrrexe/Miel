"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import baloons from "@/public/assets/Скриншот-06-12-2024 16_52_58.jpg";
import { useCategoryStore, useCTokenStore } from "@/store/context";
import { fetchPostEndpoint } from "@/lib/candidates";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Authorisation = () => {
  const setUser = useCategoryStore((state) => state.setUser);
  const data = useCategoryStore((state) => state.data);
  const setToken = useCTokenStore((state) => state.setToken);

  const [userWrong, setUserWrong] = useState(false);
  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  const router = useRouter();
  return (
    <div className="flex items-center w-[930px] ml-auto mr-auto">
      <div className="flex items-center justify-center h-[100vh] w-[100%]">
        <div className="border-solid w-[456px] border-black border-[1px] h-[552px]">
          <p className="text-3xl pt-10 pl-16 pb-[18px]">Войти</p>
          {userWrong ? (
            <p className="text-1xl pl-16 pb-[18px] text-red-500">
              Логин или пароль введен неверно
            </p>
          ) : (
            ""
          )}

          <div className="flex items-center justify-center w-[100%]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex gap-[14px] flex-col items-center justify-center w-[100%]">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Логин</FormLabel>
                        <FormControl>
                          <Input
                            className="w-[324px]"
                            placeholder="Логин"
                            {...field}
                            value={data.username}
                            onInput={(e) =>
                              setUser({
                                username: e.currentTarget.value,
                                password: data.password,
                              })
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input
                            className="w-[324px]"
                            placeholder="Пароль"
                            type="password"
                            {...field}
                            value={data.password}
                            onInput={(e) =>
                              setUser({
                                username: data.username,
                                password: e.currentTarget.value,
                              })
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center flex-col gap-[33px]">
                    <p className="mt-[14px] text-sm cursor-pointer hover:text-orange-400">
                      Забыли пароль?
                    </p>
                    <Button
                      className="bg-orange-600 w-[160px] border- h-[44px] text-white"
                      type="submit"
                      onClick={async () => {
                        try {
                          // Отправка запроса
                          const response = await fetchPostEndpoint(
                            "/api/login/",
                            data,
                            null
                          );
                          console.log(response);
                          // Проверка, что ответ от сервера валиден и содержит данные
                          if (response && response.token) {
                            // Если все в порядке, сохраняем токен и переходим на страницу
                            console.log(1);
                            setToken(response.token);
                            router.push("/dashboardBossCandidates");
                          } else {
                            // Если данных нет в ответе, обрабатываем ошибку
                            setUserWrong(true);
                          }
                        } catch (error) {
                          // Обработка ошибки запроса
                          console.log(error);
                          setUserWrong(true);
                        }
                      }}
                    >
                      Войти
                    </Button>
                  </div>
                </div>
                <p className="w-[391px] text-sm text-gray-400">
                  Нажимая кнопку “Войти”, вы автоматически соглашаетесь с
                  политикой конфиденциальности сайта
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Image
        className="max-w-[311px] max-h-[322px]"
        src={baloons}
        alt="baloons"
        width={311}
        height={322}
      />
    </div>
  );
};

export default Authorisation;
