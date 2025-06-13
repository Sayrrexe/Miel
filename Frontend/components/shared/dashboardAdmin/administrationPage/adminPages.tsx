"use client";
import {useState} from "react";
import {
  ArchiveRestore,
  BellDot,
  Settings,
  Menu as BurgerMenu,
  LogOut, // Иконка бургера
} from "lucide-react";
import {Administration} from "@/components/ui/icons/administration";
import {Planning} from "@/components/ui/icons/plannig";
import {Showcase} from "@/components/ui/icons/showcase";
import {Statistics} from "@/components/ui/icons/statistics";
import {Archive} from "@/components/ui/icons/archive";
import Image from "next/image";
import officeWoman from "../../../../public/assets/Office woman.png";
import Link from "next/link";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import css from "./main.module.css"; // Импортируем CSS-модуль
import {useRouter} from "next/navigation";

export const AdminPages = () => {
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

  const [activeCategorie, setActiveCategorie] = useState(
    location.pathname == "/main1"
      ? 0
      : location.pathname == "/plans"
        ? 1
        : location.pathname == "/statisticAdmin"
          ? 3
          : location.pathname == "/archive"
            ? 4
            : location.pathname == "/notifications"
              ? 5
              : location.pathname == "/settings"
                ? 6
                : 2
  );
  const [headerScreen, setHeaderScreen] = useState<boolean>(
    window.innerWidth < 1000 ? true : false
  );

  return (
    <div
      className={`relative bg-gray-200 h-[calc(100vh-71px)] ${css.container}`}
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
              ? (localStorage.getItem("photo") as string)
              : user
          }
          alt="avatar"
          className={`${css.avatarImage}`}
        />
        <div className={`${css.userNameContainer}`}>
          {localStorage.getItem("username") ? (
            <div>
              <p className={`${css.userNameText}`}>
                {localStorage.getItem("username")}
              </p>
            </div>
          ) : (
            <p className={`${css.defaultUserText}`}>user</p>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {/* Ссылки навигации */}
        <div className={`mt-12 gap-0 flex flex-col ${css.linkContainer}`}>
          {window.innerWidth < 1000 ? (
            <BurgerMenu
              className={`${css.burgerMenu}`}
              onClick={() => setHeaderScreen(!headerScreen)}
            />
          ) : (
            ""
          )}
          <div className={`gap-0 flex flex-col  ${css.menuHeaderBurger}`}>
            <Link
              href={"./main1"}
              onClick={() => setActiveCategorie(0)}
              className={`${activeCategorie == 0 && "bg-gray-300"} ${
                headerScreen && "inline"
              } flex pr-8 pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
                headerScreen == true && css.linkItem
              }`}
            >
              <Administration />
              Администрирование
            </Link>
            <Link
              href={"/plans"}
              onClick={() => setActiveCategorie(1)}
              className={`${
                activeCategorie == 1 && "bg-gray-300"
              } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
                headerScreen == true && css.linkItem
              }`}
            >
              <Planning />
              Планирование
            </Link>
            <Link
              href={"/candidates"}
              onClick={() => setActiveCategorie(2)}
              className={`${
                activeCategorie == 2 && "bg-gray-300"
              } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
                headerScreen == true && css.linkItem
              }`}
            >
              <Showcase /> Витрина кандидатов
            </Link>
            <Link
              href={"/statisticAdmin"}
              onClick={() => setActiveCategorie(3)}
              className={`${
                activeCategorie == 3 && "bg-gray-300"
              } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
                headerScreen == true && css.linkItem
              }`}
            >
              <Statistics />
              Статистика
            </Link>
            <Link
              href={"/archive"}
              onClick={() => setActiveCategorie(4)}
              className={`${
                activeCategorie == 4 && "bg-gray-300"
              } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
                headerScreen == true && css.linkItem
              }`}
            >
              <Archive />
              Архив
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
      </div>
      <div
        className={`flex justify-center flex-col gap-0 mt-12 ${css.notificationContainer}`}
      >
        <Link
          href={"/notifications"}
          onClick={() => setActiveCategorie(5)}
          className={`${
            activeCategorie == 5 && "bg-gray-300"
          } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
            headerScreen == true && css.linkItem
          }`}
        >
          <BellDot />
          Уведомления
        </Link>
        <Link
          href={"/settings"}
          onClick={() => setActiveCategorie(6)}
          className={`${
            activeCategorie == 6 && "bg-gray-300"
          } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 ${
            headerScreen == true && css.linkItem
          }`}
        >
          <Settings />
          Настройки
        </Link>
      </div>
      <Image
        src={officeWoman}
        width={230}
        height={240}
        alt="graph"
        className={`absolute bottom-0 ${css.imageBottom}`}
      />
    </div>
  );
};
