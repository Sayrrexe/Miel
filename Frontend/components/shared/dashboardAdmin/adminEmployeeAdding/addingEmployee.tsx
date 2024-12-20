"use client";
import { cn } from "@/lib/utils";
import { AvatarLoading } from "../../avatarLoading";
import { useState } from "react";
import { Mail } from "lucide-react";
import {
  Office,
  PersonalInfo,
  Education,
  Statistics,
  AddInfo,
} from "./newEmpComponents";

export const AddingEmployee = () => {
  const [actCat, setActCat] = useState(0);
  const activePage = [
    <PersonalInfo key={0} />,
    <Office key={1} />,
    <Education key={2} />,
    <Statistics key={3} />,
    <AddInfo key={4} />,
  ];
  const userInfo = {
    name: "",
    surname: "",
    patronymic: "",
    birth: "",
    country: "",
    city: "",
    phone: "",
    email: "",
  };
  const categories: string[] = [
    "Персональная информация",
    "Офис",
    "Обучение",
    "Статистика",
    "Доп. Инфо",
  ];
  return (
    <div className={cn("mt-[52px] pl-10 w-full pr-10")}>
      <div className="w-full mr-10 border-[#CACBCD] border-solid border-[1px] pl-[23px] pb-[38px] pt-[18px] flex justify-between items-center">
        <div className="flex gap-[53px] items-center">
          <AvatarLoading />
          <div>
            <p>{userInfo.name}</p>
            <p className="py-[6px] px-2 bg-[#CACBCD] rounded-xl">Стажер</p>
          </div>
        </div>
        <div className="flex gap-4 items-center pr-9">
          <p className="flex gap-2 items-center border-[#960047] border-solid border-[2px] px-4 py-[10px] cursor-pointer hover:bg-[#96004675]">
            <Mail />
            Написать
          </p>
          <p className="border-[#960047] border-solid border-[2px] px-4 py-[10px] cursor-pointer hover:bg-[#96004675]">
            ...
          </p>
        </div>
      </div>
      <div className="flex mt-5 text-lg">
        {categories.map((categorie, index) => (
          <p
            onClick={() => setActCat(index)}
            className={`w-[20%] py-2 border-[1px]  border-solid border-[#CACBCD] text-center cursor-pointer ${
              index == actCat && "border-b-[0px]"
            }`}
            key={index}
          >
            {categorie}
          </p>
        ))}
      </div>
      {activePage[actCat]}
    </div>
  );
};
