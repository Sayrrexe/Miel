import { cn } from "@/lib/utils";
import { QutesFilter } from "./quotesFilter";
import { QuotesTable } from "./quotesTable";

interface Props {
  className?: string;
}

export const DashboardBossQuotes: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-[81vw] pt-[54px] pl-[31px] flex flex-col justify-between",
        className
      )}
    >
      <QutesFilter />
      <QuotesTable />
    </div>
  );
};
