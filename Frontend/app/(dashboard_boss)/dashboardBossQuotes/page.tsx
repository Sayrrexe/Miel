import { DashboardBossQuotes } from "@/components/shared/dashboardBoss/quotes";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const dashboardBossQuotes: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <main>
        <DashboardBossQuotes />
      </main>
    </div>
  );
};

export default dashboardBossQuotes;
