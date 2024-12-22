import { Button, DropdownMenu, DropdownMenuTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export const BossFilters = () => {
  return (
    <div className={cn("")}>
      <div className="pt-8 pl-[-23px] flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="border-black border-solid border-opacity-40 w-[196px] border-[1px] h-[34px]">
            <div className="flex justify-between opacity-40">
              <p className="ml-3">Новые</p>
              <ChevronDown className="mr-[9px]" />
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="border-black border-solid border-opacity-40 w-[196px] border-[1px] h-[34px]">
            <div className="flex justify-between opacity-40">
              <p className="ml-3">Возраст</p>
              <ChevronDown className="mr-[9px]" />
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="border-black border-solid border-opacity-40 w-[196px] border-[1px] h-[34px]">
            <div className="flex justify-between opacity-40">
              <p className="ml-3">Обучение</p>
              <ChevronDown className="mr-[9px]" />
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="border-black border-solid border-opacity-40 w-[196px] border-[1px] h-[34px]">
            <div className="flex justify-between opacity-40">
              <p className="ml-3">Образование</p>
              <ChevronDown className="mr-[9px]" />
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
        <Button className="bg-[#960047] w-[94px] hover:bg-[#960046bb]">
          Искать
        </Button>
      </div>
    </div>
  );
};
