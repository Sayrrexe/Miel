"use client";

import { cn } from "@/lib/utils";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import frame from "../../../../public/assets/Frame.png";
import Image from "next/image";
import { Folder, Grid2X2, Heart, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCategoryStore } from "@/store/context";

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

  return (
    <div
      className={cn(
        "flex justify-between flex-col float-left bg-gray-200 h-[calc(100vh-71px)] w-[277px]"
      )}
    >
      <div className="">
        <div className="flex items-center ml-6 mt-5 gap-3 ">
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
      </div>
      <Image width={280} height={169} src={frame} alt="avatar" />
    </div>
  );
};
