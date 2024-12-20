import { cn } from "@/lib/utils";
import { QutesFilter } from "./quotesFilter";
import { QuotesTable } from "./quotesTable";

export const DashboardBossQuotes = () => {
  return (
    <div
      className={cn(
        "w-[81vw] pt-[54px] pl-[31px] flex flex-col justify-between"
      )}
    >
      <QutesFilter />
      <QuotesTable />
    </div>
  );
};
