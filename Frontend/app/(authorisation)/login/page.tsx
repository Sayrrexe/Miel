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
import { useCategoryStore } from "@/store/context";
import fetchGetEndpoint, { fetchAuthorisation } from "@/lib/candidates";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Authorisation = () => {
  const setUser = useCategoryStore((state) => state.setUser);
  const data = useCategoryStore((state) => state.data);
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
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedFullName = localStorage.getItem("full_name");

    if (storedRole && storedFullName) {
      if (storedRole === "1") {
        router.push("/main1");
      } else if (storedRole === "2") {
        router.push("/main2");
      }
    }
  }, [router, data]);
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
                                role: data.role,
                                full_name: data.full_name,
                                email: data.email,
                                phone: data.phone,
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
                                role: data.role,
                                full_name: data.full_name,
                                email: data.email,
                                phone: data.phone,
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
                      onClick={() =>
                        (async () => {
                          try {
                            const authResponse = await fetchAuthorisation(
                              "/api/login/",
                              data
                            );
                            console.log(authResponse);

                            // Check if the response is a success response
                            if ("token" in authResponse) {
                              // If the response has a token, continue as expected
                              localStorage.setItem("token", authResponse.token);

                              const endpointToCall = "/api/info/";
                              const infoResponse = await fetchGetEndpoint(
                                endpointToCall,
                                authResponse.token
                              );
                              console.log(infoResponse);

                              // Check if the response is of type SuccessResponse
                              if (
                                "data" in infoResponse &&
                                Array.isArray(infoResponse.data) &&
                                infoResponse.data.length > 0
                              ) {
                                const info = infoResponse.data[0]; // Get the first element of the array

                                console.log(info); // Log the first element

                                if (info) {
                                  setUser({
                                    username: data.username,
                                    password: data.password,
                                    role: info.role,
                                    full_name: info.full_name,
                                    email: info.email,
                                    phone: info.phone,
                                  });

                                  localStorage.setItem(
                                    "username",
                                    data.username
                                  );
                                  localStorage.setItem(
                                    "full_name",
                                    info.full_name
                                  );
                                  localStorage.setItem("role", info.role);
                                }
                              } else {
                                console.error(
                                  "No valid user data in response."
                                );
                                setUserWrong(true);
                              }
                            } else {
                              setUserWrong(true);
                            }
                          } catch (error) {
                            console.log(error);
                            setUserWrong(true);
                          }
                        })()
                      }
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
