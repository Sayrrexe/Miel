"use client";

import { cn } from "@/lib/utils";
import avatar from "../../../../public/assets/Ellipse 190@2x.png";
import Image from "next/image";
import graph from "../../../../public/assets/Frame 738001457.png";
import { Folder, Grid2X2, Heart, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCategoryStore } from "@/store/context";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";

export const BossPages = () => {
  const location = useLocation();
  const [activeCategorie, setActiveCategorie] = useState(
    location.pathname == "/dashboardBossFavored"
      ? 1
      : location.pathname == "/dashboardBossInvitingHistory"
      ? 2
      : location.pathname == "/dashboardBossQuotes"
      ? 3
      : 0
  );
  const data = useCategoryStore((state) => state.data);

  return (
    <div className={cn("")}>
      <div className="float-left bg-gray-200 h-[calc(100vh-71px)] w-[277px]">
        {data.username !== "" ? (
          <div className="flex items-center ml-6 mt-5 gap-3 ">
            <Image
              width={40}
              height={40}
              src={avatar}
              alt="avatar"
              className="mb-2"
            />
            <div>
              <p className="text-xs font-bold">Привет, Мария 👋</p>
              <p className="text-sm">Колесникова Мария</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center ml-6 mt-5 gap-3 ">
            <Image
              width={40}
              height={40}
              src={user}
              alt="avatar"
              className="mb-2"
            />
            <Link className="mb-[6px] hover:underline" href={"/authorisation"}>
              Войти в аккаунт
            </Link>
          </div>
        )}

        <div className="mt-12 gap-0 flex flex-col">
          <Link
            href={"./main2"}
            onClick={() => setActiveCategorie(0)}
            className={`${
              activeCategorie == 0 && "bg-gray-300"
            } flex pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300`}
          >
            <Grid2X2 />
            Витрина кандидатов
          </Link>
          <Link
            href={"./candidatesFavored"}
            onClick={() => setActiveCategorie(1)}
            className={`${
              activeCategorie == 1 && "bg-gray-300"
            } pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 flex`}
          >
            <Heart />
            Избранное
          </Link>
          <Link
            href={"./invitingHistory"}
            onClick={() => setActiveCategorie(2)}
            className={`${
              activeCategorie == 2 && "bg-gray-300"
            } pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 flex`}
          >
            <Folder />
            История приглашений
          </Link>
          <Link
            href={"./quotes"}
            onClick={() => setActiveCategorie(3)}
            className={`${
              activeCategorie == 3 && "bg-gray-300"
            } pl-[10px] p-[10px] gap-[9px] cursor-pointer hover:bg-gray-300 flex`}
          >
            <Users />
            Статистика по квотам
          </Link>
        </div>
        <Image
          src={graph}
          width={198}
          height={243}
          alt="graph"
          className="mt-[96px] ml-[39px]"
        />
      </div>
    </div>
  );
};
