import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger } from "../ui";
import { CalendarDays } from "lucide-react";

export const DateFilter: React.FC<Props> = () => {
  return (
    <div className={cn("pl-[-23px] flex gap-4 items-center")}>
      <DropdownMenu>
        <DropdownMenuTrigger className="border-black border-solid border-opacity-40 w-[196px] border-[1px] h-[34px]">
          <div className="flex justify-between opacity-40">
            <p className="ml-3">Дата начала</p>
            <CalendarDays className="mr-[9px]" />
          </div>
        </DropdownMenuTrigger>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="border-black border-solid border-opacity-40 w-[196px] border-[1px] h-[34px]">
          <div className="flex justify-between opacity-40">
            <p className="ml-3">Дата завершения</p>
            <CalendarDays className="mr-[9px]" />
          </div>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
};
