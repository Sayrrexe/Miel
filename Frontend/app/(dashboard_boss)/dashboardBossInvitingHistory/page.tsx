import { DashboardBossInvitingHistory } from "@/components/shared/dashboardBoss/invitingHistory";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const dashboardBossInvitingHistory: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <main>
        <DashboardBossInvitingHistory />
      </main>
    </div>
  );
};

export default dashboardBossInvitingHistory;
