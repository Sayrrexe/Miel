import { TaskStats } from "@/types/api";
import { Ellipsis } from "lucide-react";
import css from "./main.module.css";

interface TaskStatisticsProps {
  stats: TaskStats | null;
}

export const TaskStatistics = ({ stats }: TaskStatisticsProps) => {
  return (
    <div className={`border-solid border-[1px] border-[#CACBCD] h-[208px] p-5 ${css.mainCircleDiv}`}>
      <div className="w-full flex justify-between text-center">
        <p className="text-[#960047]">Успехи за неделю</p>
        <Ellipsis className="text-[#798087]" />
      </div>
      <div className={`flex mt-5 gap-[6px] ${css.circleDiv}`}>
        <div className="text-center">
          <p className="text-sm font-bold mb-[10px]">Создано</p>
          <div className="border-[#960047] border-solid border-[1px] h-[100px] w-[100px] rounded-full items-center flex flex-col">
            <p className="text-[#960047] text-4xl mt-4">
              {stats?.total_created || 0}
            </p>
            <p className="text-xs font-bold">задач</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold mb-[10px]">Завершено</p>
          <div className="border-[#960047] border-solid border-[1px] h-[100px] w-[100px] rounded-full items-center flex flex-col">
            <p className="text-[#960047] text-4xl mt-4">
              {stats?.total_completed || 0}
            </p>
            <p className="text-xs font-bold">задач</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold mb-[10px]">Удалено</p>
          <div className="border-[#960047] border-solid border-[1px] h-[100px] w-[100px] rounded-full items-center flex flex-col">
            <p className="text-[#960047] text-4xl mt-4">
              {stats?.total_deleted || 0}
            </p>
            <p className="text-xs font-bold">задач</p>
          </div>
        </div>
      </div>
    </div>
  );
};