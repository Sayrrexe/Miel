import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { DateFilter } from "../../dateFilter";

export const QutesFilter = () => {
  return (
    <div className={cn("")}>
      <p className="text-4xl">Статистика по квотам (офис Люберцы-1)</p>
      <div className="pt-8 pl-[-23px] flex gap-4">
        <DateFilter />
        <Button className="bg-[#960047] w-[94px] hover:bg-[#960046bb]">
          Искать
        </Button>
      </div>
    </div>
  );
};
