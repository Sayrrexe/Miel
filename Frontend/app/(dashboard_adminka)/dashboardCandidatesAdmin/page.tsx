
import { AdminCandidates } from "@/components/shared/dashboardAdmin/candidatesAdmin";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const DashboardCandidatesAdmin: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <AdminCandidates />
    </div>
  );
};

export default DashboardCandidatesAdmin;
