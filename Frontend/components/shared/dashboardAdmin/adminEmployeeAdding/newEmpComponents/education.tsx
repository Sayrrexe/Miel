import { cn } from "@/lib/utils";
import { DropdownMenuTrigger, DropdownMenu, Button } from "@/components/ui";
import { ChevronDown } from "lucide-react";

export const Education = () => {
  return (
    <div
      className={cn(
        "flex pt-[25px] border-[1px]  border-solid border-[#CACBCD] border-t-0 pl-[9px] gap-6 pb-6"
      )}
    >
      <div className="flex gap-6">
        <div className="text-lg flex flex-col gap-3 ml-[29px] items-start">
          <div className="flex gap-2 items-center w-[300px] h-[44px] text-center">
            <div className="w-3 h-3 bg-[#01BEC2]" />
            Введение в профессию риелтор
          </div>
          <div className="flex gap-2 items-center h-[44px] text-center">
            <div className="w-3 h-3 bg-[#FFCB05]" />
            Базовый юридический курс
          </div>
          <div className="flex gap-2 items-center h-[44px] text-center">
            <div className="w-3 h-3 bg-[#991FA9]" />
            Курс “Ипотека”
          </div>
          <div className="flex gap-2 items-center h-[44px] text-center">
            <div className="w-3 h-3 bg-[#9CC700]" />
            Курс “Налогообложение”
          </div>
        </div>
        <div className="flex gap-3 flex-col w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="border-black border-solid border-opacity-40 border-[1px] h-[34px] min-h-11 w-[36vw] rounded-none ">
              <div className="flex justify-between opacity-40">
                <p className="ml-3">Люберцы-1</p>
                <ChevronDown className="mr-[9px]" />
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="border-black border-solid border-opacity-40 border-[1px] h-[34px] min-h-11 w-[36vw] rounded-none">
              <div className="flex justify-between opacity-40">
                <p className="ml-3">Вторичная недвижимость</p>
                <ChevronDown className="mr-[9px]" />
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="border-black border-solid border-opacity-40 min-h-11 w-[36vw] rounded-none border-[1px] h-[34px]">
              <div className="flex justify-between opacity-40">
                <p className="ml-3">Колесникова Мария Ивановна</p>
                <ChevronDown className="mr-[9px]" />
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="border-black border-solid border-opacity-40 min-h-11 w-[36vw] rounded-none border-[1px] h-[34px]">
              <div className="flex justify-between opacity-40">
                <p className="ml-3">+7-777-777-77-77</p>
                <ChevronDown className="mr-[9px]" />
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
      <Button className="bg-[#960047] text-lg rounded-none w-[212px] h-[44px] mr-8 mt-[15%] ml-[15%]">
        Сохранить изменения
      </Button>
    </div>
  );
};
