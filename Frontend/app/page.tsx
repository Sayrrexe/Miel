"use client";

import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import Image from "next/image";
import baloons from "@/public/assets/Group (3).png";
import {useCategoryStore} from "@/store/context";
import fetchGetEndpoint, {fetchAuthorisation} from "@/lib/candidates";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import css from "./main.module.css";

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
    console.log(storedRole, storedFullName);
    if (storedRole) {
      console.log(storedRole);
      if (storedRole === "1") {
        console.log(231);
        router.push("/main1");
      } else if (storedRole === "2") {
        router.push("/main2");
      }
    }
  }, [router, data]);

  return (
    <div
      className={`ml-auto mr-auto flex items-center gap-[144px] justify-center ${css.container}`}
    >
      <Image
        className={`max-w-[311px] max-h-[322px] ${css.baloonsImage}`}
        src={baloons}
        alt="baloons"
        width={311}
        height={409}
      />
      <div
        className={`flex items-center justify-center h-[100vh] ${css.formWrapper}`}
      >
        <div
          className={`border-solid border-l-gray border-[1px] h-[552px] py-10 px-[66px] ${css.formBox}`}
        >
          <p className={`text-3xl pb-9 ${css.title}`}>Войти</p>
          {userWrong ? (
            <p
              className={`text-1xl pl-16 pb-[18px] text-red-500 ${css.errorMessage}`}
            >
              Логин или пароль введен неверно
            </p>
          ) : (
            ""
          )}

          <div
            className={`flex items-center justify-center w-[100%] ${css.formContent}`}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={`space-y-8 ${css.formInner}`}
              >
                <div className={`flex gap-[14px] flex-col ${css.formFields}`}>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel className={css.formLabel}>Логин</FormLabel>
                        <FormControl>
                          <Input
                            className={`w-[324px] h-[44px] hover:bg-input-primary-hvr ${css.input}`}
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
                    render={({field}) => (
                      <FormItem>
                        <FormLabel className={css.formLabel}>Пароль</FormLabel>
                        <FormControl>
                          <Input
                            className={`w-[324px] h-[44px] hover:bg-input-primary-hvr ${css.input}`}
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
                  <div
                    className={`flex items-center flex-col pt-[22px] ${css.actionsWrapper}`}
                  >
                    <Button
                      className={`bg-btn-primary hover:bg-btn-primary-hover w-[324px] border- h-[44px] text-white ${css.loginButton}`}
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
                                  localStorage.setItem("photo", info.photo);
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
                <p
                  className={` w-[324px] break-words text-sm text-gray-400 ${css.privacyPolicyText}`}
                >
                  Нажимая кнопку “Войти”, вы автоматически соглашаетесь с
                  политикой конфиденциальности сайта
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorisation;
