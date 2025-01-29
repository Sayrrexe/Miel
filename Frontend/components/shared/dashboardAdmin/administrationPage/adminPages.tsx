"use client";
import { cn } from "@/lib/utils";
import {
  ArchiveRestore,
  BellDot,
  ChartNoAxesColumnIncreasing,
  FileSliders,
  List,
  Settings,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import avatar from "../../../../public/assets/Ellipse 190@2x.png";
import officeWoman from "../../../../public/assets/Office woman.png";
import Link from "next/link";
import { useState } from "react";
import { useCategoryStore } from "@/store/context";

export const AdminPages = () => {
  const [activeCategorie, setActiveCategorie] = useState(
    location.pathname == "/main1"
      ? 0
      : location.pathname == "/plans"
      ? 1
      : location.pathname == "/statisticAdmin"
      ? 3
      : location.pathname == "/archive"
      ? 4
      : 2
  );
  const data = useCategoryStore((state) => state.data);
  return (
    <div
      className={cn("float-left bg-gray-200 h-[calc(100vh-71px)] w-[277px]")}
    >
      <div className="flex items-center ml-6 mt-5 gap-3 ">
        <Image
          width={40}
          height={40}
          src={avatar}
          alt="avatar"
          className="mb-2"
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

      <div className="mt-12 gap-0 flex flex-col">
        <Link
          href={"./main1"}
          onClick={() => setActiveCategorie(0)}
          className={`${
            activeCategorie == 0 && "bg-gray-300"
          } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300`}
        >
          <FileSliders />
          Администрирование
        </Link>
        <Link
          href={"/plans"}
          onClick={() => setActiveCategorie(1)}
          className={`${
            activeCategorie == 1 && "bg-gray-300"
          } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300`}
        >
          <List />
          Планирование
        </Link>
        <Link
          href={"/candidates"}
          onClick={() => setActiveCategorie(2)}
          className={`${
            activeCategorie == 2 && "bg-gray-300"
          } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300`}
        >
          <UsersRound /> Витрина кандидатов
        </Link>
        <Link
          href={"/statisticAdmin"}
          onClick={() => setActiveCategorie(3)}
          className={`${
            activeCategorie == 3 && "bg-gray-300"
          } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300`}
        >
          <ChartNoAxesColumnIncreasing />
          Статистика
        </Link>
        <Link
          href={"/archive"}
          onClick={() => setActiveCategorie(4)}
          className={`${
            activeCategorie == 4 && "bg-gray-300"
          } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300`}
        >
          <ArchiveRestore />
          Архив
        </Link>
      </div>
      <div className="flex justify-center flex-col gap-0 mt-12">
        <p className="flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300">
          <BellDot />
          Уведомления
        </p>
        <p className="flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300">
          <Settings />
          Настройки
        </p>
      </div>
      <Image
        src={officeWoman}
        width={230}
        height={240}
        alt="graph"
        className="absolute bottom-0"
      />
    </div>
  );
};
