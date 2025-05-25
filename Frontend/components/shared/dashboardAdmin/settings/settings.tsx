/* eslint-disable @next/next/no-img-element */
"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import user from "@/public/assets/Скриншот-12-03-2025 05_13_05.jpg";
import css from "./main.module.css";
import tg from "@/public/assets/icons8-телеграм-50.png";
import ws from "@/public/assets/icons8-whatsapp-50.png";
import { Checkbox } from "@/components/ui";

export const Settings = () => {
  return (
    <div className={cn("w-[77.5vw] h-[875px]")}>
      <Image
        className={`ml-[10%] mr-auto absolute pb-[-20px] ${css.image}`}
        src={user}
        style={{ objectFit: "contain" }}
        alt="baloons"
      />
      <div
        className={`absolute left-[590px] ml-[10%] mt-[250px] flex flex-col gap-10 ${css.bigDiv}`}
      >
        <div
          className={`flex border-[#CACBCD] border-solid border-[1px] rounded-3xl py-3 px-4 items-center ${css.divWords}`}
        >
          <Image src={tg} alt="baloons" width={16} height={16} />
          <p className={`ml-3 ${css.words}`}>Использовать Telegram</p>
          <Checkbox className="ml-[39px]" />
        </div>
        <div
          className={`flex border-[#CACBCD] border-solid border-[1px] rounded-3xl py-3 px-4 items-center ${css.divWords}`}
        >
          <Image src={ws} alt="baloons" width={16} height={16} />
          <p className={`ml-3 ${css.words}`}>Использовать WhatsApp</p>
          <Checkbox className="ml-[33px]" />
        </div>
      </div>
    </div>
  );
};
