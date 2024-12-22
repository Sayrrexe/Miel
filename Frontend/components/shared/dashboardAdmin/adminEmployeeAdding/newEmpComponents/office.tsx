import { DropdownMenuTrigger, DropdownMenu } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";

export const Office = () => {
  return (
    <div
      className={cn(
        "flex pt-[25px] border-[1px]  border-solid border-[#CACBCD] border-t-0 pl-[9px] gap-6 pb-6 items-start"
      )}
    >
      <div className="text-lg flex flex-col gap-3 justify-center ml-[29px] items-start">
        <p className="h-11 flex items-center">Офис</p>
        <p className="h-11 flex items-center">Подразделение</p>
        <p className="h-11 flex items-center">Руководитель</p>
        <p className="h-11 flex items-center w-[200px]">Телефон рабочий</p>
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
      <Button className="bg-[#960047] text-lg rounded-none w-[212px] h-[44px] mr-8 mt-[15%]">
        Сохранить изменения
      </Button>
    </div>
  );
};
