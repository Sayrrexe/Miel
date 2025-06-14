"use client";
import {useState} from "react";
import {
  Menu as BurgerMenu,
  LogOut, // Иконка бургера
} from "lucide-react";
import {Administration} from "@/components/ui/icons/administration";
import {Planning} from "@/components/ui/icons/plannig";
import {Showcase} from "@/components/ui/icons/showcase";
import {Statistics} from "@/components/ui/icons/statistics";
import {Archive} from "@/components/ui/icons/archive";
import {Notification} from "@/components/ui/icons/notification";
import {Settings} from "@/components/ui/icons/settings";
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

  // Базовые стили для всех ссылок
  const linkBaseStyles = `
    flex items-center gap-2 pl-9 w-[280px] h-[40px] cursor-pointer
    relative // Для позиционирования псевдоэлемента ::before
  `;

  // Стили для полосы при наведении (только для неактивных элементов)
  const hoverStyles = `
    hover:before:content-[''] hover:before:absolute hover:before:left-0 hover:before:top-0
    hover:before:h-full hover:before:w-[5px] hover:before:bg-menu-hvr
  `;

  // Стили для активной ссылки
  const activeStyles = `
    bg-menu-active
    hover:before:hidden // Отключаем полосу при наведении на активный элемент
  `;

  // Стили для headerScreen
  const headerScreenStyles = headerScreen ? "inline-flex" : "flex";

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
          <div className="flex flex-col h-full">
            <nav className="flex-1">
              <Link
                href="/main1"
                onClick={() => setActiveCategorie(0)}
                className={`
            ${linkBaseStyles}
            ${activeCategorie === 0 ? activeStyles : hoverStyles}
            ${headerScreenStyles}
          `}
              >
                <Administration />
                Администрирование
              </Link>
              <Link
                href="/plans"
                onClick={() => setActiveCategorie(1)}
                className={`
            ${linkBaseStyles}
            ${activeCategorie === 1 ? activeStyles : hoverStyles}
            ${headerScreenStyles}
          `}
              >
                <Planning />
                Планирование
              </Link>
              <Link
                href="/candidates"
                onClick={() => setActiveCategorie(2)}
                className={`
            ${linkBaseStyles}
            ${activeCategorie === 2 ? activeStyles : hoverStyles}
            ${headerScreenStyles}
          `}
              >
                <Showcase />
                Витрина кандидатов
              </Link>
              <Link
                href="/statisticAdmin"
                onClick={() => setActiveCategorie(3)}
                className={`
            ${linkBaseStyles}
            ${activeCategorie === 3 ? activeStyles : hoverStyles}
            ${headerScreenStyles}
          `}
              >
                <Statistics />
                Статистика
              </Link>
              <Link
                href="/archive"
                onClick={() => setActiveCategorie(4)}
                className={`
            ${linkBaseStyles}
            ${activeCategorie === 4 ? activeStyles : hoverStyles}
            ${headerScreenStyles}
          `}
              >
                <Archive />
                Архив
              </Link>
            </nav>
            <div className="flex justify-center">
              {window.innerWidth < 1000 ? (
                <LogOut
                  height={24}
                  width={24}
                  className="cursor-pointer mt-1 mr-5"
                  onClick={handleLogout}
                />
              ) : null}
            </div>
            <div className={`flex justify-center flex-col gap-0 mt-12 ${css.notificationContainer}`}>
              <Link
                href="/notifications"
                onClick={() => setActiveCategorie(5)}
                className={`
            ${linkBaseStyles}
            ${activeCategorie === 5 ? activeStyles : hoverStyles}
            ${headerScreenStyles}
          `}
              >
                <Notification />
                Уведомления
              </Link>
              <Link
                href="/settings"
                onClick={() => setActiveCategorie(6)}
                className={`
            ${linkBaseStyles}
            ${activeCategorie === 6 ? activeStyles : hoverStyles}
            ${headerScreenStyles}
          `}
              >
                <Settings />
                Настройки
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={officeWoman}
          width={230}
          height={240}
          alt="graph"
          className={`absolute bottom-0 ${css.imageBottom}`}
        />
      </div>
    </div>
  );
};
