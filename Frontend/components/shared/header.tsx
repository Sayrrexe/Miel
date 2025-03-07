"use client";
import { cn } from "@/lib/utils";
import { BellIcon, LogOut, MessageSquareText } from "lucide-react";
import Image from "next/image";
import logo from "../../public/assets/Vector.png";
import { useRouter } from "next/navigation";
import css from "./main.module.css";

export const Header = () => {
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
    <header
      className={cn(
        `flex justify-between border-b-[1px] h-[72px] border-gray-300 border-solid bg-[#960047] items-center ${css.header}`
      )}
    >
      <Image
        width={201}
        height={52}
        src={logo}
        alt="logo"
        className="cursor-pointer pl-10"
      />
      <i className={`text-white font-sans text-base font-d ${css.headertext}`}>
        Маленькие детали имеют решающее значение. Это те мелочи, которые делают
        большую разницу.
      </i>
      <div>
        <div className="flex py-7 pr-[41px] gap-[20px]">
          <BellIcon
            height={24}
            width={24}
            className="text-white cursor-pointer"
          />
          <MessageSquareText
            height={24}
            width={24}
            className="text-white cursor-pointer"
          />
          <LogOut
            height={24}
            width={24}
            className="text-white cursor-pointer"
            onClick={handleLogout} // Вызываем функцию с логикой выхода
          />
        </div>
      </div>
    </header>
  );
};
