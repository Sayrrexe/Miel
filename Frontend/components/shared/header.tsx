"use client";
import { cn } from "@/lib/utils";
import { BellIcon, LogOut, MessageSquareText } from "lucide-react";
import Image from "next/image";
import logo from "../../public/assets/Vector.png";

export const Header = () => {
  return (
    <header
      className={cn(
        "flex justify-between border-b-[1px] h-[72px] border-gray-300 border-solid bg-[#960047] items-center"
      )}
    >
      <Image
        width={201}
        height={52}
        src={logo}
        alt="logo"
        className="cursor-pointer pl-10"
      />
      <i className="text-white font-sans text-xl font-d">
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
          />
        </div>
      </div>
    </header>
  );
};
