/* eslint-disable @next/next/no-img-element */
import { Button, DropdownMenu, DropdownMenuTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import "./rsuite-default.css";
import { HistoryTable } from "./historyTable";
import { DateFilter } from "../../dateFilter";

interface Props {
  className?: string;
}

export const DashboardBossInvitingHistory: React.FC<Props> = ({
  className,
}) => {
  return (
    <div className={cn("m-[53px] flex flex-col justify-between", className)}>
      <p className="text-4xl">История приглашений (офис Люберцы-1)</p>
      <div>
        <div className="pt-8 pl-[-23px] flex gap-4">
          <DateFilter />
          <DropdownMenu>
            <DropdownMenuTrigger className="border-black border-solid border-opacity-40 w-[196px] border-[1px] h-[34px]">
              <div className="flex justify-between opacity-40">
                <p className="ml-3">Статус</p>
                <ChevronDown className="mr-[9px]" />
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <Button className="bg-[#960047] w-[94px] hover:bg-[#960046bb]">
            Искать
          </Button>
        </div>
      </div>
      <HistoryTable />
    </div>
  );
};
