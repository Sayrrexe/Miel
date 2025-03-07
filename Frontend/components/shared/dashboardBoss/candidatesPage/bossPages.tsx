"use client";

import { cn } from "@/lib/utils";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import frame from "../../../../public/assets/Frame.png";
import Image from "next/image";
import { Folder, Grid2X2, Heart, LogOut, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCategoryStore } from "@/store/context";
import css from "./main.module.css"; // Импортируем CSS-модуль
import { Menu as BurgerMenu } from "lucide-react";
import { useRouter } from "next/navigation";

export const BossPages = () => {
  const location = useLocation();
  const [activeCategorie, setActiveCategorie] = useState(
    location.pathname == "/candidatesFavored"
      ? 1
      : location.pathname == "/invitingHistory"
      ? 2
      : location.pathname == "/quotes"
      ? 3
      : 0
  );
  const data = useCategoryStore((state) => state.data);

  const [headerScreen, setHeaderScreen] = useState<boolean>(
    window.innerWidth < 1000 ? true : false
  );
  const router = useRouter(); // Инициализация useRouter внутри компонента
  const handleLogout = () => {
    // Очищаем локальное хранилище
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
    localStorage.removeItem("role");

    // Перенаправляем пользователя на страницу логина
    router.push("/");
  };

  return (
    <div
      className={cn(
        `flex flex-col float-left bg-gray-200 h-[calc(100vh-71px)] w-[277px] gap-6 ${css.container}`
      )}
    >
      <div
        className={`flex items-center ml-6 mt-5 gap-3 ${css.avatarContainer}`}
      >
        <Image
          width={40}
          height={40}
          src={
            localStorage.getItem("photo") &&
            localStorage.getItem("photo") !== "null"
              ? (localStorage.getItem("photo") as string) // если фото есть, используем его
              : user // если нет фото, используем дефолтное изображение
          }
          alt="avatar"
          className="mb-2 rounded-full"
          onClick={() => console.log(data)}
        />
        <div>
          {data.username && data.full_name ? (
            <div>
              <p className="text-xs font-bold">{data.username}</p>
              <p className="text-sm">{data.full_name}</p>
            </div>
          ) : (
            <p>user</p>
          )}
        </div>
      </div>
      <div className={`flex flex-col justify-between ${css.linkContainerDiv}`}>
        <div className={`mt-12 gap-0 flex flex-col ${css.linkContainer}`}>
          <div className={`${css.menuHeaderBurger} flex flex-col gap-0`}>
            <Link
              href={"./main2"}
              onClick={() => setActiveCategorie(0)}
              className={`${activeCategorie == 0 && "bg-gray-300"} ${
                headerScreen && "inline"
              } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
                headerScreen == true && css.linkItem
              }`}
            >
              <Grid2X2 />
              Витрина кандидатов
            </Link>
            <Link
              href={"./candidatesFavored"}
              onClick={() => setActiveCategorie(1)}
              className={`${activeCategorie == 1 && "bg-gray-300"} ${
                headerScreen && "inline"
              } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
                headerScreen == true && css.linkItem
              }`}
            >
              <Heart />
              Избранное
            </Link>
            <Link
              href={"./invitingHistory"}
              onClick={() => setActiveCategorie(2)}
              className={`${activeCategorie == 2 && "bg-gray-300"} ${
                headerScreen && "inline"
              } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
                headerScreen == true && css.linkItem
              }`}
            >
              <Folder />
              История приглашений
            </Link>
            <Link
              href={"./quotes"}
              onClick={() => setActiveCategorie(3)}
              className={`${activeCategorie == 3 && "bg-gray-300"} ${
                headerScreen && "inline"
              } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
                headerScreen == true && css.linkItem
              }`}
            >
              <Users />
              Статистика по квотам
            </Link>
          </div>
        </div>
        {window.innerWidth < 1000 ? (
          <LogOut
            height={24}
            width={24}
            className="cursor-pointer mt-1 mr-5"
            onClick={handleLogout} // Вызываем функцию с логикой выхода
          />
        ) : (
          ""
        )}
        {window.innerWidth < 1000 ? (
          <BurgerMenu
            className={`${css.burgerMenu}`}
            onClick={() => setHeaderScreen(!headerScreen)}
          />
        ) : (
          ""
        )}
        <Image
          width={280}
          height={169}
          src={frame}
          className={`${css.imageBottom}`}
          alt="avatar"
        />
      </div>
    </div>
  );
};
