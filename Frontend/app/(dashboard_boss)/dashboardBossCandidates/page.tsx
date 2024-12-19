import { DashboardBossCandidates } from "@/components/shared/dashboardBoss/candidatesPage";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const dashboardBossCandidates: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <main>
        <DashboardBossCandidates />
      </main>
    </div>
  );
};

export default dashboardBossCandidates;
