/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import "./rsuite-default.css";
import { HistoryTable } from "./historyTable";

export const DashboardBossInvitingHistory = () => {
  return (
    <div className={cn("m-[53px] flex flex-col justify-between")}>
      <p className="text-4xl">История приглашений (офис Люберцы-1)</p>
      <HistoryTable />
    </div>
  );
};
