import { TaskStats } from "@/types/api";

interface TaskInsightsProps {
  stats: TaskStats | null;
}

export const TaskInsights = ({ stats }: TaskInsightsProps) => {
  return (
    <div className="border-solid border-[1px] border-[#CACBCD] p-5">
      <p className="text-xl text-[#01BEC2]">Наблюдение</p>
      <p className="mt-5">
        Больше всего задач вы{" "}
        <span className="text-[#01BEC2]">создаете</span> в{" "}
        {stats?.max_created_day || ""}
      </p>
      <p>
        Больше всего задач вы завершаете во {stats?.max_completed_day || ""}
      </p>
    </div>
  );
};